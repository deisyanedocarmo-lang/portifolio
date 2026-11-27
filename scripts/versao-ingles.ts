// Monta a versão em inglês do site (/en/ e /en/links/) depois do build, trocando os textos
// do site em português pelas traduções de src/data/ingles.ts. Não precisa mexer aqui:
// para traduzir um texto novo, edite src/data/ingles.ts.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mensagens, regras, semTraducao, traducoes } from '../src/data/ingles.ts';

const PAGINAS = ['', 'links/'];
const ATRIBUTOS = ['alt', 'aria-label', 'title', 'placeholder', 'content'];

const decodificar = (s: string) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
const escaparTexto = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escaparAtributo = (s: string) => escaparTexto(s).replace(/"/g, '&quot;');
const normalizar = (s: string) => s.replace(/\s+/g, ' ').trim();

const resumir = (texto: string, limite: number) =>
  texto.length <= limite ? texto : texto.slice(0, texto.lastIndexOf(' ', limite - 1)).replace(/[,.;:]$/, '') + '…';

/** Traduz um texto inteiro. Devolve undefined se não souber. */
function traduzir(texto: string): string | undefined {
  const t = normalizar(texto);
  if (!t) return undefined;
  if (traducoes[t] !== undefined) return traducoes[t];
  for (const [padrao, montar] of regras) {
    const m = t.match(padrao);
    if (m) return montar((s) => traduzir(s) ?? s, ...m.slice(1));
  }
  // Descrição resumida (termina com "…"): traduz o texto completo e resume de novo.
  if (t.endsWith('…')) {
    const inicio = t.slice(0, -1);
    const completo = Object.keys(traducoes).find((k) => k.startsWith(inicio));
    if (completo) return resumir(traducoes[completo], 160);
  }
  return undefined;
}

// Sinais de que um texto ainda está em português.
const PALAVRAS_PT = /\b(de|da|do|das|dos|para|com|você|meu|minha|seu|sua|não|uma|um|em|que|os|as|e)\b|[ãõçâêáéíóú]/i;
const precisaTraducao = (t: string) => PALAVRAS_PT.test(t) && !semTraducao.includes(t) && !/^[\w.+-]+@[\w.-]+$/.test(t);

export function gerarVersaoEmIngles(pastaDist: URL, base: string) {
  const raiz = fileURLToPath(pastaDist);
  const basePadrao = base.endsWith('/') ? base : `${base}/`;
  const faltando = new Set<string>();

  for (const rota of PAGINAS) {
    const origem = join(raiz, rota, 'index.html');
    let html = readFileSync(origem, 'utf8');

    // Separa scripts e estilos para não mexer no código por engano.
    const blocos: string[] = [];
    html = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, (bloco) => {
      blocos.push(bloco);
      return `\u0000${blocos.length - 1}\u0000`;
    });

    // Textos entre as tags.
    html = html.replace(/>([^<>\u0000]+)</g, (todo, texto: string) => {
      const limpo = normalizar(decodificar(texto));
      if (!limpo || !/\p{L}/u.test(limpo)) return todo;
      const traduzido = traduzir(limpo);
      if (traduzido === undefined) {
        if (precisaTraducao(limpo)) faltando.add(limpo);
        return todo;
      }
      const [, antes, depois] = texto.match(/^(\s*)[\s\S]*?(\s*)$/)!;
      return `>${antes}${escaparTexto(traduzido)}${depois}<`;
    });

    // Atributos com texto (descrição de imagem, rótulos para leitores de tela, meta tags).
    html = html.replace(new RegExp(`(\\s(?:${ATRIBUTOS.join('|')})=")([^"]*)(")`, 'g'), (todo, abre, valor: string, fecha) => {
      const limpo = normalizar(decodificar(valor));
      if (!limpo || !/\p{L}{2}/u.test(limpo) || /^https?:/.test(limpo)) return todo;
      const traduzido = traduzir(limpo);
      if (traduzido === undefined) {
        if (precisaTraducao(limpo) && !/[=;]/.test(limpo)) faltando.add(limpo);
        return todo;
      }
      return `${abre}${escaparAtributo(traduzido)}${fecha}`;
    });

    // Mensagens prontas do WhatsApp e assunto do e-mail.
    html = html.replace(/(href="(?:https:\/\/wa\.me\/\d+\?text=|mailto:[^"?]+\?subject=))([^"]*)"/g, (todo, inicio, codificado: string) => {
      const texto = decodeURIComponent(decodificar(codificado));
      const traduzido = mensagens[texto];
      if (!traduzido) {
        faltando.add(`Mensagem: ${texto}`);
        return todo;
      }
      return `${inicio}${encodeURIComponent(traduzido)}"`;
    });

    // Links entre as páginas passam a apontar para a versão em inglês
    // (menos os do botão de idioma, que têm hreflang).
    const baseRegex = basePadrao.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    html = html.replace(
      new RegExp(`(<a\\b(?![^>]*\\bhreflang=)[^>]*\\bhref=")${baseRegex}((?:links/)?(?:#[^"]*)?)"`, 'g'),
      (_, inicio, resto) => `${inicio}${basePadrao}en/${resto}"`,
    );

    // Botão de idioma: marca o EN como o atual.
    html = html.replace(/(<a\b[^>]*\bhreflang="pt-BR"[^>]*?)\s+aria-current="true"/g, '$1');
    html = html.replace(/(<a\b[^>]*\bhreflang="en")/g, '$1 aria-current="true"');

    // Idioma da página, endereço oficial e prévia de compartilhamento.
    html = html.replace(/<html lang="pt-BR"/, '<html lang="en"');
    html = html.replace(/(<meta property="og:locale" content=")pt_BR"/, '$1en_US"');
    html = html.replace(/(<link rel="canonical" href="|<meta property="og:url" content=")([^"]+)"/g, (_, inicio, url: string) => {
      try {
        const u = new URL(url);
        if (u.pathname.startsWith(basePadrao)) u.pathname = `${basePadrao}en/${u.pathname.slice(basePadrao.length)}`;
        return `${inicio}${u.href}"`;
      } catch {
        return `${inicio}${url}"`;
      }
    });

    // Devolve scripts e estilos, traduzindo só os textos conhecidos.
    html = html.replace(/\u0000(\d+)\u0000/g, (_, i) => {
      let bloco = blocos[Number(i)];
      if (/type="application\/ld\+json"/.test(bloco)) {
        bloco = bloco.replace(/(<script[^>]*>)([\s\S]*?)(<\/script>)/, (_t, a, json, b) => {
          const dados = JSON.parse(json, (_k, v) => (typeof v === 'string' ? (traduzir(v) ?? v) : v));
          return a + JSON.stringify(dados).replaceAll('<', '\\u003c') + b;
        });
      } else if (/^<script/i.test(bloco)) {
        bloco = bloco
          .replace(/`Código \$\{(\w+)\} copiado\.`/g, '`Code ${$1} copied.`')
          .replace(/`Código: \$\{(\w+)\}\. Toque e segure para copiar\.`/g, '`Code: ${$1}. Tap and hold to copy.`')
          .replace(/(["'`])Copiado\1/g, '$1Copied$1')
          .replace(/(["'`])Copiar\1/g, '$1Copy$1');
      }
      return bloco;
    });

    const destino = join(raiz, 'en', rota, 'index.html');
    mkdirSync(dirname(destino), { recursive: true });
    writeFileSync(destino, html);
  }

  if (faltando.size)
    console.warn(
      `\n⚠️  Versão em inglês: ${faltando.size} texto(s) sem tradução (ficaram em português). Acrescente em src/data/ingles.ts:\n${[...faltando].map((t) => `   • ${t}`).join('\n')}\n`,
    );
  else console.log('\n✅ Versão em inglês gerada em /en/ e /en/links/, com todos os textos traduzidos.\n');
}
