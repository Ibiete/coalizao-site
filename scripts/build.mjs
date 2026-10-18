// Gera as páginas estáticas a partir de content/{pt,en}.mjs:
//   site/index.html, site/en/index.html,
//   site/politica-de-privacidade/index.html, site/en/privacy-policy/index.html
// Rodar com: npm run build
import sharp from "sharp";
import { mkdirSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import pt from "../content/pt.mjs";
import en from "../content/en.mjs";
import privacy from "../content/privacy.mjs";

const SITE = new URL("../site/", import.meta.url).pathname;
const IMG_DIR = join(SITE, "assets/img");
const ORIGIN = "https://coalizaocoraisdobrasil.com.br";
// Formulário → módulo Formulários do NAIIAN ONE (tenant Bloom), que cria o
// contato no CRM e dispara o e-mail (regras configuradas no painel).
const FORM_ENDPOINT = "https://painel.bloomocean.com.br/api/forms/coalizao-site-contato/submit";
const VERSION = Date.now().toString(36);

// Dimensões reais de cada imagem — width/height no <img> evita o "pulo" de layout.
const dims = {};
for (const f of readdirSync(IMG_DIR).filter((f) => f.endsWith(".webp"))) {
  const m = await sharp(join(IMG_DIR, f)).metadata();
  dims[f.replace(/\.webp$/, "")] = [m.width, m.height];
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function img(name, alt = "", { cls = "", eager = false, sizes } = {}) {
  const d = dims[name];
  if (!d) throw new Error(`imagem não encontrada: ${name}`);
  const a = alt ? `alt="${esc(alt)}"` : `alt="" aria-hidden="true"`;
  return `<img src="/assets/img/${name}.webp" width="${d[0]}" height="${d[1]}" ${a}${cls ? ` class="${cls}"` : ""} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"${sizes ? ` sizes="${sizes}"` : ""}>`;
}

const title = (parts, tag = "h2", cls = "") =>
  `<${tag}${cls ? ` class="${cls}"` : ""}>${parts.map((p) => (p.c ? `<span class="t-${p.c}">${esc(p.t)}</span>` : `<span>${esc(p.t)}</span>`)).join(" ")}</${tag}>`;

const eyebrow = (text, { icon = false, light = false, tag = "p", id = "" } = {}) =>
  `<${tag}${id ? ` id="${id}"` : ""} class="eyebrow${light ? " eyebrow--light" : ""}">${icon ? img("coral-eyebrow", "", { cls: "eyebrow__icon" }) : ""}<span>${esc(text)}</span></${tag}>`;

const arrow = `<svg class="btn__arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function header(c, { home = true } = {}) {
  const href = (h) => (home ? h : `${c.path}${h}`);
  const navItems = c.nav.map((n) => `<li><a href="${href(n.href)}">${esc(n.label)}</a></li>`).join("");
  return `
<a class="skip-link" href="#conteudo">${esc(c.skip)}</a>
<header class="site-header" data-header>
  <div class="container site-header__inner">
    <a class="brand" href="${c.path}" aria-label="${esc(c.logo.alt)}">
      <img src="${c.logo.src}" width="${dims[c.lang === "en" ? "logo-en" : "logo-pt"][0]}" height="${dims[c.lang === "en" ? "logo-en" : "logo-pt"][1]}" alt="${esc(c.logo.alt)}" fetchpriority="high">
    </a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="menu" data-menu-toggle data-label-open="${esc(c.menuOpen)}" data-label-close="${esc(c.menuClose)}">
      <span class="sr-only">${esc(c.menuOpen)}</span><span class="menu-toggle__bar"></span><span class="menu-toggle__bar"></span><span class="menu-toggle__bar"></span>
    </button>
    <nav class="site-nav" id="menu" data-menu aria-label="Menu">
      <ul class="site-nav__list">${navItems}</ul>
      <div class="site-nav__actions">
        <a class="btn btn--coral btn--sm" href="${href("#" + c.ids.form)}" data-participation="0">${esc(c.navCta)}</a>
        <span class="rays" aria-hidden="true"><i></i><i></i><i></i></span>
        <div class="lang-switch" role="group" aria-label="${esc(c.langSwitchLabel)}">
          <a href="/" lang="pt-BR" ${c.lang === "pt-BR" ? 'aria-current="true"' : ""}>PT</a><span aria-hidden="true">|</span><a href="/en/" lang="en" ${c.lang === "en" ? 'aria-current="true"' : ""}>EN</a>
        </div>
      </div>
    </nav>
  </div>
  ${img("divisor-ondulado", "", { cls: "site-header__wave", eager: true })}
</header>`;
}

function footer(c, { home = true } = {}) {
  const f = c.footer;
  const href = (h) => (h.startsWith("#") && !home ? `${c.path}${h}` : h);
  return `
<footer class="site-footer">
  <div class="container site-footer__grid">
    <div class="site-footer__brand">
      <img src="${c.logo.src}" width="${dims[c.lang === "en" ? "logo-en" : "logo-pt"][0]}" height="${dims[c.lang === "en" ? "logo-en" : "logo-pt"][1]}" alt="${esc(c.logo.alt)}" loading="lazy" class="site-footer__logo">
      <p class="site-footer__tagline">${esc(f.tagline)}</p>
      <p>${esc(f.text)}</p>
      <p class="site-footer__tags">${f.hashtags.map((h) => `<span>${esc(h)}</span>`).join("")}</p>
    </div>
    <div class="site-footer__nav">
      <p class="site-footer__title">${esc(f.navTitle)}</p>
      <ul>${f.links.map((l) => `<li><a href="${href(l.href)}">${esc(l.label)}</a></li>`).join("")}</ul>
    </div>
    <div class="site-footer__ombuds">
      <p class="site-footer__title">${esc(f.ombudsTitle)}</p>
      <p>${f.ombudsText}</p>
      <ul class="site-footer__contacts">
        <li><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M2.5 12h19M12 2.5c3 3.2 3 15.8 0 19M12 2.5c-3 3.2-3 15.8 0 19" fill="none" stroke="currentColor" stroke-width="1.6"/></svg><a href="${c.path}">${esc(f.site)}</a></li>
        <li><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg><a href="mailto:${c.contact.email}">${esc(c.contact.email)}</a></li>
        <li><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/></svg><a href="${c.contact.instagramUrl}" target="_blank" rel="noopener">${esc(c.contact.instagram)}</a></li>
      </ul>
      <p class="site-footer__copy">${esc(f.copyright)}</p>
    </div>
  </div>
  ${img("recife-rodape", "", { cls: "site-footer__reef" })}
  ${img("peixe-bolhas", "", { cls: "site-footer__fish" })}
</footer>`;
}

function head(c, { title: pageTitle, description, path, altPath, noindex = false }) {
  return `<!doctype html>
<html lang="${c.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(pageTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${ORIGIN}${path}">
<link rel="alternate" hreflang="${c.lang}" href="${ORIGIN}${path}">
<link rel="alternate" hreflang="${c.altHreflang}" href="${ORIGIN}${altPath}">
<link rel="alternate" hreflang="x-default" href="${ORIGIN}${c.lang === "en" ? altPath : path}">
${noindex ? '<meta name="robots" content="noindex">' : ""}
<meta name="theme-color" content="#213569">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(pageTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${ORIGIN}${path}">
<meta property="og:image" content="${ORIGIN}${c.ogImage}">
<meta property="og:locale" content="${c.ogLocale}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon-32.png?v=2">
<link rel="icon" type="image/png" sizes="192x192" href="/assets/img/favicon-192.png?v=2">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png?v=2">
<link rel="preload" href="/assets/fonts/signika-normal-700-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/nunitosans-normal-400-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/fonts.css?v=${VERSION}">
<link rel="stylesheet" href="/assets/css/style.css?v=${VERSION}">
</head>`;
}

function page(c) {
  const id = c.ids;
  const h = c.hero, a = c.about, hw = c.how, r = c.reefs, nb = c.numbers, dk = c.didYouKnow, v = c.video;
  const mv = c.mvp, vl = c.values, ac = c.actions, gt = c.gts, gv = c.governance, rs = c.results, nw = c.network, mt = c.materials, ct = c.contact, fm = ct.form;
  const req = `<abbr class="req" title="${esc(fm.requiredMark)}">*</abbr>`;

  return `${head(c, { title: c.title, description: c.description, path: c.path, altPath: c.altPath })}
<body>
${header(c)}
<main id="conteudo">

<!-- BLOCO 02 — Hero -->
<section class="hero" aria-labelledby="hero-title">
  <img src="/assets/img/hero-fundo.webp" width="${dims["hero-fundo"][0]}" height="${dims["hero-fundo"][1]}" alt="${esc(h.bgAlt)}" class="hero__bg" fetchpriority="high">
  ${img("hero-moldura", "", { cls: "hero__frame", eager: true })}
  ${img("coral-laranja", "", { cls: "hero__coral-mobile" })}
  <div class="container hero__content">
    <p class="hero__eyebrow">${img("coral-eyebrow", "", { cls: "hero__eyebrow-icon", eager: true })}<span>${esc(h.eyebrow)}</span></p>
    ${title(h.h1, "h1", "hero__title").replace("<h1", '<h1 id="hero-title"')}
    <p class="hero__sub">${esc(h.sub)}</p>
    <div class="hero__ctas">
      <a class="btn btn--coral" href="#${id.form}" data-participation="0">${esc(h.cta1)} ${arrow}</a>
      <a class="btn btn--ghost" href="#${id.about}">${esc(h.cta2)} ${arrow}</a>
    </div>
    <p class="hero__aligned">${img("tres-ondas", "", { cls: "hero__waves-icon", eager: true })}<span>${h.aligned}</span></p>
  </div>
</section>

<!-- BLOCO 03 — Quem somos -->
<section class="section about bg-cream" id="${id.about}" aria-labelledby="about-title">
  <div class="container about__grid">
    <div class="about__text">
      ${eyebrow(a.eyebrow, { icon: true })}
      ${title(a.h2, "h2", "section-title").replace("<h2", '<h2 id="about-title"')}
      ${a.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("\n      ")}
      <a class="text-cta" href="#${id.video}">${esc(a.videoCta)}<span class="text-cta__play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 7.5v9l7.5-4.5z" fill="currentColor"/></svg></span></a>
    </div>
    <div class="about__media">
      ${img("coral-laranja", "", { cls: "about__coral" })}
      ${img("quem-somos-foto", a.photoAlt, { cls: "about__photo" })}
    </div>
  </div>
  ${img("rodape-oceanico", "", { cls: "band band--about" })}
</section>

<!-- BLOCO 04 — Como atuamos -->
<section class="section how bg-cream" id="${id.how}" aria-labelledby="how-title">
  <div class="container">
    ${eyebrow(hw.eyebrow, { icon: true, tag: "h2", id: "how-title" })}
    <div class="how__grid">
      ${hw.cards.map((k) => `<article class="how-card${k.wide ? " how-card--wide" : ""}">
        ${img(k.icon, "", { cls: "how-card__icon" })}
        <div><h3>${esc(k.title)}</h3><p>${esc(k.text)}</p></div>
      </article>`).join("\n      ")}
    </div>
  </div>
  ${img("rodape-como-atuamos", "", { cls: "band band--how" })}
</section>

<!-- BLOCO 05 — Recifes do Brasil -->
<section class="section reefs bg-sky" id="${id.reefs}" aria-labelledby="reefs-title">
  <div class="container reefs__grid">
    <div class="reefs__text">
      ${eyebrow(r.eyebrow, { icon: true })}
      ${title(r.h2, "h2", "section-title").replace("<h2", '<h2 id="reefs-title"')}
      <p class="lead">${esc(r.intro)}</p>
      <div class="reefs__cards">
        ${r.cards.map((k) => `<article class="reef-card">${img(k.icon, "", { cls: "reef-card__icon" })}<div><h3>${esc(k.title)}</h3><p>${esc(k.text)}</p></div></article>`).join("\n        ")}
      </div>
    </div>
    <div class="reefs__media">
      ${img("recifes-colagem", r.imageAlt, { cls: "reefs__collage" })}
    </div>
  </div>
  ${img("faixa-litoranea", "", { cls: "band band--coast" })}
</section>

<!-- BLOCOS 06 e 07 — Recifes em números + Você sabia? -->
<section class="section numbers bg-cream" id="${id.numbers}" aria-labelledby="numbers-title">
  <div class="container">
    <div class="numbers__panel">
      <div class="numbers__content">
        ${eyebrow(nb.eyebrow, { icon: true })}
        ${title(nb.h3, "h2", "section-title section-title--md").replace("<h2", '<h2 id="numbers-title"')}
        <div class="stats">
          ${nb.stats.map((s) => `<div class="stat">${img(s.icon, "", { cls: "stat__icon" })}<p><strong class="stat__value t-${s.color}">${esc(s.value)}</strong><span>${esc(s.label)}</span></p></div>`).join("\n          ")}
        </div>
        <p class="numbers__source">${nb.source}</p>
      </div>
      ${img("veleiro-recife", nb.imageAlt, { cls: "numbers__image" })}
    </div>

    <aside class="did-you-know" aria-labelledby="dyk-title">
      <div class="did-you-know__art" aria-hidden="true">${img("icone-interrogacao", "", { cls: "dyk__q" })}${img("icone-concha", "", { cls: "dyk__shell" })}${img("bolhas", "", { cls: "dyk__bubbles" })}</div>
      <div class="did-you-know__text">
        <h3 id="dyk-title" class="underline-coral">${esc(dk.title)}</h3>
        <p>${esc(dk.text)}</p>
      </div>
    </aside>
  </div>
</section>

<!-- BLOCO 08 — Vídeo institucional -->
<section class="section video-section bg-cream" id="${id.video}" aria-labelledby="video-title">
  <div class="container">
    <div class="video-panel">
      <div class="video-panel__text">
        ${eyebrow(v.eyebrow, { light: true })}
        ${title(v.h2, "h2", "section-title section-title--light").replace("<h2", '<h2 id="video-title"')}
        <a class="btn btn--yellow" href="#${id.form}" data-participation="0">${esc(v.cta)} ${arrow}</a>
      </div>
      <figure class="video-player">
        <button type="button" class="video-player__btn" aria-label="${esc(v.playLabel)}" data-video-soon>
          ${img("hero-fundo", "", { cls: "video-player__thumb" })}
          ${img("icone-play", "", { cls: "video-player__play" })}
        </button>
        <figcaption class="video-player__status">${esc(v.status)}</figcaption>
      </figure>
      ${img("divisor-corda", "", { cls: "video-panel__rope" })}
      ${img("ancora", "", { cls: "video-panel__anchor" })}
      ${img("bolhas", "", { cls: "video-panel__bubbles" })}
    </div>
  </div>
</section>

<!-- BLOCOS 09 e 10 — Missão, visão e propósito + Valores -->
<section class="section mvp bg-cream" id="${id.mvp}" aria-labelledby="mvp-title">
  <div class="container">
    <div class="mvp__head">
      <div>${eyebrow(mv.eyebrow)}${title(mv.h2, "h2", "section-title").replace("<h2", '<h2 id="mvp-title"')}</div>
      ${img("ilha-aves", "", { cls: "mvp__island" })}
    </div>
    <div class="mvp__grid">
      ${mv.cards.map((k) => `<article class="mvp-card mvp-card--${k.color}${k.wide ? " mvp-card--wide" : ""}"><h3>${esc(k.title)}</h3><p>${esc(k.text)}</p></article>`).join("\n      ")}
    </div>
  </div>
  ${img("divisor-onda-coral", "", { cls: "band band--to-navy" })}
</section>
<section class="section values bg-navy" id="${id.values}" aria-labelledby="values-title">
  <div class="container">
    ${eyebrow(vl.eyebrow, { light: true, tag: "h2", id: "values-title" })}
    <div class="values__grid">
      ${vl.cards.map((k) => `<article class="value-card"><h3>${esc(k.title)}</h3><p>${esc(k.text)}</p></article>`).join("\n      ")}
    </div>
  </div>
  ${img("tartaruga", "", { cls: "band band--turtle" })}
</section>

<!-- BLOCO 11 — Nossas ações -->
<section class="section actions bg-cream" id="${id.actions}" aria-labelledby="actions-title">
  <div class="container">
    <div class="split-head">
      <div>
        ${eyebrow(ac.eyebrow)}
        ${title(ac.h2, "h2", "section-title").replace("<h2", '<h2 id="actions-title"')}
        <p class="lead">${esc(ac.intro)}</p>
      </div>
      ${img("pescador-rede", ac.imageAlt, { cls: "split-head__art actions__fisher" })}
    </div>
    <div class="actions__grid">
      ${ac.cards.map((k) => `<article class="axis-card axis-card--${k.color}">${img(k.icon, "", { cls: "axis-card__icon" })}<div><p class="axis-card__label">${esc(k.label)}</p><h3>${esc(k.title)}</h3><p>${esc(k.text)}</p></div></article>`).join("\n      ")}
      <article class="axis-card axis-card--transversal">${img(ac.transversal.icon, "", { cls: "axis-card__icon axis-card__icon--light" })}<div><p class="axis-card__label">${esc(ac.transversal.label)}</p><h3>${esc(ac.transversal.title)}</h3><p>${esc(ac.transversal.text)}</p></div></article>
    </div>
  </div>
  ${img("recife-faixa-colorida", "", { cls: "band band--reef" })}
</section>

<!-- BLOCO 12 — Grupos de Trabalho -->
<section class="section gts bg-yellow" id="${id.gts}" aria-labelledby="gts-title">
  <div class="container">
    <div class="split-head">
      <div>
        ${eyebrow(gt.eyebrow)}
        ${title(gt.h2, "h2", "section-title").replace("<h2", '<h2 id="gts-title"')}
        ${gt.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("\n        ")}
      </div>
      ${img("gt-grupo-maos", gt.imageAlt, { cls: "split-head__art gts__people" })}
    </div>
    <div class="gts__list">
      ${gt.cards.map((k) => `<article class="gt-card gt-card--${k.color}">${img(k.img, "", { cls: "gt-card__art" })}<div class="gt-card__body"><p class="gt-card__label">${esc(k.label)}</p><h3>${esc(k.title)}</h3><p>${esc(k.text)}</p></div></article>`).join("\n      ")}
    </div>
  </div>
  ${img("praia-limpeza", "", { cls: "band band--beach" })}
</section>

<!-- BLOCOS 13 e 14 — Governança + Resultados esperados -->
<section class="section governance bg-cream-warm" id="${id.governance}" aria-labelledby="gov-title">
  <div class="container governance__grid">
    <div class="governance__text">
      ${eyebrow(gv.eyebrow)}
      ${title(gv.h2, "h2", "section-title").replace("<h2", '<h2 id="gov-title"')}
      <p class="lead">${esc(gv.text)}</p>
      ${img("aves", "", { cls: "governance__birds" })}
      ${img("pessoas-costao", gv.imageAlt, { cls: "governance__people" })}
    </div>
    <div class="steps-card">
      <h3>${esc(gv.cardTitle)}</h3>
      <ol class="steps">
        ${gv.steps.map((s, i) => `<li>${img(`passo-${i + 1}`, String(i + 1), { cls: "steps__num" })}<div><h4>${esc(s.title)}</h4><p>${esc(s.text)}</p></div></li>`).join("\n        ")}
      </ol>
      <p class="steps-card__note">${esc(gv.note)}</p>
      <a class="btn btn--navy" href="#${id.form}" data-participation="0">${esc(gv.cta)} ${arrow}</a>
    </div>
  </div>
</section>
<section class="section results bg-sky" id="${id.results}" aria-labelledby="results-title">
  <div class="container results__grid">
    <div>
      ${eyebrow(rs.eyebrow)}
      ${title(rs.h2, "h2", "section-title").replace("<h2", '<h2 id="results-title"')}
      <ul class="results__list">
        ${rs.items.map((k) => `<li>${img(k.icon, "", { cls: "results__icon" })}<div><h3>${esc(k.title)}</h3><p>${esc(k.text)}</p></div></li>`).join("\n        ")}
      </ul>
    </div>
    <div class="goals-card">
      <h3>${esc(rs.cardTitle)}</h3>
      <ul class="goals">${rs.goals.map((g) => `<li>${esc(g)}</li>`).join("")}</ul>
    </div>
  </div>
  ${img("recife-faixa-baixa", "", { cls: "band band--reef-low" })}
</section>

<!-- BLOCOS 15 e 16 — Rede de Impacto + Materiais -->
<section class="section network bg-cream-warm" id="${id.network}" aria-labelledby="network-title">
  <div class="container">
    <div class="split-head">
      <div>
        ${eyebrow(nw.eyebrow)}
        ${title(nw.h2, "h2", "section-title").replace("<h2", '<h2 id="network-title"')}
      </div>
      ${img("barco-ilha", nw.imageAlt, { cls: "split-head__art network__boat" })}
    </div>
    <div class="partners">
      ${nw.categories.map((cat) => `<div class="partners__row">
        <h3 class="partners__cat">${esc(cat.title)}</h3>
        <ul class="partners__logos">${cat.items.map((it) => it.placeholder
          ? `<li class="logo-card logo-card--placeholder">${esc(it.placeholder)}</li>`
          : `<li class="logo-card">${img(it.logo, it.name, { cls: "logo-card__img" })}${it.showName ? `<span class="logo-card__name" aria-hidden="true">${esc(it.name)}</span>` : ""}</li>`).join("")}</ul>
      </div>`).join("\n      ")}
    </div>
    <div class="join-band">
      ${img("coral-eyebrow", "", { cls: "join-band__coral join-band__coral--left" })}
      <p><strong>${esc(nw.ctaText)}</strong> <span class="t-sky">${esc(nw.ctaHighlight)}</span></p>
      <a class="btn btn--yellow" href="#${id.form}" data-participation="0">${esc(nw.ctaButton)} ${arrow}</a>
      ${img("coral-laranja", "", { cls: "join-band__coral join-band__coral--right" })}
    </div>
  </div>
</section>
<section class="section materials bg-sky" id="${id.materials}" aria-labelledby="materials-title">
  <div class="container">
    <div class="split-head">
      <div>
        ${eyebrow(mt.eyebrow)}
        ${title(mt.h2, "h2", "section-title").replace("<h2", '<h2 id="materials-title"')}
        <p class="lead">${esc(mt.intro)}</p>
      </div>
      ${img("documentos-corais", mt.imageAlt, { cls: "split-head__art materials__docs" })}
    </div>
    <div class="docs">
      ${mt.docs.map((d) => `<article class="doc-card${d.soon ? " doc-card--soon" : ""}">
        ${img(d.icon, "", { cls: "doc-card__icon" })}
        <div class="doc-card__body">
          ${d.kicker ? `<p class="doc-card__kicker">${esc(d.kicker)}</p>` : ""}
          <h3>${esc(d.title)}</h3>
          <p>${esc(d.text)}</p>
          <p class="doc-card__meta">${esc(d.meta)}</p>
          <span class="btn btn--navy btn--xs${d.soon ? " btn--muted" : ""}" aria-disabled="true" title="${esc(d.soon ? d.cta : mt.pendingTitle)}">${esc(d.cta)}</span>
        </div>
      </article>`).join("\n      ")}
    </div>
  </div>
  ${img("ornamento-centro", "", { cls: "materials__orn" })}
  ${img("cardume", "", { cls: "materials__fish" })}
</section>

<!-- BLOCO 17 — Contato -->
<section class="section contact bg-navy" id="${id.contact}" aria-labelledby="contact-title">
  <div class="container contact__grid">
    <div class="contact__text">
      ${eyebrow(ct.eyebrow, { light: true })}
      ${title(ct.h2, "h2", "section-title section-title--light").replace("<h2", '<h2 id="contact-title"')}
      <p class="lead">${esc(ct.intro)}</p>
      <ul class="contact__channels">
        <li>${img("icone-email", "", { cls: "contact__icon" })}<a href="mailto:${ct.email}"><strong>${esc(ct.email)}</strong></a></li>
        <li>${img("icone-instagram", "", { cls: "contact__icon" })}<a href="${ct.instagramUrl}" target="_blank" rel="noopener"><strong>${esc(ct.instagram)}</strong></a></li>
        <li>${img("icone-linkedin", "", { cls: "contact__icon" })}<em>${esc(ct.linkedin)}</em></li>
        <li>${img("icone-youtube", "", { cls: "contact__icon" })}<em>${esc(ct.youtube)}</em></li>
      </ul>
      ${img("cardume", "", { cls: "contact__fish" })}
    </div>
    <form class="contact-form" id="${id.form}" data-contact-form data-endpoint="${FORM_ENDPOINT}" data-lang="${c.lang}" novalidate>
      <div class="field"><label for="f-name">${esc(fm.name)} ${req}</label><input id="f-name" name="name" type="text" autocomplete="name" placeholder="${esc(fm.namePh)}" required maxlength="160"></div>
      <div class="field"><label for="f-email">${esc(fm.email)} ${req}</label><input id="f-email" name="email" type="email" autocomplete="email" placeholder="${esc(fm.emailPh)}" required maxlength="200"></div>
      <div class="field"><label for="f-org">${esc(fm.org)}</label><input id="f-org" name="organization" type="text" autocomplete="organization" placeholder="${esc(fm.orgPh)}" maxlength="200"></div>
      <div class="field"><label for="f-sector">${esc(fm.sector)} ${req}</label><select id="f-sector" name="sector" required><option value="">${esc(fm.sectorPh)}</option>${fm.sectors.map((s) => `<option>${esc(s)}</option>`).join("")}</select></div>
      <div class="field field--full"><label for="f-part">${esc(fm.participation)} ${req}</label><select id="f-part" name="participation" required>${fm.participations.map((s) => `<option>${esc(s)}</option>`).join("")}</select></div>
      <fieldset class="field field--full checks"><legend>${esc(fm.gts)}</legend>${fm.gtOptions.map((g, i) => `<label class="check"><input type="checkbox" name="workingGroups" value="${esc(g)}" id="f-gt${i}"><span>${esc(g)}</span></label>`).join("")}</fieldset>
      <div class="field field--full"><label for="f-msg">${esc(fm.message)} ${req}</label><textarea id="f-msg" name="message" rows="4" placeholder="${esc(fm.messagePh)}" required maxlength="5000"></textarea></div>
      <div class="field field--full hp" aria-hidden="true"><label for="f-website">Website</label><input id="f-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
      <label class="check check--consent field--full"><input type="checkbox" name="consent" required><span>${fm.consent} ${req}</span></label>
      <div class="field--full contact-form__actions">
        <button class="btn btn--yellow" type="submit" data-label="${esc(fm.submit)}" data-sending="${esc(fm.sending)}">${esc(fm.submit)} ${arrow}</button>
        <p class="contact-form__status" role="status" aria-live="polite" data-ok="${esc(fm.success)}" data-error="${esc(fm.error)}" data-required="${esc(fm.required)}"></p>
      </div>
    </form>
  </div>
  ${img("recife-contato", "", { cls: "contact__reef" })}
  <svg class="contact__wave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true"><path d="M0 52 C 160 20 320 20 480 46 S 800 78 960 50 S 1280 18 1440 40 V90 H0Z" fill="#f7f2e7"/><path d="M0 52 C 160 20 320 20 480 46 S 800 78 960 50 S 1280 18 1440 40" fill="none" stroke="#9fd6f4" stroke-width="6"/><path d="M0 64 C 180 36 330 36 490 58 S 810 88 970 62 S 1290 32 1440 52" fill="none" stroke="#2ec6b7" stroke-width="2.5" opacity=".8"/></svg>
</section>

</main>
${footer(c)}
<script src="/assets/js/main.js?v=${VERSION}" defer></script>
</body>
</html>
`;
}

function privacyPage(c, p) {
  return `${head(c, { title: p.title, description: p.description, path: p.path, altPath: p.altPath })}
<body class="page-legal">
${header(c, { home: false })}
<main id="conteudo" class="section legal bg-cream">
  <div class="container container--narrow">
    ${eyebrow(p.eyebrow)}
    <h1 class="section-title">${esc(p.h1)}</h1>
    <p class="legal__updated">${esc(p.updated)}</p>
    ${p.sections.map((s) => `<h2>${esc(s.h)}</h2>${s.body}`).join("\n    ")}
    <p><a class="text-cta" href="${c.path}">${esc(p.back)}</a></p>
  </div>
</main>
${footer(c, { home: false })}
<script src="/assets/js/main.js?v=${VERSION}" defer></script>
</body>
</html>
`;
}

const out = (rel, html) => {
  const file = join(SITE, rel);
  mkdirSync(join(file, ".."), { recursive: true });
  writeFileSync(file, html);
  console.log(`${rel} ${(html.length / 1024).toFixed(1)} KB`);
};

out("index.html", page(pt));
out("en/index.html", page(en));
out("politica-de-privacidade/index.html", privacyPage(pt, privacy.pt));
out("en/privacy-policy/index.html", privacyPage(en, privacy.en));
out("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${ORIGIN}/sitemap.xml\n`);
out("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url><loc>${ORIGIN}/</loc><xhtml:link rel="alternate" hreflang="pt-BR" href="${ORIGIN}/"/><xhtml:link rel="alternate" hreflang="en" href="${ORIGIN}/en/"/></url>
  <url><loc>${ORIGIN}/en/</loc><xhtml:link rel="alternate" hreflang="pt-BR" href="${ORIGIN}/"/><xhtml:link rel="alternate" hreflang="en" href="${ORIGIN}/en/"/></url>
  <url><loc>${ORIGIN}/politica-de-privacidade/</loc></url>
  <url><loc>${ORIGIN}/en/privacy-policy/</loc></url>
</urlset>
`);
