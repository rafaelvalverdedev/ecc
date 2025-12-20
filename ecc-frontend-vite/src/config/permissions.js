export const permissions = {
  admin: {
    dashboard: true,
    eventos: true,
    equipes: true,
    usuarios: true,
  },
  gerente: {
    dashboard: true,
    eventos: true,
    equipes: true,
    usuarios: false,
  },
  user: {
    dashboard: true,
    eventos: false,
    equipes: false,
    usuarios: false,
  },
}
