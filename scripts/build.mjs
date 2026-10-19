// Gera as páginas estáticas a partir de content/{pt,en}.mjs:
//   site/index.html, site/en/index.html,
//   site/politica-de-privacidade/index.html, site/en/privacy-policy/index.html
// Rodar com: npm run build
//
// v2 (briefing da Bloom, 2026-10-19): "institucional com assinatura artesanal" —
// base editorial (branco, azul profundo, tipografia hierarquizada), cards com
// borda fina, números como protagonistas, ícones de linha só onde ajudam
// (contato/download), no máximo 3 ilustrações em xilogravura (BrandBook) e
// conteúdo pendente oculto (logos "a confirmar", LinkedIn/YouTube, Resultados
// esperados, documentos sem arquivo). A v1 está na tag git `v1`.
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

function img(name, alt = "", { cls = "", eager = false } = {}) {
  const d = dims[name];
  if (!d) throw new Error(`imagem não encontrada: ${name}`);
  const a = alt ? `alt="${esc(alt)}"` : `alt="" aria-hidden="true"`;
  return `<img src="/assets/img/${name}.webp" width="${d[0]}" height="${d[1]}" ${a}${cls ? ` class="${cls}"` : ""} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

// Foto real em faixa larga (srcset 960/1920). Legenda + crédito do fotógrafo sempre visíveis.
function photo(name, ph, { cls = "", eager = false } = {}) {
  const d = dims[name];
  if (!d) throw new Error(`imagem não encontrada: ${name}`);
  const im = `<img src="/assets/img/${name}.webp" srcset="/assets/img/${name}-960.webp 960w, /assets/img/${name}.webp ${d[0]}w" sizes="100vw" width="${d[0]}" height="${d[1]}" ${ph ? `alt="${esc(ph.alt)}"` : `alt="" aria-hidden="true"`}${cls ? ` class="${cls}"` : ""} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  if (!ph) return im;
  return `<figure class="photo-band">${im}<figcaption class="container"><span>${esc(ph.caption)}</span> <span class="photo-band__credit">${esc(ph.credit)}</span></figcaption></figure>`;
}

const title = (parts, tag = "h2", cls = "", id = "") =>
  `<${tag}${id ? ` id="${id}"` : ""}${cls ? ` class="${cls}"` : ""}>${parts.map((p) => (p.c ? `<span class="t-${p.c}">${esc(p.t)}</span>` : `<span>${esc(p.t)}</span>`)).join(" ")}</${tag}>`;

const eyebrow = (text, { light = false, tag = "p", id = "" } = {}) =>
  `<${tag}${id ? ` id="${id}"` : ""} class="eyebrow${light ? " eyebrow--light" : ""}">${esc(text)}</${tag}>`;

// Ícones de linha: um conjunto só, mesma espessura (briefing: "ícones de linha, em uma cor")
const icon = {
  arrow: `<svg class="btn__arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>`,
  mail: `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>`,
  instagram: `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.2 6.8h.01"/></svg>`,
  globe: `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18"/></svg>`,
  file: `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>`,
  download: `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11m-5-5 5 5 5-5M5 20h14"/></svg>`,
  play: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7v10l8-5z"/></svg>`,
};

const logoImg = (c, cls, eager = false) => {
  const key = c.lang === "en" ? "logo-en" : "logo-pt";
  return `<img src="${c.logo.src}" width="${dims[key][0]}" height="${dims[key][1]}" alt="${esc(c.logo.alt)}"${cls ? ` class="${cls}"` : ""} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>`;
};

function header(c, { home = true } = {}) {
  const href = (h) => (home ? h : `${c.path}${h}`);
  const navItems = c.nav.map((n) => `<li><a href="${href(n.href)}">${esc(n.label)}</a></li>`).join("");
  return `
<a class="skip-link" href="#conteudo">${esc(c.skip)}</a>
<header class="site-header" data-header>
  <div class="container site-header__inner">
    <a class="brand" href="${c.path}" aria-label="${esc(c.logo.alt)}">${logoImg(c, "", true)}</a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="menu" data-menu-toggle data-label-open="${esc(c.menuOpen)}" data-label-close="${esc(c.menuClose)}">
      <span class="sr-only">${esc(c.menuOpen)}</span><span class="menu-toggle__bar"></span><span class="menu-toggle__bar"></span><span class="menu-toggle__bar"></span>
    </button>
    <nav class="site-nav" id="menu" data-menu aria-label="Menu">
      <ul class="site-nav__list">${navItems}</ul>
      <div class="site-nav__actions">
        <a class="btn btn--coral btn--sm" href="${href("#" + c.ids.form)}" data-participation="0">${esc(c.navCta)}</a>
        <div class="lang-switch" role="group" aria-label="${esc(c.langSwitchLabel)}">
          <a href="/" lang="pt-BR" ${c.lang === "pt-BR" ? 'aria-current="true"' : ""}>PT</a><span aria-hidden="true">|</span><a href="/en/" lang="en" ${c.lang === "en" ? 'aria-current="true"' : ""}>EN</a>
        </div>
      </div>
    </nav>
  </div>
</header>`;
}

