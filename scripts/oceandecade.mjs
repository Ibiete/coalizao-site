// Importa a página do evento "Coral Reefs at the Frontline" (Ocean Decade Week
// 2027), feita no Lovable, para /oceandecade/ deste site.
//
//   node scripts/oceandecade.mjs            # baixa de novo e regera site/oceandecade/
//
// Conteúdo, ordem das seções e imagens ficam exatamente como no Lovable (o app
// é copiado inteiro: EN/PT, contadores, formulário por e-mail). O script só:
//   - serve o app sob /oceandecade/ (basepath do roteador + caminhos dos assets);
//   - troca a logo provisória (emoji 🪸 + nome em texto) pelo logo oficial EN: versão
//     branca (negativa, regra do BrandBook p/ fundo escuro) no topo, no "Hosted by" e
//     no rodapé; versão colorida num cartão claro na seção "Hosted by";
//   - acrescenta os logos do evento (Ocean Decade / Ocean Decade Conference) no
//     hero e uma faixa "Official Special Event of" + "Lead Partners" antes do rodapé;
//   - troca cores e fontes pelas da identidade da Coalizão (fim do CSS do app);
//   - tira o selo "Edit with Lovable" e os scripts de analytics do Lovable;
//   - atualiza o bloco /oceandecade/ do nginx.conf com os hashes dos scripts
//     embutidos (CSP sem 'unsafe-inline' para scripts).
// Se o Lovable mudar o HTML/JS a ponto de um ajuste não encontrar o trecho
// esperado, o script para com erro em vez de publicar algo pela metade.

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const SRC = "https://coralreefs.lovable.app";
const BASE = "/oceandecade";
const ROOT = new URL("../", import.meta.url).pathname;
const OUT = `${ROOT}site/oceandecade`;
// Original em alta da foto do topo (Helena Villela), fora do git como as demais
// fotos de brand/fotos/. Sem ele, usa a versão 1920px do próprio Lovable.
const HERO_ORIGINAL = `${ROOT}brand/fotos/DSC07704.JPG`;

// Logos oficiais (pasta Drive 1fLOPvyaAzjsH0Df-yF_IbrrpbwN86jcJ, enviada pelo
// Shawã em 2026-10-27), guardados em brand/oceandecade/. A Coalizão aparece na
// versão EN (evento internacional): branca (negativa, BrandBook v03 p. 11) sobre
// fundo escuro, colorida no cartão claro da seção "Hosted by".
const LOGOS = `${ROOT}brand/oceandecade`;
const HOST_ALT = "Brazilian Coral Reef Coalition (Coalizão Corais do Brasil)";
const LOGO_NEG = `${BASE}/assets/logo-coalizao-en-branca.webp`;
const LOGO = `${BASE}/assets/logo-coalizao-en.webp`;

// Logos do evento e Lead Partners (nesta ordem, pedido do Shawã). Todos feitos
// para fundo claro (alguns já vêm com caixa branca), por isso ficam sobre branco.
const EVENTO = [
  ["ocean-decade", "United Nations Decade of Ocean Science for Sustainable Development 2021–2030"],
  ["ocean-decade-conference", "2027 Ocean Decade Conference, Rio de Janeiro"],
];
const PARCEIROS = [
  ["wwf", "WWF-Brasil"],
  ["boticario", "Fundação Grupo Boticário"],
  ["aquario", "AquaRio – Aquário Marinho do Rio de Janeiro"],
  ["icrs", "International Coral Reef Society (ICRS)"],
  ["bloom", "Bloom Ocean"],
  ["governo", "Ministério do Meio Ambiente e Mudança do Clima — Governo Federal"],
];

// Corta a margem transparente e, se houver, a caixa branca em volta (WWF, AquaRio, Governo)
async function recortado(file) {
  const semMargem = await sharp(`${LOGOS}/${file}.png`).trim().png().toBuffer();
  return sharp(semMargem).trim({ background: "#ffffff", threshold: 12 }).png().toBuffer().catch(() => semMargem);
}
// Correção ótica: o Governo é um lockup largo com letras miúdas e fica pequeno na mesma área
const AJUSTE_AREA = { governo: 1.6 };

const logoWebp = async (file, size) =>
  sharp(await recortado(file)).resize(size).webp({ quality: 90, alphaQuality: 100 }).toBuffer();

