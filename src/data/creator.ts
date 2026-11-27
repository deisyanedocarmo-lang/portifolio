// ════════════════════════════════════════════════════════════════════════════
//  SEU PORTFÓLIO
//  Este é o único arquivo que você precisa mudar para personalizar o site.
//
//  Regrinhas para não quebrar nada:
//  • Texto fica sempre entre aspas: 'assim'. Se o texto tiver aspas simples
//    dentro (ex.: d'água), use aspas duplas por fora: "pão d'água".
//  • Toda linha de campo termina com vírgula.
//  • true = sim, false = não (sem aspas).
//  • Para esconder uma seção inteira, mude `mostrar` para false.
//  • Seção opcional com a lista vazia [] some sozinha do site.
//
//  Se algo estiver errado, o build mostra uma mensagem em português dizendo
//  onde está o problema (ex.: "Faltou o nome do arquivo do vídeo 3").
// ════════════════════════════════════════════════════════════════════════════
import { defineCreator } from '../lib/schema';

export default defineCreator({
  // ── AJUSTES GERAIS ─────────────────────────────────────────────────────────

  // true mostra uma faixa no topo avisando que o portfólio é de demonstração,
  // com pessoa, marcas e números fictícios. Mude para false quando todo o
  // conteúdo de exemplo tiver sido trocado pelo seu.
  modoExemplo: false,

  // Endereço do site. Pode deixar vazio: na Cloudflare o site descobre sozinho
  // (fica algo como https://nome-do-projeto.pages.dev). Só preencha se tiver
  // domínio próprio, ex.: 'https://www.seunome.com.br'.
  endereco: '',

  // Onde ficam os vídeos e as capas:
  //   'local' → na pasta public/videos, junto com o site. Não precisa de cartão nem de
  //             bucket. Limite: cada vídeo com até 24 MB (o "npm run comprimir" já cuida disso).
  //   'r2'    → num bucket do Cloudflare R2. Sem limite de tamanho por vídeo e o site fica
  //             mais leve no GitHub. Precisa ativar o R2 (pede cartão) e preencher urlDosVideos.
  modoDosVideos: 'local',

  // Só no modo 'r2': endereço público do seu bucket no Cloudflare R2.
  // Aparece no painel da Cloudflare em R2 > seu bucket > Settings > Public Development URL.
  // Ex.: 'https://pub-1234567890abcdef.r2.dev'
  urlDosVideos: 'https://pub-SEU-BUCKET.r2.dev',

  // Visual do site. Para comparar, a faixa de demonstração no topo do site tem links para os 4.
  // Opções:
  //   'revista' → creme e preto, ar de revista impressa
  //   'noite'   → quase preto com rosa-blush, ar de revista de moda
  //   'rosa'    → tons de rosa com ameixa
  //   'terra'   → linho, marrom e verde-oliva, ar natural
  tema: 'revista',

  // Opcional: troca as cores do tema. Use o formato '#RRGGBB'.
  // O build confere se o texto continua fácil de ler (contraste) e avisa se não estiver.
  // Ex.: cores: { destaque: '#8A2BE2' },
  cores: { fundo: '#FFFFFF', texto: '#302C29', destaque: '#8B7566' },

  // ── TOPO ───────────────────────────────────────────────────────────────────
  topo: {
    nome: 'Deisyane Borges',
    // Nome do arquivo da sua foto. A foto vai na pasta src/imagens.
    // Uma foto vertical (em pé) fica melhor. JPG, PNG ou WEBP.
    foto: 'foto-deisyane.jpeg',
    // Descreva a foto em poucas palavras. É lido em voz alta para pessoas cegas.
    fotoDescricao: 'Deisyane sorrindo, usando uma blusa branca florida',
    // Seu nicho em uma linha. Aparece em letras pequenas acima do nome.
    nicho: 'Beleza, moda, fitness, casa e muito mais',
    // Frase de impacto logo abaixo do nome: o que a marca ganha contratando você.
    chamada: 'Vídeos UGC naturais que mostram seu produto na vida real, prontos para anúncios e redes sociais.',
    // Bio curta: 2 ou 3 frases sobre o que você cria.
    bio: 'Mineira, casada, mãe da Laura e apaixonada por beleza, autocuidado, moda e lifestyle. Transformo momentos simples em conteúdos leves, autênticos e sofisticados, que conectam marcas e pessoas de forma genuína.',
    botao: {
      // Texto do botão principal.
      texto: 'Quero um orçamento',
      // Para onde o botão leva: 'whatsapp', 'email' ou 'instagram'.
      // Precisa estar preenchido lá embaixo, em CONTATO.
      abre: 'whatsapp',
    },
  },

  // ── VÍDEOS ─────────────────────────────────────────────────────────────────
  // Para adicionar um vídeo: coloque o arquivo original na pasta videos-originais e rode
  // "npm run comprimir". No modo 'local' ele já salva em public/videos; no modo 'r2', envie
  // os arquivos de videos-prontos para o bucket. Depois copie um bloco { ... } abaixo.
  // A ordem aqui é a ordem no site.
  videos: {
    mostrar: true,
    titulo: 'Vídeos',
    // Opcional: uma frase antes dos vídeos.
    texto: 'Vídeos curtos para anúncio e redes sociais, separados por nicho.',
    // Os vídeos ficam na capa até a pessoa tocar para assistir.
    previaAutomatica: false,
    lista: [
      {
        arquivo: 'sandalia-dourada-domidona.mp4',
        capa: 'sandalia-dourada-domidona-capa.jpg',
        marca: 'Domidona',
        formato: 'Detalhes do produto',
        nicho: 'Moda',
        duracao: '0:32',
      },
      {
        arquivo: 'unboxing-lark-a1-hollyland.mp4',
        capa: 'unboxing-lark-a1-hollyland-capa.jpg',
        marca: 'Hollyland Lark A1',
        formato: 'Unboxing',
        nicho: 'Tech',
        duracao: '0:28',
      },
      {
        arquivo: 'garrafa-triton.mp4',
        capa: 'garrafa-triton-capa.jpg',
        marca: 'Triton',
        formato: 'Review',
        nicho: 'Fitness',
        duracao: '0:32',
      },
      {
        arquivo: 'epoca-black-friday.mp4',
        capa: 'epoca-black-friday-capa.jpg',
        marca: 'Época Cosméticos',
        formato: 'Black Friday',
        nicho: 'Beleza',
        duracao: '0:26',
      },
      {
        arquivo: 'camiseta-rosa.mp4',
        capa: 'camiseta-rosa-capa.jpg',
        marca: 'Amocianitas',
        formato: 'Review',
        nicho: 'Moda',
        duracao: '0:28',
      },
      {
        arquivo: 'cafe-cafeteira.mp4',
        capa: 'cafe-cafeteira-capa.jpg',
        marca: 'Cafeteira Electrolux',
        formato: 'Demonstração',
        nicho: 'Casa',
        duracao: '0:18',
      },
      {
        arquivo: 'rotina-autocuidado.mp4',
        capa: 'rotina-autocuidado-capa.jpg',
        marca: 'Cuidados capilares',
        formato: 'Rotina de haircare',
        nicho: 'Haircare',
        duracao: '0:23',
      },
      {
        arquivo: 'look-lifestyle-moda.mp4',
        capa: 'look-lifestyle-moda-capa.jpg',
        marca: 'Sandália',
        formato: 'Lifestyle',
        nicho: 'Moda',
        duracao: '0:38',
      },
    ],
  },

  fotografias: {
    mostrar: true,
    titulo: 'Fotografias',
    texto: 'Imagens pensadas para apresentar produtos com leveza e autenticidade.',
    lista: [
      { arquivo: 'sandalia-dourada-domidona.jpg', descricao: 'Pernas cruzadas com sandália dourada de salto bloco e vestido off-white.' },
      { arquivo: 'deisyane-triton.jpg', descricao: 'Deisyane apresenta uma garrafa Triton personalizada em ambiente externo.' },
      { arquivo: 'cuidados-cabelos-carrossel.webp', descricao: 'Deisyane apresenta um tratamento capilar.' },
      { arquivo: 'protetor-solar-carrossel.webp', descricao: 'Deisyane mostra um protetor solar facial.' },
      { arquivo: 'retrato-acessorios-carrossel.webp', descricao: 'Retrato de Deisyane com blusa branca e acessórios.' },
      { arquivo: 'retrato-beleza-carrossel.webp', descricao: 'Retrato de beleza de Deisyane.' },
      { arquivo: 'moda-lifestyle-carrossel.webp', descricao: 'Deisyane em um look escuro de lifestyle.' },
      { arquivo: 'look-acessorios-carrossel.webp', descricao: 'Deisyane em um look com acessórios.' },
      { arquivo: 'oculos-estilo-carrossel.webp', descricao: 'Retrato de Deisyane usando óculos.' },
      { arquivo: 'detalhe-moda-carrossel.webp', descricao: 'Detalhe de sandálias em um look de moda.' },
    ],
  },

  // ── CAMPANHA SAZONAL ───────────────────────────────────────────────────────
  // Bloco de destaque logo abaixo do topo, com os vídeos marcados com
  // `campanha: 'Black Friday'` (ou o nome que estiver em `nome`).
  // Troque nome, chamada, texto e botão quando quiser; mostrar: true/false liga ou pausa
  // a faixa do topo e o cartão especial. Pode pedir essa troca por mensagem, sem editar código.
  // Enquanto estiver ligada, aparece uma faixa no alto do site; no tema 'revista', o topo
  // inteiro também fica na cor da campanha (preto, ou a cor escolhida em `cor`).
  campanha: {
    mostrar: false,
    nome: 'Black Friday',
    chamada: 'Pacotes especiais para Black Friday',
    texto: 'Peça os detalhes dos pacotes desta edição diretamente pelo WhatsApp.',
    // Texto do botão (abre o WhatsApp já falando da campanha).
    botao: 'Quero receber os pacotes',
    // Opcional: mensagem que já vem escrita no WhatsApp quando a marca toca no botão.
    // Se não preencher: "Oi! Vi seu portfólio e quero falar sobre Black Friday."
    // mensagemWhatsapp: '',
    // Opcional: cor de fundo do bloco, no formato '#RRGGBB'. Se não preencher, fica preto
    // (combina com Black Friday). Ex.: Natal → cor: '#1F4D36', Dia das Mães → cor: '#7A2E4D'.
    cor: '#4B352B',
    // Período opcional: a edição especial só aparece dentro dessas datas.
    inicio: '',
    fim: '',
    // Até três pacotes. Nome, detalhe e preço ficam em branco até você definir cada oferta.
    pacotes: [],
  },

  // ── DIFERENCIAIS ───────────────────────────────────────────────────────────
  // De 3 a 5 itens curtos.
  diferenciais: {
    mostrar: false,
    titulo: 'Por que trabalhar comigo',
    lista: [
      { titulo: 'Roteiro antes de gravar', texto: 'Mando o roteiro com gancho, demonstração e chamada para a marca aprovar.' },
      { titulo: 'Luz e som caprichados', texto: 'Gravo com luz natural e microfone de lapela. Nada de áudio abafado.' },
      { titulo: 'Duas rodadas de ajuste', texto: 'Ajusto corte, legenda e texto até ficar com a cara da marca.' },
      { titulo: 'Entrega no prazo', texto: 'Combinou, cumpriu. Aviso na hora se algo atrasar do lado de cá.' },
    ],
  },

  // ── MARCAS COM QUEM JÁ TRABALHEI ───────────────────────────────────────────
  // Opcional. Só coloque marcas com quem você realmente trabalhou.
  // Logo é opcional: coloque o arquivo (PNG com fundo transparente fica melhor) em
  // src/imagens e escreva o nome, ex.: logo: 'logo-lumi.png'. Com logo, as marcas aparecem
  // em cartões brancos; sem logo, aparece o nome.
  marcas: {
    mostrar: true,
    titulo: 'Marcas trabalhadas',
    lista: [
      { nome: 'Lumy Creator', logo: 'logo-lumy-creator.png' },
      { nome: 'amoianitas', logo: 'logo-amoianitas.png' },
      { nome: 'Domidona', logo: 'logo-domidona.png' },
      { nome: 'Triton', logo: 'logo-triton.jpg' },
      { nome: 'Época', logo: 'logo-epoca.png' },
    ],
  },

  // ── RESULTADOS ─────────────────────────────────────────────────────────────
  // Opcional. Use só números e depoimentos reais, que você consegue provar.
  // Cada lista pode ficar vazia [] e aquela parte some.
  resultados: {
    mostrar: true,
    titulo: 'Depoimentos',
    numeros: [],
    // Prints de feedback: o arquivo vai em src/imagens.
    prints: [
      { imagem: 'feedback-briefing.jpeg', legenda: 'Print de feedback real recebido por mensagem.' },
      { imagem: 'feedback-criatividade.jpeg', legenda: 'Print de feedback real recebido por mensagem.' },
      { imagem: 'feedback-adoramos.jpeg', legenda: 'Print de feedback real recebido por mensagem.' },
      { imagem: 'feedback-aprovado.jpeg', legenda: 'Print de feedback real recebido por mensagem.' },
    ],
    depoimentos: [],
  },

  // ── COMO EU TRABALHO ───────────────────────────────────────────────────────
  comoTrabalho: {
    mostrar: true,
    titulo: 'Como eu trabalho',
    prazo: 'Os vídeos são entregues em até 7 dias úteis.',
    incluso: [
      'Estudo da marca antes de criar o conteúdo',
      'Roteiro enviado para sua aprovação antes de gravar',
      'Gravação feita com iPhone',
      'Edição com legenda ou sem, se a marca preferir',
      'Uma rodada de ajuste incluída',
    ],
    direitosDeUso: 'Todos os pacotes incluem uso em anúncios por 3 meses e uso orgânico permanente.',
    observacao: '',
  },

  // ── PERGUNTAS FREQUENTES ───────────────────────────────────────────────────
  perguntasFrequentes: {
    mostrar: true,
    titulo: 'Perguntas frequentes',
    lista: [
      { pergunta: 'Em quanto tempo recebo os vídeos?', resposta: 'Os vídeos são entregues em até 7 dias úteis.' },
      { pergunta: 'Posso usar os vídeos em anúncios?', resposta: 'Sim. Todos os pacotes incluem uso em anúncios por 3 meses e uso orgânico permanente.' },
      { pergunta: 'Como funciona o pagamento?', resposta: 'O pagamento é feito em 50% via Pix para reservar a data e os 50% restantes na entrega. Também aceito cartão.' },
      { pergunta: 'Você emite nota fiscal?', resposta: 'Sim, emito nota fiscal.' },
    ],
  },

  // ── VALORES ────────────────────────────────────────────────────────────────
  // Pacotes com preço: a marca decide mais rápido quando já sabe quanto custa.
  // Cada pacote tem um botão que abre o WhatsApp já falando daquele pacote.
  valores: {
    mostrar: false,
    titulo: 'Pacotes e valores',
    // Opcional: uma frase antes dos pacotes.
    texto: 'Pacotes pensados para diferentes objetivos de conteúdo.',
    pacotes: [
      // nome: o que a marca recebe. detalhe: a identificação editorial do pacote.
      // preco: se ficar vazio, aparece "Sob consulta".
      // etiqueta (opcional): destaca visualmente um pacote.
      { nome: '1 vídeo + 2 fotos', detalhe: 'Pacote 1', preco: 'R$ 250,00' },
      {
        nome: '2 vídeos + 3 fotos',
        detalhe: 'Pacote 2',
        preco: 'R$ 450,00',
      },
      {
        nome: '3 vídeos + 6 fotos',
        detalhe: 'Pacote 3',
        preco: 'R$ 650,00',
        etiqueta: 'Mais pedido',
      },
      {
        nome: '4 vídeos + 8 fotos',
        detalhe: 'Pacote 4',
        preco: 'R$ 850,00',
      },
    ],
    // Extras opcionais, em uma apresentação mais discreta que os pacotes.
    avulsos: [
      { nome: 'Vídeo extra', preco: 'R$ 200', descricao: 'Roteiro, gravação e edição de um novo vídeo.' },
      { nome: 'Foto extra', preco: 'R$ 35', descricao: 'Foto de produto ou lifestyle com tratamento básico.' },
      { nome: 'Story extra', preco: 'R$ 40', descricao: 'Conteúdo curto para publicação no seu perfil.' },
      { nome: 'Collab no meu perfil', preco: 'R$ 100', descricao: 'Publicação em colaboração no Instagram, conforme combinado.' },
    ],
    // Texto do botão de cada pacote.
    botao: 'Quero esse pacote',
    // Opcional: uma observação no fim da seção.
  },

  formatos: {
    mostrar: true,
    titulo: 'Conteúdo para cada objetivo',
    lista: [
      { nome: 'Vídeo UGC', detalhe: 'Vídeos autênticos que apresentam a marca na rotina real.' },
      { nome: 'Conteúdo para anúncios', detalhe: 'Roteiros e cortes pensados para prender a atenção e gerar ação.' },
      { nome: 'Fotos de produto', detalhe: 'Imagens lifestyle que mostram o produto em uso, com leveza e naturalidade.' },
      { nome: 'Stories', detalhe: 'Conteúdos rápidos para apresentar novidades e criar conversa.' },
      { nome: 'Collab no meu perfil', detalhe: 'Publicação em parceria no meu Instagram ou TikTok, conectando a marca à minha comunidade.' },
      { nome: 'Carrossel', detalhe: 'Uma sequência visual para explicar benefícios e contar a história do produto.' },
    ],
  },

  // ── CONTATO ────────────────────────────────────────────────────────────────
  // Deixe vazio ('') o que você não quiser mostrar.
  contato: {
    titulo: 'Vamos criar juntos?',
    texto: 'Me conte o produto, o prazo e onde o vídeo vai rodar. Respondo em até um dia útil.',
    whatsapp: {
      // 55 + DDD + número. Pode escrever com espaço ou traço.
      numero: '55 31 99986-9619',
      // Mensagem que já aparece escrita quando a marca abre o WhatsApp.
      mensagem: 'Oi, Deisyane! Vi seu portfólio e quero conversar sobre um conteúdo UGC.',
    },
    email: 'contato.deisyaneborges@gmail.com',
    // Só o perfil, com ou sem @.
    instagram: 'deisyaneborgess',
    tiktok: 'deisyaneborgess',
    // Opcional: link do mídia kit (https://...) ou um PDF colocado na pasta public (ex.: 'midia-kit.pdf').
    midiaKit: '',
  },

  // ── PÁGINA DE LINKS PARA A BIO DO INSTAGRAM ────────────────────────────────
  // Para incluir outro cupom, acrescente uma marca, o código e o endereço da loja.
  linksBio: {
    // Foto da página de links (fica em src/imagens). Diferente da foto do portfólio.
    foto: 'foto-links.jpg',
    fotoDescricao: 'Deisyane sorrindo de leve, com cabelo longo e blusa tomara que caia clara',
    frase: 'Conteúdo real, recomendações e novidades.',
    cupons: [
      { marca: 'Triton', codigo: 'DEISYANE5', url: 'https://usetriton.com.br/', detalhe: 'Use meu cupom na loja Triton.' },    ],
  },

  // ── GOOGLE E COMPARTILHAMENTO ──────────────────────────────────────────────
  // Opcional. Se ficar vazio, o título vira "Nome · Creator UGC de nicho" e a descrição usa a bio.
  seo: {
    titulo: '',
    descricao: '',
  },
});
