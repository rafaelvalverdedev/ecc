import { apiPost } from "./api";

export async function loginRequest(email, password) {
  return apiPost("/auth/login", {
    email,
    password
  });
}
