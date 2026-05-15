import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {

  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },

        setAll(cookiesToSet) {

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })

        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  const authPages = ["/login", "/register"]

  const protectedRoutes = [
    "/dashboard",
    "/profile",
    "/learn",
    "/game",
    "/courses",
  ]

  // belum login
  if (
    !user &&
    protectedRoutes.some(route => pathname.startsWith(route))
  ) {

    return NextResponse.redirect(new URL("/login", request.url))
  }

  // sudah login
  if (
    user &&
    authPages.includes(pathname)
  ) {

    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return response
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/learn/:path*",
    "/game/:path*",
    "/courses/:path*",
    "/login",
    "/register",
  ],
}