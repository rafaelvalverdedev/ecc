const PERMISSIONS = {
  admin: {
    viewAdmin: true,
    createUser: true,
    createEvent: true,
    editEvent: true,
    deleteEvent: true,
  },

  coordenador: {
    viewAdmin: false,
    createUser: false,
    createEvent: false,
    editEvent: false,
    deleteEvent: false,
  },

  user: {
    viewAdmin: false,
    createUser: false,
    createEvent: false,
    editEvent: false,
    deleteEvent: false,
  },
};


// ======================================
// 🔐 Autenticação
// ======================================

function requireAuth() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    window.location.href = `/auth`;
  }
}

// ====================================
// 🔓 Logout
// ====================================
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("eventoId");
  window.location.href = `/auth`;
}

function getCurrentUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

function hasPermission(permission) {
  const user = getCurrentUser();
  if (!user) return false;

  return PERMISSIONS[user.role]?.[permission] === true;
}


