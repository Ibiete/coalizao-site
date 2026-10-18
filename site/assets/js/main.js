// Coalizão Corais do Brasil — interações do site (sem dependências)
(() => {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");

  // Sombra no cabeçalho fixo depois de rolar
  const onScroll = () => header?.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Menu do celular
  const setMenu = (open) => {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".sr-only").textContent = open ? toggle.dataset.labelClose : toggle.dataset.labelOpen;
    menu.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle?.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  // Com o menu aberto a página fica travada (overflow hidden); se o navegador
  // pular para a âncora antes de destravar, a rolagem para no meio do caminho.
  // Então: fecha o menu, destrava e só depois rola até o destino.
  menu?.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;
    const url = new URL(link.href, location.href);
    const target = url.pathname === location.pathname && url.hash ? document.querySelector(url.hash) : null;
    setMenu(false);
    if (!target) return;
    e.preventDefault();
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      history.pushState(null, "", url.hash);
    });
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  window.matchMedia("(min-width: 1025px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

  // Vídeo institucional ainda em produção: o botão leva o foco para o aviso
  document.querySelectorAll("[data-video-soon]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const status = btn.parentElement.querySelector(".video-player__status");
      status?.animate([{ opacity: 0.4 }, { opacity: 1 }], { duration: 500 });
    });
  });

  // Formulário de contato → NAIIAN ONE (Formulários, tenant Bloom)
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;
  const status = form.querySelector(".contact-form__status");
  const button = form.querySelector('button[type="submit"]');
  const participation = form.querySelector('select[name="participation"]');

  // CTAs "Participe" pré-selecionam a opção "Participar da Rede de Impacto"
  document.querySelectorAll("[data-participation]").forEach((a) =>
    a.addEventListener("click", () => { if (participation) participation.selectedIndex = Number(a.dataset.participation) || 0; }),
  );

  const setStatus = (text, kind) => {
    status.textContent = text;
    status.classList.toggle("is-ok", kind === "ok");
    status.classList.toggle("is-error", kind === "error");
  };

  const validate = () => {
    let firstInvalid = null;
    form.querySelectorAll("[required]").forEach((el) => {
      const ok = el.type === "checkbox" ? el.checked : el.value.trim() !== "" && (el.type !== "email" || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value.trim()));
      const wrap = el.closest(".field, .check");
      wrap?.classList.toggle("is-invalid", !ok);
      el.setAttribute("aria-invalid", String(!ok));
      if (!ok && !firstInvalid) firstInvalid = el;
    });
    return firstInvalid;
  };

  form.addEventListener("input", (e) => {
    const wrap = e.target.closest(".is-invalid");
    if (wrap) { wrap.classList.remove("is-invalid"); e.target.setAttribute("aria-invalid", "false"); }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const invalid = validate();
    if (invalid) {
      setStatus(status.dataset.required, "error");
      invalid.focus();
      return;
    }
    // Honeypot: robôs preenchem o campo escondido — finge sucesso e não envia
    if (form.website.value) { setStatus(status.dataset.ok, "ok"); form.reset(); return; }

    const data = new FormData(form);
    const pt = form.dataset.lang !== "en";
    // Chaves legíveis: viram as linhas do e-mail e do histórico de submissões
    const payload = {
      name: data.get("name").trim(),
      email: data.get("email").trim(),
      [pt ? "Organização" : "Organization"]: data.get("organization").trim(),
      [pt ? "Setor" : "Sector"]: data.get("sector"),
      [pt ? "Como quer participar" : "How to participate"]: data.get("participation"),
      [pt ? "Grupos de Trabalho" : "Working Groups"]: data.getAll("workingGroups"),
      message: data.get("message").trim(),
      [pt ? "Consentimento LGPD" : "LGPD consent"]: true,
      [pt ? "Idioma" : "Language"]: pt ? "Português" : "English",
      [pt ? "Página" : "Page"]: location.href,
    };

    button.disabled = true;
    button.firstChild.textContent = `${button.dataset.sending} `;
    setStatus("", null);
    try {
      const res = await fetch(form.dataset.endpoint, {
        method: "POST",
        // Sem x-submission-id: o CORS do NAIIAN ONE não libera esse cabeçalho
        // (o botão já fica desabilitado durante o envio, evitando duplicidade).
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.reset();
      setStatus(status.dataset.ok, "ok");
    } catch (err) {
      console.error("Falha no envio do formulário:", err);
      setStatus(status.dataset.error, "error");
    } finally {
      button.disabled = false;
      button.firstChild.textContent = `${button.dataset.label} `;
    }
  });
})();
