// Importa a página do evento "Coral Reefs at the Frontline" (Ocean Decade Week
// 2027), feita no Lovable, para /oceandecade/ deste site.
//
//   node scripts/oceandecade.mjs            # baixa de novo e regera site/oceandecade/
//
// Conteúdo, ordem das seções e imagens ficam exatamente como no Lovable (o app
// é copiado inteiro: EN/PT, contadores, formulário por e-mail). O script só:
//   - serve o app sob /oceandecade/ (basepath do roteador + caminhos dos assets);
//   - troca a logo provisória (emoji 🪸) pelo símbolo/logo oficiais da Coalizão;
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

const SIMBOLO = "/assets/img/simbolo-coalizao.webp";
const LOGO = "/assets/img/logo-pt.webp";

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
.coalizao-simbolo{display:inline-block;width:1.6em;height:1.6em;margin-right:.45em;vertical-align:-.45em;object-fit:contain}
.coalizao-logo{display:block;margin:0 auto;width:min(340px,80%);height:auto;background:#f8f5ee;padding:18px 26px;border-radius:16px}
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

  // Logo provisória → símbolo oficial (topo, apresentação, rodapé) e logo completa (seção "Hosted by")
  const simboloHtml = `<img src="${SIMBOLO}" alt="" aria-hidden="true" class="coalizao-simbolo"/>`;
  html = replaceExactly(html, "🪸 <!-- -->", simboloHtml, 3, "HTML: logo provisória");
  html = replaceOnce(html, '<div class="text-6xl" aria-hidden="true">🪸</div>',
    `<div class="text-6xl" aria-hidden="true"><img src="${LOGO}" alt="" class="coalizao-logo"/></div>`, "HTML: logo grande");

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
        const img = `(0,k.jsx)(\`img\`,{src:\`${SIMBOLO}\`,alt:\`\`,"aria-hidden":!0,className:\`coalizao-simbolo\`})`;
        body = replaceExactly(body, "[`🪸 `,j.HOST_NAME]", `[${img},j.HOST_NAME]`, 3, "JS: logo provisória");
        body = replaceOnce(body, '"aria-hidden":!0,children:`🪸`}',
          `"aria-hidden":!0,children:(0,k.jsx)(\`img\`,{src:\`${LOGO}\`,alt:\`\`,className:\`coalizao-logo\`})}`, "JS: logo grande");
        if (body.includes("🪸")) throw new Error("JS: sobrou emoji de logo provisória");
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
