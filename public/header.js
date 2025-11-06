(() => {
  const PATH = window.APP_PATH || "";
  const routes = [
    { href: `${PATH}/motorista`, icon: "bi-person-vcard", label: "Motoristas" },
    { href: `${PATH}/veiculos`, icon: "bi-truck", label: "Veículos" },
    { href: `${PATH}/dashboards`, icon: "bi-graph-up", label: "Dashboards" }
  ];

  function getDisplayName() {
    try { if (window.__AUTH__?.getProfile) { const p = window.__AUTH__.getProfile(); if (p?.name) return String(p.name); } } catch { }
    return sessionStorage.getItem("displayName")
      || sessionStorage.getItem("nome")
      || sessionStorage.getItem("email")
      || sessionStorage.getItem("user")
      || "Usuário";
  }
  function initials(str) {
    const s = String(str || "").trim();
    if (!s) return "US";
    const t = s.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ0-9 ]+/g, " ").split(/\s+/).filter(Boolean);
    const a = (t[0] || "U")[0], b = (t[1] || t[0] || "S")[0];
    return (a + b).toUpperCase();
  }

  const header = document.createElement("header");
  header.className = "app-header";
  header.setAttribute("role", "banner");
  header.innerHTML = `
    <div class="nav-wrap">
      <a href="${PATH}/viagens" class="brand text-decoration-none">
        <span class="logo-badge" aria-hidden="true"><i class="bi-signpost-2"></i></span>
        <span class="text-body">Gestão de viagens</span>
      </a>

      <nav class="nav" aria-label="Navegação principal" role="menubar">
        ${routes.map(r => `
          <a class="ghost-btn" role="menuitem" href="${r.href}">
            <i class="bi ${r.icon}" aria-hidden="true"></i>
            <span class="txt">${r.label}</span>
          </a>
        `).join("")}
      </nav>

      <div class="actions" id="user-actions" style="position:relative">
        <button id="user-avatar" class="user-avatar" type="button" aria-haspopup="menu" aria-expanded="false" title="${getDisplayName()}">
          ${initials(getDisplayName())}
        </button>

        <div id="user-menu" class="user-menu" role="menu" aria-label="Menu do usuário">
          <button class="item" role="menuitem" id="menu-theme" type="button">
            <i id="menu-theme-icon" class="bi" aria-hidden="true"></i>
            <span id="menu-theme-text"></span>
          </button>
          <a class="item" role="menuitem" href="${PATH}/usuarios">
            <i class="bi bi-people"></i><span>Gerenciar usuários</span>
          </a>
          <hr class="sep" />
          <button class="item danger" role="menuitem" id="menu-logout" type="button">
            <i class="bi bi-box-arrow-right"></i><span>Sair</span>
          </button>
        </div>
      </div>
    </div>
  `;

  const anchor = document.getElementById("app-header") || document.body;
  (anchor.id ? anchor : document.body).prepend(header);

  function setThemeFromStorage() {
    const isDark = sessionStorage.getItem("darktheme") === "true";
    document.body.setAttribute("data-bs-theme", isDark ? "dark" : "light");
    const ico = document.getElementById("menu-theme-icon");
    const txt = document.getElementById("menu-theme-text");
    if (ico && txt) {
      if (isDark) { ico.className = "bi bi-brightness-high"; txt.textContent = "Tema claro"; }
      else { ico.className = "bi bi-moon-stars"; txt.textContent = "Tema escuro"; }
    }
  }
  setThemeFromStorage();

  const here = location.pathname.replace(/\/+$/, "");
  document.querySelectorAll(".app-header .ghost-btn").forEach(a => {
    const href = a.getAttribute("href")?.replace(/\/+$/, "");
    if (href && here === href) a.classList.add("is-active");
  });

  const btnAvatar = document.getElementById("user-avatar");
  const menu = document.getElementById("user-menu");
  function closeMenu() { menu.classList.remove("show"); btnAvatar.setAttribute("aria-expanded", "false"); }
  function openMenu() { menu.classList.add("show"); btnAvatar.setAttribute("aria-expanded", "true"); }
  btnAvatar?.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.contains("show") ? closeMenu() : openMenu();
  });
  document.addEventListener("click", (e) => { if (!menu.contains(e.target) && e.target !== btnAvatar) closeMenu(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  document.getElementById("menu-theme")?.addEventListener("click", () => {
    const now = !(sessionStorage.getItem("darktheme") === "true");
    sessionStorage.setItem("darktheme", String(now));
    setThemeFromStorage();
  });

  document.getElementById("menu-logout")?.addEventListener("click", () => {
    if (window.__AUTH__?.logout) window.__AUTH__.logout();
  });

  const onScroll = () => { if (window.scrollY > 4) header.classList.add("is-scrolled"); else header.classList.remove("is-scrolled"); };
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

  document.documentElement.style.setProperty("--app-header-h", getComputedStyle(header).height || "64px");
})();