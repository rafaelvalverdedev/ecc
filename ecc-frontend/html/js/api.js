function api(url, options = {}) {
  const token = localStorage.getItem("token");

  return fetch("http://localhost:3001" + url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
      ...(options.headers || {})
    }
  });
}
