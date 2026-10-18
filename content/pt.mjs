// Conteúdo PT — transcrito do documento "Coalizao_Corais_Escopo_Completo_PT"
// (Drive, 17/10/2026). Títulos em partes: { t: texto, c: "coral"|"yellow" }
// seguem a divisão de cores das imagens de referência de cada bloco.
export default {
  lang: "pt-BR",
  path: "/",
  altPath: "/en/",
  altLabel: "EN",
  altHreflang: "en",
  title: "Coalizão Corais do Brasil — Juntos pelos recifes de coral do Brasil",
  description:
    "Iniciativa da sociedade civil brasileira que une ciência, comunidades e compromissos para conservar, restaurar e valorizar os recifes de coral do país.",
  ogLocale: "pt_BR",
  ogImage: "/assets/img/og-pt.jpg",
  logo: { src: "/assets/img/logo-pt.webp", alt: "Coalizão Corais do Brasil" },
  skip: "Pular para o conteúdo",
  menuOpen: "Abrir menu",
  menuClose: "Fechar menu",
  langSwitchLabel: "Idioma",

  nav: [
    { href: "#quem-somos", label: "Quem somos" },
    { href: "#recifes", label: "Recifes do Brasil" },
    { href: "#acoes", label: "Nossas ações" },
    { href: "#grupos", label: "Grupos de Trabalho" },
    { href: "#rede", label: "Rede de Impacto" },
    { href: "#materiais", label: "Materiais" },
    { href: "#contato", label: "Contato" },
  ],
  navCta: "Participe",

  ids: {
    about: "quem-somos",
    how: "como-atuamos",
    reefs: "recifes",
    numbers: "recifes-em-numeros",
    video: "video",
    mvp: "missao-visao-proposito",
    values: "valores",
    actions: "acoes",
    gts: "grupos",
    governance: "governanca",
    results: "resultados",
    network: "rede",
    materials: "materiais",
    contact: "contato",
    form: "formulario",
  },

  hero: {
    eyebrow: "Iniciativa da sociedade civil brasileira",
    h1: [{ t: "Juntos pelos" }, { t: "recifes de coral", c: "coral" }, { t: "do Brasil" }],
    sub: "Unimos ciência, comunidades e compromissos para conservar, restaurar e valorizar os recifes de coral do país com impactos duradouros.",
    cta1: "Participe da rede",
    cta2: "Conheça a Coalizão",
    aligned: "Alinhada à agenda global do <em>Coral Reef Breakthrough</em>",
    bgAlt: "Recife de coral brasileiro com corais e peixes sob a luz natural",
  },

  about: {
    eyebrow: "Quem somos",
    h2: [{ t: "Uma rede viva pelos" }, { t: "recifes de coral", c: "coral" }, { t: "brasileiros" }],
    paragraphs: [
      "A Coalizão Corais do Brasil é uma articulação multissetorial dedicada à proteção, conservação e restauração dos recifes de coral do país. Nascemos do encontro entre ciência, comunidades, setor privado, academia e sociedade civil, com o propósito de unir forças em torno da vida marinha e da sustentabilidade dos ecossistemas costeiros brasileiros.",
      "A Coalizão começou a ser estruturada em 2022, a partir de um mapeamento das iniciativas existentes e da escuta de representantes do setor privado, do terceiro setor, da academia, do governo e de comunidades locais.",
      "Mais do que uma rede de parceiros, somos um movimento colaborativo, que atua de forma integrada e transparente para fortalecer a agenda nacional e global de conservação dos corais.",
      "Nosso compromisso é atuar como uma plataforma integradora, conectando iniciativas já existentes, evitando a duplicação de esforços e fortalecendo ações de conservação. Buscamos ampliar impactos, influenciar políticas públicas, apoiar soluções e fortalecer o protagonismo do Brasil na pauta oceânica internacional.",
    ],
    videoCta: "Assista ao vídeo",
    photoAlt: "Pessoas da rede trabalhando na restauração de corais em águas rasas e cristalinas",
  },

  how: {
    eyebrow: "Como atuamos",
    cards: [
      { icon: "icone-articulacao", title: "Articulação e Governança", text: "Conectamos e potencializamos o trabalho da sociedade civil, da academia e do setor privado em uma atuação coordenada." },
      { icon: "icone-ciencia", title: "Ciência e Monitoramento", text: "Fortalecemos a base científica e o monitoramento contínuo que subsidiam a tomada de decisão." },
      { icon: "icone-politicas", title: "Incidência em Políticas Públicas", text: "Atuamos na formulação e implementação de políticas públicas para a conservação, a restauração e a resiliência dos recifes." },
      { icon: "icone-comunicacao", title: "Comunicação e Engajamento", text: "Damos visibilidade aos corais, sensibilizamos a sociedade e mobilizamos novos parceiros e investimentos." },
      { icon: "icone-comunidades", title: "Empoderamento das Comunidades", text: "Fortalecemos o protagonismo das comunidades costeiras tradicionais e reconhecemos seus saberes e práticas.", wide: true },
    ],
  },

  reefs: {
    eyebrow: "Recifes do Brasil",
    h2: [{ t: "Cuidar dos corais" }, { t: "é cuidar de nós.", c: "coral" }],
    intro: "Os recifes de coral são mais do que ecossistemas: são redes vivas que nos ensinam sobre interdependência e resiliência. São importantes para a biodiversidade marinha, a proteção costeira, a segurança alimentar de comunidades tradicionais e a economia do turismo.",
    cards: [
      { icon: "icone-biodiversidade", title: "Biodiversidade", text: "Ocupam menos de 0,1% do fundo do oceano, mas 1 em cada 4 espécies marinhas vive ou passa parte da vida neles." },
      { icon: "icone-protecao-costeira", title: "Proteção costeira", text: "Reduzem a força das ondas e ajudam a proteger praias e cidades." },
      { icon: "icone-seguranca-alimentar", title: "Segurança alimentar", text: "Sustentam a pesca e o alimento de comunidades tradicionais." },
      { icon: "icone-economia", title: "Economia e cultura", text: "Movem o turismo e fazem parte da identidade de muitos territórios." },
    ],
    imageAlt: "Ilustração de recife de coral brasileiro com peixes, corais e sol",
  },

  numbers: {
    eyebrow: "Recifes em números",
    h3: [{ t: "Recifes bem brasileiros," }, { t: "com valor para todo o país", c: "coral" }],
    stats: [
      { icon: "icone-mapa-brasil", value: "3.000 km", color: "coral", label: "de costa com ambientes recifais, do Maranhão ao sul da Bahia" },
      { icon: "icone-corais", value: "+60", color: "sky", label: "espécies de corais no Brasil, algumas encontradas somente aqui" },
      { icon: "icone-escudo", value: "R$ 160 bi", color: "yellow", label: "por ano em proteção costeira estimada no Nordeste*" },
      { icon: "icone-palmeira", value: "R$ 7 bi", color: "sky", label: "por ano em potencial de turismo ligado aos recifes no Nordeste" },
    ],
    source: "<strong>Fonte:</strong> Oceano sem mistérios: Desvendando os recifes de corais, Fundação Grupo Boticário em parceria com a Bloom Ocean. Valores econômicos são estimativas anuais; resultados extrapolados estão sujeitos a revisão. *Considera cerca de 170 km² de recifes de coral, areníticos ou rochosos.",
    imageAlt: "Jangada navegando sobre um recife de coral raso, com coqueiros ao fundo",
  },

  didYouKnow: {
    title: "Você sabia?",
    text: "Os corais vivem em parceria com algas microscópicas, as zooxantelas. Elas fornecem nutrientes e oxigênio pela fotossíntese, e os corais oferecem abrigo em troca. É essa parceria que dá cor e energia ao recife.",
  },

  video: {
    eyebrow: "Vídeo institucional",
    h2: [{ t: "Conheça a Coalizão" }, { t: "em poucos minutos", c: "coral" }],
    status: "Vídeo institucional em produção · legendas e Libras",
    cta: "Participe da rede",
    playLabel: "Vídeo institucional em produção",
  },

  mvp: {
    eyebrow: "Missão, visão e propósito",
    h2: [{ t: "O que" }, { t: "nos move", c: "coral" }],
    cards: [
      { title: "Missão", color: "coral", text: "Promover a conservação e restauração dos recifes de coral no Brasil, articulando atores-chave e integrando iniciativas para fortalecer a agenda nacional e global." },
      { title: "Visão", color: "teal", text: "Os recifes de coral do Brasil são reconhecidos como ecossistemas essenciais para a biodiversidade e a economia costeira, recebendo investimentos e apoio contínuos que garantem sua proteção e resiliência a longo prazo." },
      { title: "Propósito", color: "yellow", wide: true, text: "Unir diversos setores (sociedade civil, academia, setor privado e comunidades locais) em uma governança transparente e robusta para catalisar ações práticas, influenciar políticas públicas, impulsionar soluções inovadoras e assegurar a sustentabilidade financeira da conservação, restauração e valorização dos recifes de corais visando o protagonismo do Brasil na agenda global de conservação de corais." },
    ],
  },

  values: {
    eyebrow: "Nossos valores",
    cards: [
      { title: "Diversidade", text: "Somos um movimento diverso e equitativo, composto por múltiplos atores." },
      { title: "Cooperação", text: "Nossa base é a cooperação de diferentes organizações parceiras em prol do desenvolvimento de soluções sustentáveis e inovadoras para os recifes de coral do Brasil como um objetivo comum." },
      { title: "Diálogo", text: "Pautamos nossas ações na empatia, no diálogo e na assertividade para a resolução de potenciais conflitos e fluidez dos trabalhos." },
      { title: "Ação e Protagonismo", text: "Agimos para gerar soluções consistentes, reduzindo lacunas e fortalecendo a pauta de conservação dos recifes de coral em âmbito nacional." },
    ],
  },

  actions: {
    eyebrow: "Nossas ações",
    h2: [{ t: "Do compromisso global" }, { t: "à ação no território", c: "coral" }],
    intro: "Seguimos as metas globais do Coral Reef Breakthrough, adaptadas à realidade dos recifes brasileiros. Cada eixo temático tem um Grupo de Trabalho, onde as organizações da Rede de Impacto constroem iniciativas colaborativas e geram resultados concretos.",
    cards: [
      { label: "Eixo 1 · GT 1", title: "Mitigação de Ameaças", color: "coral", icon: "icone-eixo-ameacas", text: "Interrompemos os fatores locais de perda dos recifes, como a poluição de origem humana, o desenvolvimento costeiro desordenado, as espécies invasoras e a sobrepesca." },
      { label: "Eixo 2 · GT 2", title: "Expansão da Proteção", color: "teal", icon: "icone-eixo-protecao", text: "Ampliamos e fortalecemos os sistemas de Unidades de Conservação existentes nas áreas recifais, reconhecendo e respeitando os direitos dos Povos Indígenas e Comunidades Tradicionais, em alinhamento com o Marco Global de Biodiversidade de Kunming-Montreal." },
      { label: "Eixo 3 · GT 3", title: "Aceleração da Restauração", color: "yellow", icon: "icone-eixo-restauracao", text: "Apoiamos estratégias de restauração de corais com base científica, salvaguardas ambientais e valorização do conhecimento tradicional." },
      { label: "Eixo 4 · GT 4", title: "Mobilização de Investimentos", color: "sky", icon: "icone-eixo-investimentos", text: "Articulamos a mobilização de recursos públicos e privados para a conservação e restauração dos corais, conectando financiadores e quem executa na ponta." },
    ],
    transversal: { label: "Eixo transversal · GT 5", title: "Monitoramento", icon: "icone-eixo-monitoramento", text: "Estabelecemos e monitoramos indicadores de efetividade das ações de conservação, articulando um espaço de confiança para o compartilhamento de dados e fortalecendo projetos e redes já existentes e as que vierem a ser criadas." },
    imageAlt: "Ilustração do globo terrestre com ondas que chegam ao litoral do Brasil",
  },

  gts: {
    eyebrow: "Grupos de Trabalho",
    h2: [{ t: "Grupos de Trabalho:" }, { t: "onde a rede acontece", c: "coral" }],
    paragraphs: [
      "A Rede de Impacto se organiza em cinco Grupos de Trabalho, um para cada eixo temático. Nos GTs, as organizações aderidas desenvolvem iniciativas, compartilham experiências e articulam ações conjuntas.",
      "Cada GT reúne ao menos três organizações aderidas à Coalizão: uma coordenadora e, no mínimo, duas integrantes, com coordenação titular e suplente.",
    ],
    cards: [
      { label: "GT 1", title: "Mitigação de Ameaças", color: "coral", img: "gt1-ilustracao", text: "Para organizações que atuam na redução da poluição, do desenvolvimento costeiro desordenado, das espécies invasoras e da sobrepesca em áreas recifais." },
      { label: "GT 2", title: "Expansão da Proteção", color: "teal", img: "gt2-ilustracao", text: "Para organizações que atuam na ampliação e no fortalecimento das Unidades de Conservação em áreas recifais." },
      { label: "GT 3", title: "Aceleração da Restauração", color: "yellow", img: "gt3-ilustracao", text: "Para quem pesquisa, executa ou apoia iniciativas de restauração de corais." },
      { label: "GT 4", title: "Mobilização de Investimentos", color: "sky", img: "gt4-ilustracao", text: "Para financiadores e organizações executoras que conectam recursos públicos e privados à conservação dos corais." },
      { label: "GT 5", title: "Monitoramento", color: "petrol", img: "gt5-ilustracao", text: "Para quem produz, organiza ou compartilha dados e indicadores sobre a efetividade da conservação dos recifes." },
    ],
    imageAlt: "Ilustração de pessoas unindo as mãos na praia",
  },

  governance: {
    eyebrow: "Governança em rede e participação",
    h2: [{ t: "Uma governança em rede" }],
    text: "O Comitê Estratégico-Deliberativo define as prioridades. A Secretaria Executiva coordena e integra os Grupos de Trabalho. A Rede de Impacto transforma estratégia em ação, em cada território.",
    cardTitle: "Como sua organização participa",
    steps: [
      { title: "Manifeste interesse", text: "Envie uma mensagem e indique os Grupos de Trabalho de interesse." },
      { title: "Formalize a adesão", text: "Assine o Termo de Adesão e assuma o compromisso com os princípios e valores da Coalizão." },
      { title: "Atue em um GT", text: "Participe de ao menos um Grupo de Trabalho. Cada GT tem coordenação titular e suplente, e encontros no mínimo a cada dois meses." },
    ],
    note: "Organizações candidatas podem passar por análise de diligência e integridade.",
    cta: "Participe da Rede de Impacto",
    imageAlt: "Ilustração de pessoas sentadas em um costão olhando o mar",
  },

  results: {
    eyebrow: "Resultados esperados",
    h2: [{ t: "Onde a maré" }, { t: "nos leva", c: "coral" }],
    items: [
      { icon: "icone-resultado-recifes", title: "Recifes mais protegidos", text: "Mais áreas recifais sob proteção efetiva e menos pressão das ameaças locais." },
      { icon: "icone-resultado-restauracao", title: "Restauração com ciência e saber tradicional", text: "Iniciativas de restauração conectadas, com salvaguardas e conhecimento das comunidades valorizado." },
      { icon: "icone-resultado-investimento", title: "Investimento contínuo nos corais", text: "Articulação de recursos públicos e privados para apoiar ações de conservação e restauração dos corais." },
    ],
    cardTitle: "Em 2026",
    goals: [
      "Governança implementada, com Comitê Estratégico-Deliberativo ativo e Rede de Impacto formalizada.",
      "Cinco Grupos de Trabalho em funcionamento, com planejamento e metas anuais, além de objetivos de longo prazo.",
      "Primeiro encontro presencial da rede.",
      "Ao menos duas propostas de mobilização de recursos submetidas.",
      "Presença qualificada em agendas nacionais e internacionais, como a Conferência da Década do Oceano e a COP.",
      "Relatório anual de resultados em construção, com indicadores.",
    ],
  },

  network: {
    eyebrow: "Rede de Impacto · Quem faz parte",
    h2: [{ t: "Organizações que integram a Coalizão" }],
    categories: [
      { title: "Idealização", items: [
        { logo: "parceiro-fgb", name: "Fundação Grupo Boticário" },
        { logo: "parceiro-wwf", name: "WWF-Brasil", showName: true },
      ] },
      { title: "Comitê Estratégico-Deliberativo", items: [{ placeholder: "[A confirmar]" }, { placeholder: "[A confirmar]" }] },
      { title: "Secretaria Executiva", items: [{ logo: "parceiro-bloom", name: "Bloom Ocean" }] },
      { title: "Organizações da rede", items: Array.from({ length: 8 }, () => ({ placeholder: "[logo a confirmar]" })) },
    ],
    ctaText: "Sua organização cuida dos recifes de coral?",
    ctaHighlight: "Junte-se à Coalizão.",
    ctaButton: "Faça parte da Rede de Impacto",
    imageAlt: "Ilustração de barco de pesca próximo a uma ilha com coqueiros",
  },

  materials: {
    eyebrow: "Materiais e downloads",
    h2: [{ t: "Transparência que gera confiança" }],
    intro: "Nesta seção estão os documentos que orientam a governança, a participação, a comunicação e as atividades da Coalizão.",
    docs: [
      { icon: "doc-governanca", title: "Política de Governança", text: "Estrutura, papéis, regras de participação e conduta da Coalizão.", meta: "PDF · [tamanho] · Versão [n] · [data]", cta: "Baixar" },
      { icon: "doc-adesao", title: "Termo de Adesão", text: "Documento para formalizar a entrada da sua organização na Rede de Impacto.", meta: "PDF · [tamanho] · Versão [n] · [data]", cta: "Baixar" },
      { icon: "doc-brandbook", title: "BrandBook", text: "Logomarca, cores, tipografia e o estilo Cordel de Corais.", meta: "PDF · [tamanho] · Versão [n] · [data]", cta: "Baixar" },
      { icon: "doc-guia", title: "Guia de Comunicação", text: "Voz, tom e diretrizes para comunicar em nome da Coalizão.", meta: "PDF · [tamanho] · Versão 1.0 · [data]", cta: "Baixar" },
      { icon: "doc-oficina", title: "Relatório da Oficina Nacional 2023", text: "Registro do encontro que ajudou a construir as bases da Coalizão.", meta: "PDF · [tamanho] · [data]", cta: "Baixar" },
      { icon: "doc-publicacao", kicker: "Publicação", title: "Oceano sem mistérios: Desvendando os recifes de corais", text: "O valor da proteção costeira e do turismo ligados aos recifes do Nordeste, em infográficos. Fundação Grupo Boticário em parceria com a Bloom Ocean.", meta: "PDF · [link a confirmar]", cta: "Acessar" },
      { icon: "doc-anual", title: "Relatório anual 2026", text: "Resultados, indicadores e aprendizados do primeiro ano de governança.", meta: "Previsto para o fim de 2026.", cta: "Em breve", soon: true },
    ],
    pendingTitle: "Arquivo em preparação",
    imageAlt: "Ilustração de documentos entre corais",
  },

  contact: {
    eyebrow: "Contato",
    h2: [{ t: "Vamos conversar? Fale com a Secretaria Executiva." }],
    intro: "Sua organização quer fazer parte da Rede de Impacto, apoiar a Coalizão ou saber mais sobre o nosso trabalho? Escreva para a Secretaria Executiva.",
    email: "coalizaocoraisdobrasil@gmail.com",
    instagram: "@coalizaocoraisdobrasil",
    instagramUrl: "https://www.instagram.com/coalizaocoraisdobrasil",
    linkedin: "[link a confirmar]",
    youtube: "[link a confirmar]",
    form: {
      name: "Nome", namePh: "Seu nome completo",
      email: "E-mail", emailPh: "seu@email.com",
      org: "Organização", orgPh: "Nome da organização, se houver",
      sector: "Setor", sectorPh: "Selecione",
      sectors: ["Sociedade civil", "Academia e pesquisa", "Setor privado", "Poder público", "Comunidade ou coletivo local", "Imprensa", "Outro"],
      participation: "Como você quer participar?",
      participations: ["Participar da Rede de Impacto", "Apoiar a Coalizão", "Imprensa", "Outros assuntos"],
      gts: "Grupos de Trabalho de interesse",
      gtOptions: ["Mitigação de Ameaças", "Expansão da Proteção", "Aceleração da Restauração", "Mobilização de Investimentos", "Monitoramento"],
      message: "Mensagem", messagePh: "Conte um pouco sobre você ou sua organização",
      consent: 'Autorizo o uso dos meus dados para contato da Coalizão Corais do Brasil, conforme a <a href="/politica-de-privacidade/">Política de Privacidade</a>.',
      submit: "Enviar mensagem",
      sending: "Enviando…",
      success: "Mensagem enviada! A Secretaria Executiva vai responder pelo e-mail informado.",
      error: "Não foi possível enviar agora. Tente de novo em instantes ou escreva para coalizaocoraisdobrasil@gmail.com.",
      required: "Preencha os campos obrigatórios marcados com *.",
      requiredMark: "obrigatório",
    },
  },

  footer: {
    tagline: "Pela vida que pulsa sob o mar.",
    text: "Iniciativa da sociedade civil brasileira, idealizada pela Fundação Grupo Boticário e pelo WWF-Brasil.",
    hashtags: ["#PelaVidaQuePulsaSobOMar", "#RedePelosCorais"],
    navTitle: "Navegação",
    links: [
      { label: "Política de Privacidade", href: "/politica-de-privacidade/" },
      { label: "BrandBook", href: "#materiais" },
      { label: "Guia de Comunicação", href: "#materiais" },
      { label: "Materiais e downloads", href: "#materiais" },
    ],
    ombudsTitle: "Ouvidoria",
    ombudsText: "Denúncias, sugestões e reclamações sobre a Coalizão podem ser enviadas para <a href=\"mailto:ouvidoria@wwf.org.br\"><strong>ouvidoria@wwf.org.br</strong></a>.",
    site: "coalizaocoraisdobrasil.com.br",
    copyright: "© 2026 Coalizão Corais do Brasil.",
  },
};
