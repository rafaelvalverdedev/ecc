// ======================================
// Autenticação
// ======================================

function requireAuth() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    window.location.href = `/auth`;
  }
  return user;
}

// ====================================
// Logout
// ====================================
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("eventoId");

  window.location.href = `/auth`;
}

// ====================================
// Controle de Acesso por Perfil
// ====================================
function requireRole(rolesPermitidos = []) {
  const user = requireAuth();

  if (!rolesPermitidos.includes(user.role)) {
    // página de acesso negado ou redirecionamento
    window.location.href = "/403.html";
  }
  return user;
}