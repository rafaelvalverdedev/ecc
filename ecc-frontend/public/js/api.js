const API_BASE_URL = "https://ecc-backend-8i9l.onrender.com";

function api(url, options = {}) {
  const token = localStorage.getItem("token");

  return fetch(`${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {})
    }
  }).then(async response => {
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API Error ${response.status}: ${errorBody}`);
    }
    return response;
  });
}