function footer(c, { home = true } = {}) {
  const f = c.footer;
  const href = (h) => (h.startsWith("#") && !home ? `${c.path}${h}` : h);
  const pdf = (h) => (h.endsWith(".pdf") ? ' target="_blank" rel="noopener" type="application/pdf"' : "");
  return `
<footer class="site-footer">
  <div class="container site-footer__grid">
    <div class="site-footer__brand">
      ${logoImg(c, "site-footer__logo")}
      <div class="site-footer__slogan">
        ${img("selo-vida-que-pulsa", "", { cls: "site-footer__selo" })}
        <p class="site-footer__tagline">${esc(f.tagline)}</p>
      </div>
      <p>${esc(f.text)}</p>
      <p class="site-footer__tags">${f.hashtags.map((h) => `<span>${esc(h)}</span>`).join("")}</p>
    </div>
    <div class="site-footer__nav">
      <p class="site-footer__title">${esc(f.navTitle)}</p>
      <ul>${f.links.map((l) => `<li><a href="${href(l.href)}"${pdf(l.href)}>${esc(l.label)}</a></li>`).join("")}</ul>
    </div>
    <div class="site-footer__ombuds">
      <p class="site-footer__title">${esc(f.ombudsTitle)}</p>
      <p>${f.ombudsText}</p>
      <ul class="site-footer__contacts">
        <li>${icon.globe}<a href="${c.path}">${esc(f.site)}</a></li>
        <li>${icon.mail}<a href="mailto:${c.contact.email}">${esc(c.contact.email)}</a></li>
        <li>${icon.instagram}<a href="${c.contact.instagramUrl}" target="_blank" rel="noopener">${esc(c.contact.instagram)}</a></li>
      </ul>
      <p class="site-footer__copy">${esc(f.copyright)}</p>
    </div>
  </div>
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
  const mv = c.mvp, vl = c.values, ac = c.actions, gt = c.gts, gv = c.governance, nw = c.network, mt = c.materials, ct = c.contact, fm = ct.form;
  const req = `<abbr class="req" title="${esc(fm.requiredMark)}">*</abbr>`;
  const pad2 = (n) => String(n).padStart(2, "0");

  // Pendências ocultas (briefing): linhas de logos só com "a confirmar" e documentos sem arquivo
  const partnerRows = nw.categories.filter((cat) => cat.items.some((it) => !it.placeholder));
  const readyDocs = mt.docs.filter((d) => d.href);
  // Eixo + Grupo de Trabalho unificados (antes: "Nossas ações" e "Grupos de Trabalho" repetiam os 5 eixos)
  const axes = [...ac.cards, { ...ac.transversal, transversal: true }].map((axis, i) => ({ ...axis, gt: gt.cards[i] }));

  return `${head(c, { title: c.title, description: c.description, path: c.path, altPath: c.altPath })}
<body>
${header(c)}
<main id="conteudo">

<!-- Hero -->
<section class="hero" aria-labelledby="hero-title">
  ${photo("foto-hero", null, { cls: "hero__photo", eager: true })}
  <div class="container hero__content">
    <p class="hero__eyebrow">${img("coral-eyebrow", "", { cls: "hero__eyebrow-icon", eager: true })}<span>${esc(h.eyebrow)}</span></p>
    ${title(h.h1, "h1", "hero__title", "hero-title")}
    <p class="hero__sub">${esc(h.sub)}</p>
    <div class="hero__ctas">
      <a class="btn btn--coral" href="#${id.form}" data-participation="0">${esc(h.cta1)} ${icon.arrow}</a>
      <a class="btn btn--ghost" href="#${id.about}">${esc(h.cta2)} ${icon.arrow}</a>
    </div>
    <p class="hero__aligned">${img("tres-ondas", "", { cls: "hero__waves-icon", eager: true })}<span>${h.aligned}</span></p>
  </div>
  <p class="hero__credit">${esc(c.photos.hero.credit)}</p>
</section>

<!-- Quem somos -->
<section class="section about" id="${id.about}" aria-labelledby="about-title">
  <div class="container about__grid">
    <div class="about__text">
      ${eyebrow(a.eyebrow)}
      ${title(a.h2, "h2", "section-title", "about-title")}
      ${a.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("\n      ")}
      <a class="text-link" href="#${id.video}">${esc(a.videoCta)} ${icon.arrow}</a>
    </div>
    <div class="about__art">${img("selo-rede-viva", "", { cls: "about__selo" })}</div>
  </div>
</section>

<!-- Como atuamos -->
<section class="section how tint" id="${id.how}" aria-labelledby="how-title">
  <div class="container">
    ${eyebrow(hw.eyebrow, { tag: "h2", id: "how-title" })}
    <ol class="pillars">
      ${hw.cards.map((k, i) => `<li class="pillar"><div class="pillar__head">${img(k.icon, "", { cls: "pillar__icon" })}<span class="pillar__num">${pad2(i + 1)}</span></div><h3>${esc(k.title)}</h3><p>${esc(k.text)}</p></li>`).join("\n      ")}
    </ol>
  </div>
</section>

<!-- Recifes do Brasil -->
<section class="section reefs" id="${id.reefs}" aria-labelledby="reefs-title">
  <div class="container">
    <div class="split">
      <div>
        ${eyebrow(r.eyebrow)}
        ${title(r.h2, "h2", "section-title", "reefs-title")}
        <p class="lead">${esc(r.intro)}</p>
      </div>
      ${img("coral-xilogravura", "", { cls: "split__art reefs__coral" })}
    </div>
    <div class="cards cards--4">
      ${r.cards.map((k) => `<article class="card"><h3>${esc(k.title)}</h3><p>${esc(k.text)}</p></article>`).join("\n      ")}
    </div>
  </div>
</section>

${photo("foto-piscinas", c.photos.piscinas)}

<!-- Recifes em números + Você sabia? -->
<section class="section numbers navy" id="${id.numbers}" aria-labelledby="numbers-title">
  <div class="container">
    ${eyebrow(nb.eyebrow, { light: true })}
    ${title(nb.h3, "h2", "section-title section-title--light", "numbers-title")}
    <dl class="stats">
      ${nb.stats.map((s) => `<div class="stat"><dt class="stat__value t-${s.color}">${esc(s.value)}</dt><dd>${esc(s.label)}</dd></div>`).join("\n      ")}
    </dl>
    <p class="numbers__source">${nb.source}</p>
  </div>
</section>
<section class="section dyk-section" aria-labelledby="dyk-title">
  <div class="container">
    <aside class="did-you-know">
      <h2 id="dyk-title">${esc(dk.title)}</h2>
      <p>${esc(dk.text)}</p>
    </aside>
  </div>
</section>

<!-- Vídeo institucional -->
<section class="section video-section tint" id="${id.video}" aria-labelledby="video-title">
  <div class="container video__grid">
    <div>
      ${eyebrow(v.eyebrow)}
      ${title(v.h2, "h2", "section-title", "video-title")}
      <a class="btn btn--navy" href="#${id.form}" data-participation="0">${esc(v.cta)} ${icon.arrow}</a>
    </div>
    <figure class="video-player">
      <button type="button" class="video-player__btn" aria-label="${esc(v.playLabel)}" data-video-soon>
        <span class="video-player__play">${icon.play}</span>
      </button>
      <figcaption class="video-player__status">${esc(v.status)}</figcaption>
    </figure>
  </div>
</section>

<!-- Missão, visão e propósito -->
<section class="section mvp" id="${id.mvp}" aria-labelledby="mvp-title">
  <div class="container">
    ${eyebrow(mv.eyebrow)}
    ${title(mv.h2, "h2", "section-title", "mvp-title")}
    <div class="cards cards--2">
      ${mv.cards.map((k) => `<article class="card card--lg${k.wide ? " card--wide" : ""}"><h3>${esc(k.title)}</h3><p>${esc(k.text)}</p></article>`).join("\n      ")}
    </div>
  </div>
</section>

<!-- Nossos valores -->
<section class="section values navy" id="${id.values}" aria-labelledby="values-title">
  <div class="container">
    ${eyebrow(vl.eyebrow, { light: true, tag: "h2", id: "values-title" })}
    <div class="cards cards--2">
      ${vl.cards.map((k) => `<article class="card card--dark"><h3>${esc(k.title)}</h3><p>${esc(k.text)}</p></article>`).join("\n      ")}
    </div>
  </div>
</section>

${photo("foto-viveiro", c.photos.viveiro)}

<!-- Nossas ações + Grupos de Trabalho (unificados) -->
<section class="section actions" id="${id.actions}" aria-labelledby="actions-title">
  <div class="container">
    ${eyebrow(ac.eyebrow)}
    ${title(ac.h2, "h2", "section-title", "actions-title")}
    <div class="actions__intro">
      <p class="lead">${esc(ac.intro)}</p>
      <div id="${id.gts}" class="actions__gts">${gt.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
    </div>
    <ol class="axes">
      ${axes.map((x) => `<li class="axis${x.transversal ? " axis--transversal" : ""}">
        <p class="axis__label">${esc(x.label)}</p>
        <h3>${esc(x.title)}</h3>
        <p>${esc(x.text)}</p>
        <p class="axis__gt"><strong>${esc(ac.gtLabel)}:</strong> ${esc(x.gt.text)}</p>
      </li>`).join("\n      ")}
    </ol>
  </div>
</section>

<!-- Governança em rede -->
<section class="section governance tint" id="${id.governance}" aria-labelledby="gov-title">
  <div class="container governance__grid">
    <div>
      ${eyebrow(gv.eyebrow)}
      ${title(gv.h2, "h2", "section-title", "gov-title")}
      <p class="lead">${esc(gv.text)}</p>
    </div>
    <div class="steps-card">
      <h3>${esc(gv.cardTitle)}</h3>
      <ol class="steps">
        ${gv.steps.map((s, i) => `<li><span class="steps__num" aria-hidden="true">${i + 1}</span><div><h4>${esc(s.title)}</h4><p>${esc(s.text)}</p></div></li>`).join("\n        ")}
      </ol>
      <p class="steps-card__note">${esc(gv.note)}</p>
      <a class="btn btn--navy" href="#${id.form}" data-participation="0">${esc(gv.cta)} ${icon.arrow}</a>
    </div>
  </div>
</section>

<!-- Rede de Impacto -->
${photo("foto-cardume", c.photos.cardume)}
<section class="section network" id="${id.network}" aria-labelledby="network-title">
  <div class="container">
    ${eyebrow(nw.eyebrow)}
    ${title(nw.h2, "h2", "section-title", "network-title")}
    <div class="partners">
      ${partnerRows.map((cat) => `<div class="partners__row">
        <h3 class="partners__cat">${esc(cat.title)}</h3>
        <ul class="partners__logos">${cat.items.filter((it) => !it.placeholder).map((it) => `<li class="logo-card">${img(it.logo, it.name, { cls: "logo-card__img" })}${it.showName ? `<span class="logo-card__name" aria-hidden="true">${esc(it.name)}</span>` : ""}</li>`).join("")}</ul>
      </div>`).join("\n      ")}
    </div>
    <div class="join-band">
      <p><strong>${esc(nw.ctaText)}</strong> <span>${esc(nw.ctaHighlight)}</span></p>
      <a class="btn btn--coral" href="#${id.form}" data-participation="0">${esc(nw.ctaButton)} ${icon.arrow}</a>
    </div>
  </div>
</section>

<!-- Materiais e downloads (só documentos prontos) -->
<section class="section materials tint" id="${id.materials}" aria-labelledby="materials-title">
  <div class="container">
    ${eyebrow(mt.eyebrow)}
    ${title(mt.h2, "h2", "section-title", "materials-title")}
    <p class="lead">${esc(mt.intro)}</p>
    <div class="docs">
      ${readyDocs.map((d) => `<article class="doc">
        <span class="doc__icon">${icon.file}</span>
        <div class="doc__body">
          <h3>${esc(d.title)}</h3>
          <p>${esc(d.text)}</p>
          <p class="doc__meta">${esc(d.meta)}</p>
        </div>
        <a class="btn btn--outline btn--sm doc__btn" href="${d.href}" target="_blank" rel="noopener" type="application/pdf">${icon.download} ${esc(d.cta)}</a>
      </article>`).join("\n      ")}
    </div>
  </div>
</section>

<!-- Contato -->
<section class="section contact navy" id="${id.contact}" aria-labelledby="contact-title">
  <div class="container contact__grid">
    <div class="contact__text">
      ${eyebrow(ct.eyebrow, { light: true })}
      ${title(ct.h2, "h2", "section-title section-title--light", "contact-title")}
      <p class="lead">${esc(ct.intro)}</p>
      <ul class="contact__channels">
        <li>${icon.mail}<a href="mailto:${ct.email}">${esc(ct.email)}</a></li>
        <li>${icon.instagram}<a href="${ct.instagramUrl}" target="_blank" rel="noopener">${esc(ct.instagram)}</a></li>
      </ul>
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
        <button class="btn btn--coral" type="submit" data-label="${esc(fm.submit)}" data-sending="${esc(fm.sending)}">${esc(fm.submit)} ${icon.arrow}</button>
        <p class="contact-form__status" role="status" aria-live="polite" data-ok="${esc(fm.success)}" data-error="${esc(fm.error)}" data-required="${esc(fm.required)}"></p>
      </div>
    </form>
  </div>
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
<main id="conteudo" class="section legal">
  <div class="container container--narrow">
    ${eyebrow(p.eyebrow)}
    <h1 class="section-title">${esc(p.h1)}</h1>
    <p class="legal__updated">${esc(p.updated)}</p>
    ${p.sections.map((s) => `<h2>${esc(s.h)}</h2>${s.body}`).join("\n    ")}
    <p><a class="text-link" href="${c.path}">${esc(p.back)}</a></p>
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
