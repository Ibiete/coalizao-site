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
const MANIFEST = [
  // Marca
  ["logo-pt", join(SRC, "LOGO PT EN/Logo PT transparente.png"), 640],
  ["logo-en", join(SRC, "LOGO PT EN/logo-EN-transparente.png"), 640],
  // Blocos 1-2 — cabeçalho e hero
  ["divisor-ondulado", B("Bloco 1 e 2/imagens bloco 1 e 2", "Divisor Ondulado Azul e Marfim.png"), 2000],
  // v2 enviada pelo Shawã em 2026-10-18 (Drive 1-V1xwrA3tN2U1RQgjEk8wLbwyTZvDyOT), substitui a original
  ["hero-moldura", B("Bloco 1 e 2/imagens bloco 1 e 2", "Moldura Marinha em Aquarela v2.png"), 1448],
  ["tres-ondas", B("Bloco 1 e 2/imagens bloco 1 e 2", "Três Ondas Aqua Texturizadas.png"), 160],
  ["hero-fundo", B("Bloco 1 e 2/imagens bloco 1 e 2", "imagem de fundo.png"), 1448],
  // Bloco 3 — Quem somos
  ["coral-laranja", B("Bloco 3/imagens bloco 3", "Coral Ramificado em Laranja Vibrante.png"), 420],
  ["quem-somos-foto", B("Bloco 3/imagens bloco 3", "Restauração de Corais em Águas Tropicais.png"), 1000],
  ["rodape-oceanico", B("Bloco 3/imagens bloco 3", "Rodapé Oceânico com Coral Dourado.png"), 2000],
  // Bloco 4 — Como atuamos
  ["icone-comunidades", B("Bloco 4/imagens bloco 4", "icone01.png"), 300],
  ["icone-ciencia", B("Bloco 4/imagens bloco 4", "icone02.png"), 300],
  ["icone-articulacao", B("Bloco 4/imagens bloco 4", "icone03.png"), 300],
  ["icone-comunicacao", B("Bloco 4/imagens bloco 4", "icone04.png"), 300],
  ["icone-politicas", B("Bloco 4/imagens bloco 4", "icone05.png"), 300],
  // Bloco 5 — Recifes do Brasil
  ["recifes-colagem", B("Bloco 5/imagens bloco 5", "Colagem Tropical de Recife de Coral.png"), 1100],
  ["faixa-litoranea", B("Bloco 5/imagens bloco 5", "Faixa Tropical Litorânea Texturizada.png"), 2000],
  ["icone-biodiversidade", B("Bloco 5/imagens bloco 5", G("10_43_29")), 260],
  ["coral-grande", B("Bloco 5/imagens bloco 5", G("10_43_35")), 420],
  ["icone-seguranca-alimentar", B("Bloco 5/imagens bloco 5", G("10_43_40")), 260],
  ["icone-economia", B("Bloco 5/imagens bloco 5", G("10_43_45")), 260],
  ["icone-protecao-costeira", B("Bloco 5/imagens bloco 5", G("10_43_50")), 260],
  // Blocos 6-8 — números, você sabia, vídeo
  ["divisor-corda", B("Bloco 6 7 8/imagens bloco 6 7 8", "Divisor Náutico de Corda e Bolhas.png"), 2000],
  ["coral-eyebrow", B("Bloco 6 7 8/imagens bloco 6 7 8", G("11_25_18-1")), 120],
  ["icone-mapa-brasil", B("Bloco 6 7 8/imagens bloco 6 7 8", G("11_25_19-2")), 240],
  ["icone-corais", B("Bloco 6 7 8/imagens bloco 6 7 8", G("11_25_20-3")), 240],
  ["icone-escudo", B("Bloco 6 7 8/imagens bloco 6 7 8", G("11_25_20-4")), 240],
  ["icone-palmeira", B("Bloco 6 7 8/imagens bloco 6 7 8", G("11_25_21-5")), 240],
  ["icone-interrogacao", B("Bloco 6 7 8/imagens bloco 6 7 8", G("11_25_22-6")), 360],
  ["icone-concha", B("Bloco 6 7 8/imagens bloco 6 7 8", G("11_25_23-7")), 300],
  ["icone-play", B("Bloco 6 7 8/imagens bloco 6 7 8", G("11_25_24-8")), 220],
  ["ancora", B("Bloco 6 7 8/imagens bloco 6 7 8", G("11_25_25-9")), 300],
  ["veleiro-recife", B("Bloco 6 7 8/imagens bloco 6 7 8", "Veleiro tropical sobre recife de corais.png"), 900],
  // Blocos 9-10 — missão/valores
  ["ilha-aves", B("Bloco 9 e 10/imagens bloco 9 e 10", G("11_58_27")), 1100],
  ["divisor-onda-coral", B("Bloco 9 e 10/imagens bloco 9 e 10", G("11_58_34")), 2000],
  ["tartaruga", B("Bloco 9 e 10/imagens bloco 9 e 10", G("11_58_39")), 2000],
  // Bloco 11 — Nossas ações
  ["pescador-rede", B("Bloco 11/imagens bloco 11", G("20_41_29")), 700],
  ["icone-eixo-ameacas", B("Bloco 11/imagens bloco 11", G("20_41_41")), 280],
  ["icone-eixo-protecao", B("Bloco 11/imagens bloco 11", G("20_41_45")), 280],
  ["icone-eixo-restauracao", B("Bloco 11/imagens bloco 11", G("20_41_49")), 280],
  ["icone-eixo-investimentos", B("Bloco 11/imagens bloco 11", G("20_41_54")), 280],
  ["icone-eixo-monitoramento", B("Bloco 11/imagens bloco 11", G("20_41_59")), 280],
  ["recife-faixa-colorida", B("Bloco 11/imagens bloco 11", G("20_42_03")), 2000],
  // Bloco 12 — Grupos de trabalho
  ["gt-grupo-maos", B("Bloco 12/imagens bloco 12", G("20_39_30")), 800],
  ["gt1-ilustracao", B("Bloco 12/imagens bloco 12", G("20_39_42")), 520],
  ["gt2-ilustracao", B("Bloco 12/imagens bloco 12", G("20_39_47")), 520],
  ["gt3-ilustracao", B("Bloco 12/imagens bloco 12", G("20_39_52")), 520],
  ["gt4-ilustracao", B("Bloco 12/imagens bloco 12", G("20_39_56")), 520],
  ["gt5-ilustracao", B("Bloco 12/imagens bloco 12", G("20_40_00")), 520],
  ["praia-limpeza", B("Bloco 12/imagens bloco 12", G("20_40_05")), 2000],
  // Blocos 13-14 — governança/resultados
  ["pessoas-costao", B("Bloco 13 e 14/imagens bloco 13 e 14", G("20_36_13")), 1000],
  ["icone-resultado-recifes", B("Bloco 13 e 14/imagens bloco 13 e 14", G("20_36_43")), 200],
  ["icone-resultado-restauracao", B("Bloco 13 e 14/imagens bloco 13 e 14", G("20_36_49")), 200],
  ["icone-resultado-investimento", B("Bloco 13 e 14/imagens bloco 13 e 14", G("20_36_54")), 200],
  ["recife-faixa-baixa", B("Bloco 13 e 14/imagens bloco 13 e 14", G("20_36_59")), 2000],
  ["aves", B("Bloco 13 e 14/imagens bloco 13 e 14", G("20_37_05")), 600],
  ["passo-1", B("Bloco 13 e 14/imagens bloco 13 e 14", G("20_37_10")), 140],
  ["passo-2", B("Bloco 13 e 14/imagens bloco 13 e 14", G("20_37_21")), 140],
  ["passo-3", B("Bloco 13 e 14/imagens bloco 13 e 14", G("20_37_26")), 140],
  // Blocos 15-16 — rede/materiais
  ["barco-ilha", B("Bloco 15 e 16/imagens bloco 15 e 16", "01_barco_ilha_aves.png"), 900],
  ["documentos-corais", B("Bloco 15 e 16/imagens bloco 15 e 16", "02_documentos_com_corais.png"), 615],
  ["doc-governanca", B("Bloco 15 e 16/imagens bloco 15 e 16", "03_politica_governanca.png"), 120],
  ["doc-adesao", B("Bloco 15 e 16/imagens bloco 15 e 16", "04_termo_adesao.png"), 120],
  ["doc-brandbook", B("Bloco 15 e 16/imagens bloco 15 e 16", "05_brandbook.png"), 120],
  ["doc-guia", B("Bloco 15 e 16/imagens bloco 15 e 16", "06_guia_comunicacao.png"), 120],
  ["doc-oficina", B("Bloco 15 e 16/imagens bloco 15 e 16", "07_relatorio_oficina.png"), 120],
  ["doc-publicacao", B("Bloco 15 e 16/imagens bloco 15 e 16", "08_publicacao_oceano.png"), 120],
  ["doc-anual", B("Bloco 15 e 16/imagens bloco 15 e 16", "09_relatorio_anual.png"), 120],
  ["ornamento-esquerdo", B("Bloco 15 e 16/imagens bloco 15 e 16", "10_ornamento_coral_esquerdo.png"), 517],
  ["ornamento-centro", B("Bloco 15 e 16/imagens bloco 15 e 16", "11_ornamento_coral_centro.png"), 490],
  ["ornamento-direito", B("Bloco 15 e 16/imagens bloco 15 e 16", "12_ornamento_coral_direito.png"), 415],
  // Blocos 17-18 — contato/rodapé
  ["recife-contato", B("Bloco 17 e 18/imagens bloco 17 e 18", "01_recife_contato.png"), 1000],
  ["recife-rodape", B("Bloco 17 e 18/imagens bloco 17 e 18", "02_recife_rodape.png"), 900],
  ["cardume", B("Bloco 17 e 18/imagens bloco 17 e 18", "03_cardume_peixes.png"), 700],
  ["peixe-bolhas", B("Bloco 17 e 18/imagens bloco 17 e 18", "04_peixe_bolhas_rodape.png"), 400],
  ["ondas-divisoria", B("Bloco 17 e 18/imagens bloco 17 e 18", "05_ondas_divisoria.png"), 1600],
  ["bolhas", B("Bloco 17 e 18/imagens bloco 17 e 18", "06_bolhas_dagua.png"), 300],
  ["icone-email", B("Bloco 17 e 18/imagens bloco 17 e 18", "icone_email.png"), 96],
  ["icone-instagram", B("Bloco 17 e 18/imagens bloco 17 e 18", "icone_instagram.png"), 96],
  ["icone-linkedin", B("Bloco 17 e 18/imagens bloco 17 e 18", "icone_linkedin.png"), 96],
  ["icone-youtube", B("Bloco 17 e 18/imagens bloco 17 e 18", "icone_youtube.png"), 96],
  // Parceiros (logos oficiais baixados dos sites de cada organização)
  ["parceiro-fgb", join(PARTNERS, "fgb-logo2.png"), 346],
  ["parceiro-wwf", join(PARTNERS, "wwf-logo.png"), 186],
  ["parceiro-bloom", join(PARTNERS, "bloom-prancheta1.png"), 540],
];

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
  const base = hasAlpha ? await sharp(src).trim({ threshold: 1 }).png().toBuffer() : src;
  const info = await sharp(base)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: name.startsWith("hero-fundo") || name.includes("foto") || name.includes("colagem") || name.includes("veleiro") ? 80 : 86, effort: 6, alphaQuality: 90 })
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
await sharp(B("Bloco 1 e 2", "imagem completa bloco 1 e 2.png")).resize(1200, 630, { fit: "cover", position: "top" }).jpeg({ quality: 82 }).toFile(join(OUT, "og-pt.jpg"));
console.log("favicons + og ok");
