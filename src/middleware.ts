import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const url = new URL(req.url)
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-pathname', url.pathname)

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        }
    })
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
