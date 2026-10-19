// Converte as imagens originais (pasta do Drive "Site Coalizão") em WebP
// otimizado para o site. Os originais NÃO ficam no repositório (~96 MB);
// rodar de novo só quando a arte mudar:
//   SRC=~/coralis-work/drive npm run assets
import sharp from "sharp";
import { mkdirSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const SRC = process.env.SRC ?? join(homedir(), "coralis-work/drive");
const PARTNERS = process.env.PARTNERS ?? join(homedir(), "coralis-work/partners");
const OUT = new URL("../site/assets/img/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const B = (bloco, file) => join(SRC, "BLOCOS", bloco, file);
const G = (stamp) => `Imagem do ChatGPT 17 de out. de 2026, ${stamp}.png`;

// [arquivo de saída, origem, largura máxima]
// v2 (briefing da Bloom, 2026-10-19): visual institucional/editorial. Saíram fotos
// geradas por IA, faixas ilustradas e ícones ilustrados. Ficam: logos, os dois
// ícones do hero aprovados no briefing, logos de parceiros e no máximo 3
// ilustrações em xilogravura, todas do BrandBook (brand/ilustracoes/).
const BRAND = (f) => new URL(`../brand/${f}`, import.meta.url).pathname;
const MANIFEST = [
  // Marca
  ["logo-pt", join(SRC, "LOGO PT EN/Logo PT transparente.png"), 640],
  ["logo-en", join(SRC, "LOGO PT EN/logo-EN-transparente.png"), 640],
  // Hero (aprovados no briefing: coral do eyebrow e ondas do "Alinhada à agenda")
  ["coral-eyebrow", B("Bloco 6 7 8/imagens bloco 6 7 8", G("11_25_18-1")), 120],
  ["tres-ondas", B("Bloco 1 e 2/imagens bloco 1 e 2", "Três Ondas Aqua Texturizadas.png"), 160],
  // Ícones do "Como atuamos" trazidos da v1 a pedido do Shawã (2026-10-19), exibidos a ~50px
  ["icone-comunidades", B("Bloco 4/imagens bloco 4", "icone01.png"), 120],
  ["icone-ciencia", B("Bloco 4/imagens bloco 4", "icone02.png"), 120],
  ["icone-articulacao", B("Bloco 4/imagens bloco 4", "icone03.png"), 120],
  ["icone-comunicacao", B("Bloco 4/imagens bloco 4", "icone04.png"), 120],
  ["icone-politicas", B("Bloco 4/imagens bloco 4", "icone05.png"), 120],
  // As 3 ilustrações (BrandBook V.03: p.51 Ícones e p.57 Selos)
  ["selo-rede-viva", BRAND("ilustracoes/selo-rede-viva.png"), 420],
  ["coral-xilogravura", BRAND("ilustracoes/coral-xilogravura.png"), 360],
  ["selo-vida-que-pulsa", BRAND("ilustracoes/selo-vida-que-pulsa.png"), 300],
  // Fotos reais (pasta "Imagens" do Drive enviada pelo Shawã em 2026-10-19; originais em
  // brand/fotos/, fora do git por tamanho). Cada uma sai em 2 larguras para o srcset.
  ...[
    ["foto-hero", "recife-coral-fogo_filipe-cadena.jpg"],
    ["foto-piscinas", "piscinas-naturais-apa-costa-dos-corais_barbara-pinheiro.jpg"],
    ["foto-viveiro", "viveiro-restauracao_filipe-cadena.jpg"],
    ["foto-cardume", "recife-cardume_filipe-cadena.jpg"],
  ].flatMap(([name, f]) => [[name, BRAND(`fotos/${f}`), 1920], [`${name}-960`, BRAND(`fotos/${f}`), 960]]),
  // Parceiros (logos oficiais baixados dos sites de cada organização)
  ["parceiro-fgb", join(PARTNERS, "fgb-logo2.png"), 346],
  ["parceiro-wwf", join(PARTNERS, "wwf-logo.png"), 186],
  ["parceiro-bloom", join(PARTNERS, "bloom-prancheta1.png"), 540],
];

// Faixas que encostam no bloco seguinte: a base precisa ser opaca. O trim às vezes
// deixa alguns px transparentes embaixo (pixel quase invisível perdido) → margem
// branca entre blocos. Corta a base até a primeira linha ≥99,5% opaca (alpha ≥250).
// praia-limpeza fica de fora: é uma cena com bordas irregulares, não uma faixa sólida
const SOLID_BOTTOM = new Set([]); // v2 não tem mais faixas de rodapé; mantido para artes futuras
async function cropTransparentBottom(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let bottom = info.height - 1;
  for (; bottom > info.height / 2; bottom--) {
    let transparent = 0;
    for (let x = 0; x < info.width; x++) if (data[(bottom * info.width + x) * 4 + 3] < 250) transparent++;
    if (transparent / info.width <= 0.005) break;
  }
  return sharp(buf).extract({ left: 0, top: 0, width: info.width, height: bottom + 1 }).png().toBuffer();
}

let total = 0;
for (const [name, src, width] of MANIFEST) {
  if (!existsSync(src)) {
    console.error(`FALTANDO: ${src}`);
    process.exitCode = 1;
    continue;
  }
  const out = join(OUT, `${name}.webp`);
  // As artes vêm com muita margem transparente em volta — recortar deixa o
  // posicionamento e o tamanho controlados só pelo CSS. Fotos (sem alpha) ficam como estão.
  const { hasAlpha } = await sharp(src).metadata();
  let base = hasAlpha ? await sharp(src).trim({ threshold: 1 }).png().toBuffer() : src;
  if (SOLID_BOTTOM.has(name)) base = await cropTransparentBottom(base);
  const info = await sharp(base)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: name.startsWith("foto-hero") ? 58 : name.startsWith("foto-") ? 74 : 86, effort: 6, alphaQuality: 90 })
    .toFile(out);
  total += info.size;
  console.log(`${name}.webp ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)} KB`);
}
console.log(`TOTAL ${(total / 1024 / 1024).toFixed(2)} MB em ${MANIFEST.length} imagens`);

