// Same origin API on Render
const API_BASE = "";

export async function api(path, opts = {}) {
  const token = localStorage.getItem("pb_token");
  const headers = opts.headers || {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (opts.body && !(opts.body instanceof FormData) && typeof opts.body !== "string") {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(API_BASE + "/api" + path, {
    ...opts,
    headers,
    body:
      opts.body && typeof opts.body !== "string" && !(opts.body instanceof FormData)
        ? JSON.stringify(opts.body)
        : opts.body
  });
  let data = null;
  try { data = await res.json(); } catch {}
  if (!res.ok) throw (data || { error: "Request failed" });
  return data;
      }
