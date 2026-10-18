// Política de Privacidade — descreve o que o site realmente faz (formulário
// de contato → CRM da Secretaria Executiva + e-mail; sem cookies de
// rastreamento). Texto-base para revisão da Coalizão/Bloom Ocean.
const email = '<a href="mailto:coalizaocoraisdobrasil@gmail.com">coalizaocoraisdobrasil@gmail.com</a>';

export default {
  pt: {
    path: "/politica-de-privacidade/",
    altPath: "/en/privacy-policy/",
    title: "Política de Privacidade — Coalizão Corais do Brasil",
    description: "Como a Coalizão Corais do Brasil trata os dados pessoais enviados pelo formulário de contato do site.",
    eyebrow: "Privacidade",
    h1: "Política de Privacidade",
    updated: "Última atualização: outubro de 2026.",
    back: "← Voltar para o site",
    sections: [
      { h: "1. Quem somos", body: `<p>A Coalizão Corais do Brasil é uma iniciativa da sociedade civil brasileira, idealizada pela Fundação Grupo Boticário e pelo WWF-Brasil, com Secretaria Executiva exercida pela Bloom Ocean. Esta política explica como tratamos os dados pessoais enviados por meio deste site, em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD).</p>` },
      { h: "2. Quais dados coletamos", body: `<p>Coletamos apenas os dados que você informa voluntariamente no formulário de contato: nome, e-mail, organização (opcional), setor, forma de participação, Grupos de Trabalho de interesse e a mensagem. Não coletamos dados sensíveis e pedimos que você não os inclua na mensagem.</p><p>Este site não utiliza cookies de rastreamento, publicidade ou análise de comportamento. As fontes e imagens são servidas pelo próprio site.</p>` },
      { h: "3. Para que usamos os dados", body: `<ul><li>Responder à sua mensagem e manter contato sobre o assunto que você indicou;</li><li>Avaliar e acompanhar manifestações de interesse em participar da Rede de Impacto e dos Grupos de Trabalho;</li><li>Organizar o relacionamento institucional da Coalizão com organizações e pessoas interessadas.</li></ul><p>A base legal é o seu consentimento (art. 7º, I, da LGPD), registrado no momento do envio do formulário.</p>` },
      { h: "4. Com quem compartilhamos", body: `<p>Os dados são recebidos pela Secretaria Executiva da Coalizão e armazenados em uma plataforma de gestão de relacionamento (CRM) operada sob contrato, com acesso restrito às pessoas responsáveis pelo atendimento. Uma cópia da mensagem é enviada por e-mail à Secretaria Executiva. Não vendemos nem cedemos seus dados a terceiros para fins comerciais.</p>` },
      { h: "5. Por quanto tempo guardamos", body: `<p>Mantemos os dados enquanto forem necessários para as finalidades acima ou até que você solicite a exclusão, salvo obrigação legal de guarda.</p>` },
      { h: "6. Seus direitos", body: `<p>Você pode, a qualquer momento, solicitar confirmação de tratamento, acesso, correção, anonimização, portabilidade ou exclusão dos seus dados, além de revogar o consentimento (art. 18 da LGPD), escrevendo para ${email}.</p>` },
      { h: "7. Ouvidoria", body: `<p>Denúncias, sugestões e reclamações sobre a Coalizão podem ser enviadas para <a href="mailto:ouvidoria@wwf.org.br">ouvidoria@wwf.org.br</a>.</p>` },
      { h: "8. Alterações desta política", body: `<p>Esta política pode ser atualizada para refletir mudanças no site ou na legislação. A data da última atualização fica indicada no topo desta página.</p>` },
    ],
  },
  en: {
    path: "/en/privacy-policy/",
    altPath: "/politica-de-privacidade/",
    title: "Privacy Policy — Brazilian Coral Reef Coalition",
    description: "How the Brazilian Coral Reef Coalition handles personal data submitted through the website contact form.",
    eyebrow: "Privacy",
    h1: "Privacy Policy",
    updated: "Last updated: October 2026.",
    back: "← Back to the website",
    sections: [
      { h: "1. Who we are", body: `<p>The Brazilian Coral Reef Coalition (Coalizão Corais do Brasil) is a Brazilian civil society initiative founded by Fundação Grupo Boticário and WWF-Brazil, with Bloom Ocean acting as Executive Secretariat. This policy explains how we handle personal data submitted through this website, in accordance with Brazil's General Data Protection Law (Law No. 13,709/2018 — LGPD).</p>` },
      { h: "2. What data we collect", body: `<p>We only collect the data you voluntarily provide in the contact form: name, email, organization (optional), sector, type of participation, Working Groups of interest and your message. We do not collect sensitive data and ask that you do not include it in your message.</p><p>This website does not use tracking, advertising or behavioral analytics cookies. Fonts and images are served by the website itself.</p>` },
      { h: "3. How we use the data", body: `<ul><li>To reply to your message and keep in touch about the subject you indicated;</li><li>To assess and follow up on expressions of interest in joining the Impact Network and the Working Groups;</li><li>To manage the Coalition's institutional relationships with interested organizations and people.</li></ul><p>The legal basis is your consent (Art. 7, I, LGPD), recorded when you submit the form.</p>` },
      { h: "4. Who we share it with", body: `<p>The data is received by the Coalition's Executive Secretariat and stored in a contracted customer relationship management (CRM) platform, with access restricted to the people responsible for responding. A copy of the message is sent by email to the Executive Secretariat. We do not sell or transfer your data to third parties for commercial purposes.</p>` },
      { h: "5. How long we keep it", body: `<p>We keep the data for as long as necessary for the purposes above or until you request its deletion, unless we are legally required to retain it.</p>` },
      { h: "6. Your rights", body: `<p>At any time, you may request confirmation of processing, access, correction, anonymization, portability or deletion of your data, and you may withdraw your consent (Art. 18, LGPD), by writing to ${email}.</p>` },
      { h: "7. Ombudsman", body: `<p>Reports, suggestions and complaints about the Coalition may be sent to <a href="mailto:ouvidoria@wwf.org.br">ouvidoria@wwf.org.br</a>.</p>` },
      { h: "8. Changes to this policy", body: `<p>This policy may be updated to reflect changes to the website or to the law. The date of the latest update is shown at the top of this page.</p>` },
    ],
  },
};
