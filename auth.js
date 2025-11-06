(function () {
  const APP_PATH = window.APP_PATH || "/frete-avulso-front";
  const API_URL = window.API_URL || "http://127.0.0.1:5000";

  function goTo(path) {
    location.href = location.origin + APP_PATH + path;
  }

  function saveSession({ token, user }) {
    if (token) sessionStorage.setItem("token", token);
    if (user) sessionStorage.setItem("user", user);
  }

  function clearSession() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  }

  async function validateToken() {
    const token = sessionStorage.getItem("token");
    if (!token) return false;
    try {
      const r = await fetch(API_URL + "/auth/validate", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      return r.ok;
    } catch {
      return false;
    }
  }

  async function requireAuth() {
    const ok = await validateToken();
    if (!ok) {
      clearSession();
      goTo("/login");
      throw new Error("unauthorized");
    }
    return true;
  }

  async function callApi(path, options = {}, { autoRedirect401 = true } = {}) {
    const token = sessionStorage.getItem("token");
    const headers = Object.assign(
      {},
      { Authorization: `Bearer ${token}` },
      options.headers || {}
    );
    const hasBody = options.body != null;
    if (hasBody && !headers["content-type"]) {
      headers["content-type"] = "application/json";
    }
    const resp = await fetch(API_URL + path, { ...options, headers });
    if (resp.status === 401 && autoRedirect401) {
      clearSession();
      goTo("/login");
      throw new Error("401");
    }
    return resp;
  }

  function logout() {
    clearSession();
    goTo("/login");
  }

  window.__AUTH__ = {
    APP_PATH, API_URL, goTo, saveSession, clearSession,
    validateToken, requireAuth, callApi, logout
  };
})();