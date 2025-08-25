const BASE = import.meta.env.VITE_API_URL || "/back-end";

const TOKEN_KEY = "auth_token";
const USER_KEY  = "auth_user";

export const Auth = {
  getToken: () => localStorage.getItem(TOKEN_KEY) || "",
  setToken: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); },
  setUser: (u) => localStorage.setItem(USER_KEY, JSON.stringify(u)),
  getUser: () => { try { return JSON.parse(localStorage.getItem(USER_KEY)||""); } catch { return null; }},

  async login(email, password) {
    const res = await fetch(`${BASE}/auth_login.php`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    Auth.setToken(data.token);
    Auth.setUser(data.user);
    return data.user;
  },

  async me() {
    const tok = Auth.getToken();
    if (!tok) return null;
    const res = await fetch(`${BASE}/auth_me.php`, {
      headers: { Authorization: `Bearer ${tok}` }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  },

  async logout() {
    const tok = Auth.getToken();
    if (tok) {
      await fetch(`${BASE}/auth_logout.php`, { headers: { Authorization: `Bearer ${tok}` } }).catch(()=>{});
    }
    Auth.clear();
  }
};
