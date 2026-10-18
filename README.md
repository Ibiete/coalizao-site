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
| `scripts/assets.mjs` | Converte as artes originais (Drive) em WebP otimizado → `site/assets/img/` |
| `site/assets/css/style.css` | Estilo "Cordel de Corais" + responsivo (1240 / 1024 / 760 / 420 px) |
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

Deploy na VPS (depois do CI verde):

```bash
ssh hostinger-vps "cd /docker/coalizao-site && docker compose pull && docker compose up -d"
```

## Pendências de conteúdo (marcadas no próprio site)

- Comitê Estratégico-Deliberativo e organizações da rede: logos "a confirmar".
- Materiais e downloads: PDFs, tamanhos, versões e datas ainda não fornecidos (botões ficam em estado "em preparação").
- LinkedIn e YouTube: links "a confirmar". Vídeo institucional: em produção.
- Política de Privacidade: texto-base, precisa de revisão da Coalizão/Bloom.
