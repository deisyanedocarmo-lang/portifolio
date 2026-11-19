// Configuração do Astro. A aluna não precisa mexer aqui: tudo o que é personalizável
// fica em src/data/creator.ts.
import { defineConfig, fontProviders } from 'astro/config';
import { networkInterfaces } from 'node:os';
import { FONTES, variavelDaFonte } from './src/lib/temas.ts';

const pacote = (nome) => nome.toLowerCase().replaceAll(' ', '-');

const previewShares = new Map();
const previewShareApi = () => ({
  name: 'portfolio-mobile-preview-share',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use(async (request, response, next) => {
      if (!request.url?.startsWith('/__preview_share/')) return next();
      const parts = new URL(request.url, 'http://localhost').pathname.split('/').filter(Boolean);
      if (parts[1] === 'network-origin' && request.method === 'GET') {
        const address = server.httpServer.address();
        const port = address && typeof address === 'object' ? address.port : undefined;
        const localAddress = Object.values(networkInterfaces()).flat().find((item) => item && item.family === 'IPv4' && !item.internal && /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(item.address));
        response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
        response.end(JSON.stringify({ origin: localAddress && port ? `http://${localAddress.address}:${port}` : null }));
        return;
      }
      const token = parts[1];
      const resource = parts[2];
      const id = parts.slice(3).map(decodeURIComponent).join('/');
      if (!/^[0-9a-f-]{36}$/i.test(token || '')) {
        response.writeHead(404).end();
        return;
      }
      let share = previewShares.get(token);
      if (share && share.expires < Date.now()) {
        previewShares.delete(token);
        share = undefined;
      }
      const sendJson = (status, payload) => {
        response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
        response.end(JSON.stringify(payload));
      };
      try {
        if (resource === 'state' && request.method === 'PUT') {
          const chunks = [];
          let size = 0;
          for await (const chunk of request) {
            size += chunk.length;
            if (size > 5 * 1024 * 1024) { sendJson(413, { error: 'Rascunho muito grande.' }); return; }
            chunks.push(chunk);
          }
          const payload = JSON.parse(Buffer.concat(chunks).toString('utf8'));
          share = share ?? { state: null, media: new Map(), expires: Date.now() + 8 * 60 * 60 * 1000 };
          share.state = payload.state;
          share.brands = Array.isArray(payload.brands) ? payload.brands : [];
          share.expires = Date.now() + 8 * 60 * 60 * 1000;
          previewShares.set(token, share);
          sendJson(200, { saved: true });
          return;
        }
        if (!share) { sendJson(404, { error: 'Prévia não encontrada ou expirada.' }); return; }
        if (resource === 'state' && request.method === 'GET') {
          sendJson(200, { state: share.state, brands: share.brands || [], mediaIds: [...share.media.keys()] });
          return;
        }
        if (resource === 'media' && id && request.method === 'PUT') {
          const copyFrom = String(request.headers['x-preview-share-copy-from'] || '');
          if (copyFrom) {
            const source = share?.media.get(copyFrom);
            if (!source) { sendJson(404, { error: 'Arquivo de referência da prévia não encontrado.' }); return; }
            share.media.set(id, source);
            share.expires = Date.now() + 8 * 60 * 60 * 1000;
            sendJson(200, { saved: true, reused: true });
            return;
          }
          const chunks = [];
          let size = 0;
          for await (const chunk of request) {
            size += chunk.length;
            if (size > 300 * 1024 * 1024) { sendJson(413, { error: 'Arquivo grande demais para a prévia.' }); return; }
            chunks.push(chunk);
          }
          share.media.set(id, { data: Buffer.concat(chunks), type: String(request.headers['content-type'] || 'application/octet-stream') });
          share.expires = Date.now() + 8 * 60 * 60 * 1000;
          sendJson(200, { saved: true });
          return;
        }
        if (resource === 'media' && id && request.method === 'GET') {
          const media = share.media.get(id);
          if (!media) { response.writeHead(404).end(); return; }
          const data = media.data;
          const headers = { 'Content-Type': media.type, 'Cache-Control': 'no-store', 'Accept-Ranges': 'bytes' };
          const range = String(request.headers.range || '').match(/^bytes=(\d*)-(\d*)$/);
          if (range) {
            const size = data.length;
            let start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2] || 0));
            let end = range[2] && range[1] ? Number(range[2]) : size - 1;
            if (!range[1] && range[2]) end = size - 1;
            if (start >= size || end < start || !size) {
              response.writeHead(416, { ...headers, 'Content-Range': `bytes */${size}` }).end();
              return;
            }
            end = Math.min(end, size - 1);
            response.writeHead(206, { ...headers, 'Content-Length': end - start + 1, 'Content-Range': `bytes ${start}-${end}/${size}` });
            response.end(data.subarray(start, end + 1));
            return;
          }
          response.writeHead(200, { ...headers, 'Content-Length': data.length });
          response.end(data);
          return;
        }
        response.writeHead(405).end();
      } catch (error) {
        sendJson(400, { error: error instanceof Error ? error.message : 'Falha ao preparar a prévia.' });
      }
    });
  },
});

export default defineConfig({
  vite: {
    server: { allowedHosts: ['virginia-explanation-ought-attempt.trycloudflare.com'] },
    plugins: [previewShareApi()],
    optimizeDeps: { include: ['@ffmpeg/ffmpeg'] },
  },
  // Site de uma página só: o CSS vai dentro do HTML e a página não espera outro arquivo para aparecer.
  build: { inlineStylesheets: 'always' },
  // Sem a barra de ferramentas do Astro no "npm run dev": ela confunde quem não programa.
  devToolbar: { enabled: false },
  // Fontes servidas pelo próprio site, a partir dos pacotes @fontsource (só o alfabeto latino,
  // que cobre o português). Só as do tema escolhido entram na página.
  fonts: Object.entries(FONTES).map(([chave, fonte]) => ({
    provider: fontProviders.local(),
    name: fonte.nome,
    cssVariable: variavelDaFonte(chave),
    fallbacks: [fonte.generica],
    options: {
      variants: fonte.pesos.flatMap((peso) =>
        (fonte.italico ? ['normal', 'italic'] : ['normal']).map((estilo) => ({
          weight: peso,
          style: estilo,
          src: [`./node_modules/@fontsource/${pacote(fonte.nome)}/files/${pacote(fonte.nome)}-latin-${peso}-${estilo}.woff2`],
        })),
      ),
    },
  })),
});
