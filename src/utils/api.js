const API = import.meta.env.VITE_API_URL || "/back-end";

const getHeaders = (extra={}) => {
  const tok = localStorage.getItem("auth_token");
  return {
    ...(extra || {}),
    ...(tok ? { Authorization: `Bearer ${tok}` } : {}),
  };
};

const asJson = async (res) => {
  if (!res.ok) {
    const txt = await res.text().catch(()=>"");
    throw new Error(`HTTP ${res.status} · ${txt.slice(0,200)}`);
  }
  return res.json();
};

export const Api = {
  list:   ()            => fetch(`${API}/get_propiedades.php`).then(asJson),
  get:    (id)          => fetch(`${API}/get_propiedad.php?id=${id}`).then(asJson),
  create: (payload)     => fetch(`${API}/crear_propiedad.php`, {method:"POST", headers:getHeaders({"Content-Type":"application/json"}), body:JSON.stringify(payload)}).then(asJson),
  update: (id,payload)  => fetch(`${API}/editar_propiedad.php?id=${id}`, {method:"POST", headers:getHeaders({"Content-Type":"application/json"}), body:JSON.stringify(payload)}).then(asJson),
  remove: (id)          => fetch(`${API}/eliminar_propiedad.php?id=${id}`, {method:"DELETE", headers:getHeaders()}).then(asJson),
};
