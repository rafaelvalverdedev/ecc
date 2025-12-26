const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3001"
    : "https://ecc-backend-8i9l.onrender.com";

function api(url, options = {}) {
  const token = localStorage.getItem("token");

  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {})
    }
  });
}
