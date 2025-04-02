import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Vérifier si la route existe
  const url = request.nextUrl.clone()

  // Gérer les redirections si nécessaire
  if (url.pathname === "/home") {
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  // Continuer avec la requête normale
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

