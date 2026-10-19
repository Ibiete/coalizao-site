# Coalizão Corais do Brasil — site (PT/EN)

Site institucional da **Coalizão Corais do Brasil / Brazilian Coral Reef Coalition**.
Propriedade da Bloom Ocean (Secretaria Executiva) — tenant `bloom` do NAIIAN ONE.

- Português: `/` · Inglês: `/en/` · Política de Privacidade: `/politica-de-privacidade/` e `/en/privacy-policy/`
- Estático (HTML/CSS/JS sem framework), servido por nginx na VPS compartilhada.
- Formulário de contato → **NAIIAN ONE › Formulários** (tenant Bloom, fonte `coalizao-site-contato`):
  cria o contato no CRM (lista "Coalizão Corais do Brasil — Site", tag `coalizao-site`),
  abre um follow-up e envia e-mail para `coalizaocoraisdobrasil@gmail.com`.
  Regras editáveis no painel (`/forms`), sem mexer no site.

## Estrutura

| Caminho | O quê |
|---|---|
| `content/pt.mjs`, `content/en.mjs` | **Todo o texto do site**, bloco a bloco (fonte: documentos "Escopo Completo" PT/EN no Drive) |
| `content/privacy.mjs` | Política de Privacidade PT/EN |
| `scripts/build.mjs` | Template único → gera `site/**/index.html` (PT e EN com a mesma estrutura) |
| `scripts/assets.mjs` | Converte logos, parceiros e as 3 xilogravuras (`brand/ilustracoes/`, recortadas do BrandBook V.03) em WebP → `site/assets/img/`; gera favicons e OG |
| `site/assets/css/style.css` | v2 "institucional com assinatura artesanal" (briefing Bloom, out/2026) + responsivo (1240 / 1024 / 760 px) |
| `site/assets/js/main.js` | Menu mobile e envio do formulário |
| `site/` | Resultado final (é o que vai para a imagem Docker) |

## Como alterar

```bash
npm install                 # só na primeira vez (instala o sharp)
# 1. editar textos em content/pt.mjs e content/en.mjs
npm run build               # regera site/**/index.html
# 2. (só se mudar imagens) baixar a pasta do Drive e:
SRC=~/caminho/da/pasta/do/drive npm run assets && npm run build
git commit -am "..." && git push   # CI publica ghcr.io/ibiete/coalizao-site:latest
```

Fotos reais (hero e 3 faixas com legenda/crédito): originais em `brand/fotos/` (fora do git, ~40 MB),
vindas da pasta "Imagens" do Drive da Coalizão (fotos de Filipe Cadena e Bárbara Pinheiro). Para trocar,
baixar o original para lá, ajustar o nome em `scripts/assets.mjs` e a legenda em `content/*.mjs` (`photos`).

PDFs para download (BrandBook, Guia de Comunicação...) **não ficam no git nem na imagem**: ficam em
`/docker/coalizao-site/docs/` na VPS (volume montado em `/docs/`). Para publicar um novo: copiar o PDF
para essa pasta e apontar o `href` do card/rodapé em `content/*.mjs`. PDF muito pesado: comprimir antes
(ex.: `gs -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook ...`).

Deploy na VPS (depois do CI verde):

```bash
ssh hostinger-vps "cd /docker/coalizao-site && docker compose pull && docker compose up -d"
```

## Versões

- `v1` (tag): versão ilustrada "Cordel de Corais", com as artes estáticas por bloco.
- v2 (atual): briefing da Amanda (Bloom) — clean/editorial, no máximo 3 xilogravuras do BrandBook,
  sem fotos de IA, Ações + Grupos de Trabalho em uma seção só.

## Pendências de conteúdo (ocultas no site até chegarem)

O template já esconde sozinho o que não está pronto — basta preencher em `content/*.mjs`:
- Comitê e organizações da rede: categorias só com itens `placeholder` não aparecem.
- Materiais: só documentos com `href` aparecem (hoje BrandBook e Guia de Comunicação).
- LinkedIn e YouTube: fora do contato até ter link. Vídeo institucional: em produção.
- "Resultados esperados": seção não renderizada (texto aguardando a Bloom).
- Fotos reais (com autorização de uso) podem entrar no lugar das ilustrações no futuro.
- Política de Privacidade: texto-base, precisa de revisão da Coalizão/Bloom.