// Ícones da aba / tela inicial a partir do símbolo oficial (brand/simbolo.png,
// enviado pelo Shawã em 2026-10-18 — fica no repo por ser pequeno).
const symbolSrc = new URL("../brand/simbolo.png", import.meta.url).pathname;
const symbol = sharp(await sharp(symbolSrc).trim({ threshold: 1 }).png().toBuffer());
const clear = { r: 0, g: 0, b: 0, alpha: 0 };
const icon = (size, background = clear, pad = 0) =>
  symbol.clone().resize(size - 2 * pad, size - 2 * pad, { fit: "contain", background: clear })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background }).flatten(background.alpha ? { background } : false).png();
for (const size of [16, 32, 48, 192, 512]) await icon(size).toFile(join(OUT, `favicon-${size}.png`));
// iOS não aceita transparência no ícone da tela inicial: fundo creme do site
await icon(180, { r: 247, g: 242, b: 231, alpha: 1 }, 14).toFile(join(OUT, "apple-touch-icon.png"));
// favicon.ico (PNG embutido em ICO: 16, 32 e 48 px) para navegadores que pedem /favicon.ico
const pngs = await Promise.all([16, 32, 48].map((n) => icon(n).toBuffer()));
const header = Buffer.alloc(6); header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(pngs.length, 4);
let offset = 6 + 16 * pngs.length;
const entries = pngs.map((buf, i) => {
  const n = [16, 32, 48][i]; const e = Buffer.alloc(16);
  e.writeUInt8(n, 0); e.writeUInt8(n, 1); e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
  e.writeUInt32LE(buf.length, 8); e.writeUInt32LE(offset, 12); offset += buf.length; return e;
});
writeFileSync(new URL("../site/favicon.ico", import.meta.url).pathname, Buffer.concat([header, ...entries, ...pngs]));
// Imagem de compartilhamento (Open Graph) 1200x630: o hero de referência
// Imagem de compartilhamento (Open Graph) 1200x630: logo sobre o creme da marca (v2, sem foto de IA)
for (const [lang, logoFile] of [["pt", "Logo PT transparente.png"], ["en", "logo-EN-transparente.png"]]) {
  const logoBuf = await sharp(join(SRC, "LOGO PT EN", logoFile)).trim({ threshold: 1 }).resize({ width: 820 }).png().toBuffer();
  const lm = await sharp(logoBuf).metadata();
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: { r: 247, g: 242, b: 231 } } })
    .composite([
      { input: logoBuf, left: Math.round((1200 - lm.width) / 2), top: Math.round((630 - lm.height) / 2) - 10 },
      { input: Buffer.from('<svg width="1200" height="12"><rect width="1200" height="12" fill="#FD6E5D"/></svg>'), left: 0, top: 618 },
    ])
    .jpeg({ quality: 86 }).toFile(join(OUT, `og-${lang}.jpg`));
}
// Marca d'água do hero: o símbolo oficial em branco (só a forma, sem cores)
{
  const { data, info } = await sharp(symbolSrc).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) { data[i] = data[i + 1] = data[i + 2] = 255; }
  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).trim({ threshold: 1 }).resize({ width: 900 }).webp({ quality: 88, alphaQuality: 90 }).toFile(join(OUT, "simbolo-branco.webp"));
}
console.log("favicons + og ok");
