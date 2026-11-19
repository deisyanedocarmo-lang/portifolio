/** Une os trechos assistidos; pular ou repetir um trecho não aumenta a cobertura. */
export function unirTrechos(trechos: [number, number][], inicio: number, fim: number): [number, number][] {
  const resultado: [number, number][] = [];
  for (const trecho of [...trechos, [inicio, fim] as [number, number]].sort((a, b) => a[0] - b[0])) {
    if (trecho[1] <= trecho[0]) continue;
    const ultimo = resultado.at(-1);
    if (ultimo && trecho[0] <= ultimo[1]) ultimo[1] = Math.max(ultimo[1], trecho[1]);
    else resultado.push([...trecho]);
  }
  return resultado;
}

export function iniciarMetricas(id: string, origem: string) {
  if (!/^G-[A-Z0-9]+$/.test(id) || location.origin !== origem ||
    /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) ||
    new URLSearchParams(location.search).has('mobile-preview') || location.pathname.startsWith('/temas/')) return;
  const w = window as typeof window & { dataLayer?: unknown[]; gtag?: (...args: any[]) => void; [key: `ga-disable-${string}`]: boolean };
  const painel = document.querySelector<HTMLElement>('[data-metricas-aviso]');
  const chave = 'portfolio-metricas-consentimento-v1';
  let permitido = false;
  let carregado = false;
  type Estado = { iniciou: boolean; anterior: number; trechos: [number, number][]; marcos: Set<number> };
  let estados = new WeakMap<HTMLVideoElement, Estado>();
  const ler = () => {
    try {
      const salvo = JSON.parse(localStorage.getItem(chave) || 'null');
      const idade = Date.now() - salvo?.quando;
      return typeof salvo?.aceito === 'boolean' && idade >= 0 && idade < 180 * 86400000 ? salvo.aceito as boolean : null;
    } catch { return null; }
  };
  const carregar = () => {
    if (carregado) return;
    carregado = true;
    w.dataLayer = w.dataLayer || [];
    w.gtag = function () { w.dataLayer!.push(arguments); };
    w.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    w.gtag('consent', 'update', { analytics_storage: 'granted' });
    w.gtag('js', new Date());
    // Apenas parâmetros de campanha; não envia outros campos da URL nem fragmentos.
    const url = new URL(location.href);
    const campanha = new URLSearchParams();
    for (const nome of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
      const valor = url.searchParams.get(nome);
      if (valor) campanha.set(nome, valor.slice(0, 100));
    }
    const referencia = (() => { try { return new URL(document.referrer).origin; } catch { return ''; } })();
    w.gtag('config', id, { page_location: `${url.origin}${url.pathname}${campanha.size ? '?' + campanha : ''}`, page_referrer: referencia,
      allow_google_signals: false, allow_ad_personalization_signals: false, cookie_flags: 'SameSite=Lax;Secure' });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.append(script);
  };
  const apagarCookies = () => {
    const partes = location.hostname.split('.');
    const dominios = ['', ...partes.map((_, i) => '.' + partes.slice(i).join('.'))];
    const caminhos = ['/', ...location.pathname.split('/').map((_, i, todos) => todos.slice(0, i + 1).join('/') || '/')];
    for (const cookie of document.cookie.split(';')) {
      const nome = cookie.split('=')[0].trim();
      if (!/^_ga(?:_|$)|^_gid$|^_gat/.test(nome)) continue;
      for (const dominio of dominios) for (const caminho of caminhos)
        document.cookie = `${nome}=; Max-Age=0; path=${caminho}${dominio ? '; domain=' + dominio : ''}; Secure; SameSite=Lax`;
    }
  };
  const aplicar = (aceito: boolean) => {
    if (!aceito) estados = new WeakMap();
    permitido = aceito;
    w[`ga-disable-${id}`] = !aceito;
    if (aceito) carregar();
    else apagarCookies();
    if (painel) painel.hidden = true;
  };
  const escolher = (aceito: boolean) => {
    try { localStorage.setItem(chave, JSON.stringify({ aceito, quando: Date.now() })); } catch { /* escolha vale nesta página */ }
    aplicar(aceito);
    document.querySelector<HTMLButtonElement>('[data-metricas-opcoes]')?.focus();
  };
  document.querySelector('[data-metricas-aceitar]')?.addEventListener('click', () => escolher(true));
  document.querySelector('[data-metricas-recusar]')?.addEventListener('click', () => escolher(false));
  document.querySelector('[data-metricas-opcoes]')?.addEventListener('click', () => {
    if (painel) painel.hidden = false;
    document.querySelector<HTMLButtonElement>('[data-metricas-recusar]')?.focus();
  });
  window.addEventListener('storage', (event) => { if (event.key === chave) aplicar(ler() === true); });
  const escolha = ler();
  if (escolha === null) { if (painel) painel.hidden = false; }
  else aplicar(escolha);
  const enviar = (nome: string, dados: Record<string, string | number>) => {
    if (permitido) w.gtag?.('event', nome, { ...dados, send_to: id });
  };
  const dadosVideo = (v: HTMLVideoElement) => ({ video_id: v.dataset.metricaId || '', video_title: v.dataset.metricaTitulo || '', video_category: v.dataset.metricaCategoria || 'outros' });
  document.addEventListener('click', (event) => {
    if (!event.isTrusted || !permitido || !(event.target instanceof Element)) return;
    const botao = event.target.closest('.tocar');
    const video = botao?.closest('.video')?.querySelector<HTMLVideoElement>('video[data-metrica-id]');
    if (video) estados.set(video, { iniciou: false, anterior: 0, trechos: [], marcos: new Set() });
    const filtro = event.target.closest<HTMLElement>('[data-filter]');
    if (filtro) enviar('category_select', { category: filtro.dataset.filter || 'todos' });
    const link = event.target.closest<HTMLAnchorElement>('a[href]');
    if (!link) return;
    const url = new URL(link.href, location.href);
    const canal = url.protocol === 'mailto:' ? 'email' : /^(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)$/.test(url.hostname) ? 'whatsapp' : url.origin === location.origin && url.hash === '#contato' ? 'contato' : '';
    if (canal) enviar('contact_click', { contact_channel: canal, contact_position: link.closest('section')?.id || (link.closest('header') ? 'cabecalho' : 'pagina') });
  }, true);
  document.addEventListener('playing', (event) => {
    const v = event.target;
    if (!(v instanceof HTMLVideoElement) || !permitido) return;
    const estado = estados.get(v);
    if (!estado || v.muted || v.loop) return;
    estado.anterior = v.currentTime;
    if (!estado.iniciou) { estado.iniciou = true; enviar('video_start', dadosVideo(v)); }
  }, true);
  document.addEventListener('timeupdate', (event) => {
    const v = event.target;
    if (!(v instanceof HTMLVideoElement)) return;
    const estado = estados.get(v);
    if (!permitido || !estado?.iniciou || v.muted || v.loop || v.paused || v.seeking || !Number.isFinite(v.duration) || v.duration <= 0) return;
    const delta = v.currentTime - estado.anterior;
    if (delta > 0 && delta <= 2) estado.trechos = unirTrechos(estado.trechos, estado.anterior, v.currentTime);
    estado.anterior = v.currentTime;
    const porcentagem = estado.trechos.reduce((total, [a, b]) => total + b - a, 0) / v.duration * 100;
    for (const marco of [25, 50, 75]) if (porcentagem >= marco && !estado.marcos.has(marco)) {
      estado.marcos.add(marco); enviar('video_progress', { ...dadosVideo(v), video_percent: marco });
    }
  }, true);
  document.addEventListener('seeked', (event) => {
    const v = event.target;
    if (v instanceof HTMLVideoElement) { const estado = estados.get(v); if (estado) estado.anterior = v.currentTime; }
  }, true);
  document.addEventListener('ended', (event) => {
    const v = event.target;
    if (!(v instanceof HTMLVideoElement)) return;
    const estado = estados.get(v);
    if (estado?.iniciou) { enviar('video_complete', dadosVideo(v)); estados.delete(v); }
  }, true);
}
