// Middleware désactivé — la page /admin gère l'auth client-side avec son propre formulaire de login.
// Le cookie admin_session est vérifié via /api/admin/verify au chargement de la page.

export function middleware() {}

export const config = {
  matcher: [],
}
