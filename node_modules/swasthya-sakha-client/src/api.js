
let baseUri = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
if (baseUri && !baseUri.endsWith("/api")) {
  baseUri = `${baseUri}/api`;
}

const API = baseUri;
// const API = "https://reanalyze-levitator-foothill.ngrok-free.dev/api"

export async function api(path, options = {}) {
  const auth = JSON.parse(localStorage.getItem("ss_auth") || "null");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  
  if (auth?.token) headers.Authorization = `Bearer ${auth.token}`;
  
  const r = await fetch(`${API}${path}`, { ...options, headers });
  if (!r.ok)
    throw new Error(
      (await r.json().catch(() => ({}))).message ||
        `Request failed (${r.status})`,
    );
  return r.json();
}
export { API };
