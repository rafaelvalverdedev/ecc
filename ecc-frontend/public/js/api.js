function api(url, options = {}) {
  const token = localStorage.getItem("token");

//    return fetch("http://127.0.0.1/3001" + url, {

  return fetch("https://ecc-backend-8i9l.onrender.com" + url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
      ...(options.headers || {})
    }
  });
}