// Tamanho de exibição por área visual (logo largo fica mais baixo, logo alto fica
// mais estreito), em vez de altura fixa: senão o Boticário domina e o WWF some.
async function medidas(file, area, maxH, maxW) {
  const { width, height } = await sharp(await recortado(file)).metadata();
  const r = width / height;
  let h = Math.sqrt(area / r);
  h = Math.min(h, maxH, maxW / r);
  return { "--w": Math.round(h * r), "--h": Math.round(h) };
}

// Elementos novos entram nos dois lados (HTML pré-renderizado e JS do React) a
// partir da mesma descrição, para a hidratação encontrar exatamente o mesmo
// markup. Texto bilíngue vira [en, pt]: o HTML sai em inglês (idioma inicial)
// e o JS escolhe pelo idioma ativo (hook J() do app).
const el = (tag, props, ...children) => ({ tag, props, children });
const escHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const escJs = (s) => s.replace(/[`\\$]/g, "\\$&");
function toHtml(n) {
  if (Array.isArray(n)) return escHtml(n[0]);
  if (typeof n === "string") return escHtml(n);
  const val = (v) => (typeof v === "object" ? Object.entries(v).map(([a, b]) => `${a}:${b}`).join(";") : String(v));
  const attrs = Object.entries(n.props).map(([k, v]) => ` ${k === "className" ? "class" : k}="${escHtml(val(v))}"`).join("");
  return n.tag === "img" ? `<img${attrs}/>` : `<${n.tag}${attrs}>${n.children.map(toHtml).join("")}</${n.tag}>`;
}
function toJsx(n) {
  if (Array.isArray(n)) return `(J().lang===\`pt\`?\`${escJs(n[1])}\`:\`${escJs(n[0])}\`)`;
  if (typeof n === "string") return `\`${escJs(n)}\``;
  const props = Object.entries(n.props).map(([k, v]) => `${JSON.stringify(k)}:${typeof v === "object" ? JSON.stringify(v) : `\`${escJs(String(v))}\``}`);
  const kids = n.children.map(toJsx);
  if (kids.length === 1) props.push(`children:${kids[0]}`);
  else if (kids.length > 1) props.push(`children:[${kids.join(",")}]`);
  return `(0,k.${kids.length > 1 ? "jsxs" : "jsx"})(\`${n.tag}\`,{${props.join(",")}})`;
}
const img = (name, alt, style) => el("img", { src: `${BASE}/assets/${name}.webp`, alt, loading: "lazy", ...(style && { style }) });

// Hero: cartão branco com os logos do evento, logo abaixo da contagem regressiva
const heroEvento = (m) => el("div", { className: "od-eventos" }, ...EVENTO.map(([n, a]) => img(n, a, m[n])));
// Antes do rodapé: faixa branca com o evento oficial e os Lead Partners
const faixa = (m) => el("div", { className: "od-faixa" },
  el("div", { className: "od-faixa__in" },
    el("div", { className: "od-grupo" },
      el("p", { className: "od-rotulo" }, ["Official Special Event of", "Evento Especial Oficial da"]),
      el("div", { className: "od-logos" }, ...EVENTO.map(([n, a]) => img(n, a, m[n])))),
    el("div", { className: "od-grupo" },
      el("p", { className: "od-rotulo" }, ["Lead Partners", "Parceiros Líderes"]),
      el("div", { className: "od-logos" }, ...PARCEIROS.map(([n, a]) => img(n, a, m[n]))))));

async function get(path) {
  const res = await fetch(SRC + path, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

function replaceOnce(text, from, to, label) {
  const n = text.split(from).length - 1;
  if (n !== 1) throw new Error(`${label}: esperava 1 ocorrência, achei ${n}`);
  return text.replace(from, () => to);
}

function replaceExactly(text, from, to, count, label) {
  const n = text.split(from).length - 1;
  if (n !== count) throw new Error(`${label}: esperava ${count} ocorrências, achei ${n}`);
  return text.split(from).join(to);
}

// Paleta e fontes da Coalizão (site/assets/css/style.css). As variáveis do app
// ficam em @layer; este bloco fora de camada vence sem !important.
const THEME = `
/* === Identidade Coalizão Corais do Brasil (scripts/oceandecade.mjs) === */
:root{
  --abyss:#1b2b57;--abyss-foreground:#f8f5ee;
  --bleached:#f8f5ee;--sand:#f7f2e7;
  --coral:#fd6e5d;--coral-foreground:#1b2b57;
  --lagoon:#9fd6f4;--lagoon-deep:#07677f;
  --muted-foreground:#55607e;--border:#dde1ea;--input:#cfd5e2;
  --accent:color-mix(in srgb,#9fd6f4 30%,#fff);
  --gradient-hero:linear-gradient(20deg,rgb(21 33 68/.95) 0%,rgb(27 43 87/.75) 40%,rgb(27 43 87/.15) 100%);
  --gradient-bleach:linear-gradient(180deg,color-mix(in srgb,#fd6e5d 18%,#fff) 0%,var(--bleached) 100%);
  --shadow-soft:0 10px 30px -12px rgb(27 43 87/.18);
  --shadow-coral:0 10px 30px -10px rgb(253 110 93/.55);
  --font-display:"Signika",system-ui,sans-serif;
  --font-sans:"Nunito Sans",system-ui,sans-serif;
  --default-font-family:var(--font-sans);
}
/* a utilidade do Tailwind fixa a fonte em vez de usar a variável */
.font-display{font-family:var(--font-display)}
/* correção (já existia no Lovable): botão "Download the form to draft offline (PDF…)"
   não quebrava linha e deixava a página mais larga que o celular */
@media (max-width:640px){.inline-flex.whitespace-nowrap{white-space:normal;max-width:100%;height:auto;min-height:2.5rem;text-align:center}}
.coalizao-logo-neg{display:inline-block;height:2.4em;width:auto;vertical-align:middle}
.coalizao-logo{display:block;margin:0 auto;width:min(340px,80%);height:auto;background:#f8f5ee;padding:18px 26px;border-radius:16px}
/* logos do evento (hero) e faixa Official Special Event / Lead Partners (antes do rodapé) */
.od-eventos{display:inline-flex;flex-wrap:wrap;align-items:center;gap:14px 22px;margin-top:28px;padding:10px 18px;background:#fff;border-radius:16px;box-shadow:var(--shadow-soft)}
.od-eventos img{width:calc(var(--w)*.8px);height:calc(var(--h)*.8px)}
.od-faixa{background:#fff;color:var(--abyss);border-top:1px solid var(--border)}
.od-faixa__in{max-width:80rem;margin:0 auto;padding:48px 20px 36px;display:grid;grid-template-columns:auto 1fr;gap:32px 56px;align-items:start}
.od-rotulo{margin:0 0 18px;font-family:var(--font-display);font-size:.8rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--lagoon-deep)}
.od-logos{display:flex;flex-wrap:wrap;align-items:center;gap:22px 28px}
.od-logos img{width:calc(var(--w)*1px);height:calc(var(--h)*1px)}
.od-onda{color:#fff}
@media (max-width:900px){.od-faixa__in{grid-template-columns:1fr}}
@media (max-width:640px){.od-eventos img{width:calc(var(--w)*.68px);height:calc(var(--h)*.68px)}.od-logos{gap:18px 26px}.od-logos img{width:calc(var(--w)*.8px);height:calc(var(--h)*.8px)}}
`;

async function main() {
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(`${OUT}/assets`, { recursive: true });

  let html = (await get("/")).toString("utf8");

  // Assets do build (hash no nome): os do HTML + imports relativos dentro dos JS
  const queue = [...new Set(html.match(/\/assets\/[\w.-]+\.(?:js|css)/g))];
  const files = new Map();
  while (queue.length) {
    const path = queue.shift();
    if (files.has(path)) continue;
    const body = (await get(path)).toString("utf8");
    files.set(path, body);
    if (path.endsWith(".js")) {
      for (const [, rel] of body.matchAll(/["'`]\.\/([\w.-]+\.(?:js|css))["'`]/g)) queue.push(`/assets/${rel}`);
    }
  }
  console.log("assets:", [...files.keys()].join(", "));

  const heroRemote = html.match(/\/__l5e\/assets-v1\/[\w-]+\/hero-reef\.jpg/)?.[0];
  if (!heroRemote) throw new Error("foto do topo (hero-reef.jpg) não encontrada no HTML");
  const hero = existsSync(HERO_ORIGINAL)
    ? await sharp(HERO_ORIGINAL).rotate().resize({ width: 2560, withoutEnlargement: true }).jpeg({ quality: 80, progressive: true, mozjpeg: true }).toBuffer()
    : await get(heroRemote);
  writeFileSync(`${OUT}/assets/hero-reef.jpg`, hero);
  console.log(`hero-reef.jpg: ${(hero.length / 1024).toFixed(0)} KB (${existsSync(HERO_ORIGINAL) ? "original em alta" : "versão do Lovable"})`);

  // --- HTML -----------------------------------------------------------------
  // Sem selo/analytics do Lovable
  html = html.replace(/<script[^>]*src="\/~flock\.js"[^>]*><\/script>/, "");
  html = html.replace(/<script[^>]*src="\/__l5e\/events\.[\w.]+\.js"[^>]*><\/script>/, "");
  html = html.replace(/<style>\s*#lovable-badge[\s\S]*?<\/style>/, "");
  html = html.replace(/<aside\s+id="lovable-badge"[\s\S]*?<\/aside>/, "");
  html = html.replace(/<script>(?:(?!<\/script>)[\s\S])*lovable-badge[\s\S]*?<\/script>/, "");
  if (html.includes("lovable-badge") || html.includes("flock.js")) throw new Error("sobrou selo/analytics do Lovable no HTML");

  html = html.split(heroRemote).join(`${BASE}/assets/hero-reef.jpg`);
  html = html.split('"/assets/').join(`"${BASE}/assets/`);
  // Fontes do Google → mesmas fontes auto-hospedadas do site (font-src 'self')
  html = html.replace(/href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]+"/, 'href="/assets/css/fonts.css"');

  // Logos em webp: Coalizão EN (branca e colorida), evento e Lead Partners
  writeFileSync(`${OUT}/assets/logo-coalizao-en-branca.webp`, await logoWebp("coalizao-EN-branca", { width: 640 }));
  writeFileSync(`${OUT}/assets/logo-coalizao-en.webp`, await logoWebp("coalizao-EN-cores", { width: 680 }));
  const m = {};
  for (const [n] of [...EVENTO, ...PARCEIROS]) {
    writeFileSync(`${OUT}/assets/${n}.webp`, await logoWebp(n, { height: 180, width: 560, fit: "inside" }));
    m[n] = await medidas(n, (EVENTO.some(([e]) => e === n) ? 7600 : 5600) * (AJUSTE_AREA[n] ?? 1), 64, 200);
  }
  const HERO_EVENTO = heroEvento(m);
  const FAIXA = faixa(m);

  // Logo provisória (emoji + nome em texto) → logo oficial EN branco (topo, hero, rodapé)
  // e colorido (seção "Hosted by")
  html = replaceExactly(html, "🪸 <!-- -->Coalizão Corais do Brasil",
    `<img src="${LOGO_NEG}" alt="${HOST_ALT}" class="coalizao-logo-neg"/>`, 3, "HTML: logo provisória");
  html = replaceOnce(html, '<div class="text-6xl" aria-hidden="true">🪸</div>',
    `<div class="text-6xl" aria-hidden="true"><img src="${LOGO}" alt="" class="coalizao-logo"/></div>`, "HTML: logo grande");

  // Logos do evento no hero (fim do bloco de conteúdo, depois da contagem regressiva)
  html = replaceOnce(html, '</div><p class="absolute bottom-3 right-4', `${toHtml(HERO_EVENTO)}</div><p class="absolute bottom-3 right-4`, "HTML: logos do evento no hero");
  // Faixa Official Special Event / Lead Partners no topo do rodapé (onda passa a ser branca)
  html = replaceOnce(html,
    '<footer class="bg-abyss pb-24 text-abyss-foreground md:pb-0"><svg aria-hidden="true" viewBox="0 0 1440 80" preserveAspectRatio="none" class="block h-12 w-full md:h-20 rotate-180 text-bleached">',
    `<footer class="bg-abyss pb-24 text-abyss-foreground md:pb-0">${toHtml(FAIXA)}<svg aria-hidden="true" viewBox="0 0 1440 80" preserveAspectRatio="none" class="block h-12 w-full md:h-20 rotate-180 od-onda">`,
    "HTML: faixa de parceiros");

  // "Last updated: [DATE]" (marcador não preenchido no Lovable) → data desta
  // importação, no formato de cada idioma ("8 Nov 2026" / "8 nov 2026", como o resto da página)
  const hoje = new Date();
  const dataEn = `${hoje.getDate()} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][hoje.getMonth()]} ${hoje.getFullYear()}`;
  const dataPt = `${hoje.getDate()} ${["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"][hoje.getMonth()]} ${hoje.getFullYear()}`;
  html = replaceExactly(html, "[DATE]", dataEn, 2, "HTML: Last updated");

  // --- JS / CSS ---------------------------------------------------------------
  for (const [path, original] of files) {
    let body = original;
    if (path.endsWith(".js")) {
      body = body.split(heroRemote).join(`${BASE}/assets/hero-reef.jpg`);
      body = body.split('"/assets/').join(`"${BASE}/assets/`).split("`/assets/").join(`\`${BASE}/assets/`);
      body = body.replace(/https:\/\/fonts\.googleapis\.com\/css2\?[^"`']+/g, "/assets/css/fonts.css");
      if (body.includes("e.update({basepath:``")) {
        body = replaceOnce(body, "e.update({basepath:``", `e.update({basepath:\`${BASE}\``, "JS: basepath do roteador");
      }
      if (body.includes("🪸")) {
        const logo = `(0,k.jsx)(\`img\`,{src:\`${LOGO_NEG}\`,alt:\`${HOST_ALT}\`,className:\`coalizao-logo-neg\`})`;
        body = replaceExactly(body, "[`🪸 `,j.HOST_NAME]", `[${logo}]`, 3, "JS: logo provisória");
        body = replaceOnce(body, '"aria-hidden":!0,children:`🪸`}',
          `"aria-hidden":!0,children:(0,k.jsx)(\`img\`,{src:\`${LOGO}\`,alt:\`\`,className:\`coalizao-logo\`})}`, "JS: logo grande");
        if (body.includes("🪸")) throw new Error("JS: sobrou emoji de logo provisória");
        body = replaceOnce(body, "(0,k.jsx)(Jn,{})]}),(0,k.jsxs)(`p`,{className:`absolute bottom-3 right-4",
          `(0,k.jsx)(Jn,{}),${toJsx(HERO_EVENTO)}]}),(0,k.jsxs)(\`p\`,{className:\`absolute bottom-3 right-4`, "JS: logos do evento no hero");
        body = replaceOnce(body, "`footer`,{className:`bg-abyss pb-24 text-abyss-foreground md:pb-0`,children:[(0,k.jsx)(tn,{className:`text-bleached`,flip:!0}),",
          `\`footer\`,{className:\`bg-abyss pb-24 text-abyss-foreground md:pb-0\`,children:[${toJsx(FAIXA)},(0,k.jsx)(tn,{className:\`od-onda\`,flip:!0}),`, "JS: faixa de parceiros");
      }
      if (body.includes("LAST_UPDATED:`[DATE]`")) {
        body = replaceOnce(body, "updated:`Last updated`", `updated:\`Last updated\`,updatedDate:\`${dataEn}\``, "JS: data EN");
        body = replaceOnce(body, "updated:`Última atualização`", `updated:\`Última atualização\`,updatedDate:\`${dataPt}\``, "JS: data PT");
        body = replaceExactly(body, "[e.venue.updated,`: `,j.LAST_UPDATED", "[e.venue.updated,`: `,e.venue.updatedDate", 2, "JS: Last updated");
      }
    } else {
      body += THEME;
    }
    writeFileSync(`${OUT}${path}`, body);
  }
  if (![...files.values()].some((b) => b.includes("e.update({basepath:``"))) throw new Error("JS: basepath do roteador não encontrado");

  writeFileSync(`${OUT}/index.html`, html);

  // --- CSP do nginx para /oceandecade/ -----------------------------------------
  const hashes = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)]
    // O parser de HTML troca NUL por U+FFFD antes de o navegador calcular o hash
    // (o estado serializado do TanStack usa "__root__\0" como id).
    .map(([, code]) => `'sha256-${createHash("sha256").update(code.replaceAll("\u0000", "�")).digest("base64")}'`);
  const csp = `default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' ${hashes.join(" ")}; font-src 'self'; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'`;
  const confPath = `${ROOT}nginx.conf`;
  const conf = readFileSync(confPath, "utf8");
  const updated = conf.replace(/(# >>> oceandecade-csp[^\n]*\n)[\s\S]*?(\n\s*# <<< oceandecade-csp)/g,
    (_, a, b) => `${a}        add_header Content-Security-Policy "${csp}" always;${b}`);
  if (updated === conf && !conf.includes(csp)) throw new Error("nginx.conf: marcadores # >>> oceandecade-csp não encontrados");
  writeFileSync(confPath, updated);
  console.log(`ok: ${OUT}/index.html (${hashes.length} scripts embutidos com hash na CSP)`);
}

main().catch((err) => {
  console.error("ERRO:", err.message);
  process.exit(1);
});
