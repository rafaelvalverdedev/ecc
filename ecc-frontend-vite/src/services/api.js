const API_BASE = import.meta.env.VITE_API_BASE_URL;

function getHeaders(isJson = true) {
  const headers = {};

  const token = localStorage.getItem("token");
  if (token) {
    headers.Authorization = "Bearer " + token;
  }

  if (isJson) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

async function handleResponse(res) {
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw json;
  }

  return json.data ?? json;
}

export async function apiGet(path) {
  const res = await fetch(API_BASE + path, {
    headers: getHeaders(false)
  });
  return handleResponse(res);
}

export async function apiPost(path, body) {
  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(body)
  });
  return handleResponse(res);
}

export async function apiPut(path, body) {
  const res = await fetch(API_BASE + path, {
    method: "PUT",
    headers: getHeaders(true),
    body: JSON.stringify(body)
  });
  return handleResponse(res);
}

export async function apiDelete(path) {
  const res = await fetch(API_BASE + path, {
    method: "DELETE",
    headers: getHeaders(false)
  });
  return handleResponse(res);
}
