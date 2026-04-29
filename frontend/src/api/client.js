const DEFAULT_API_URL = "https://voting-system-production-2a54.up.railway.app";
const configuredApiUrl = import.meta.env.VITE_API_URL;
const API_URL = configuredApiUrl && configuredApiUrl.startsWith("http")
  ? configuredApiUrl.replace(/\/$/, "")
  : DEFAULT_API_URL;

async function request(path, options = {}) {
  const token = localStorage.getItem("voting_token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${API_URL}${normalizedPath}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof body === "object" && body?.message ? body.message : "Request failed";
    throw new Error(message);
  }

  return body;
}

export const apiClient = {
  get: (path) => request(path),
  post: (path, data) => request(path, { method: "POST", body: JSON.stringify(data) }),
  put: (path, data) => request(path, { method: "PUT", body: JSON.stringify(data) }),
  patch: (path, data) => request(path, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (path) => request(path, { method: "DELETE" }),
};
