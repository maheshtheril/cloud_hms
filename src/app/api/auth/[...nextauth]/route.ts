import { handlers } from "@/auth"
import { NextRequest } from "next/server"

export const GET = handlers.GET

// NextAuth strictly validates the Origin against AUTH_URL (usually set to seeakk.com on Vercel).
// This causes POST requests (like login) from cloud-hms to fail CSRF checks silently.
// We intercept the POST request to dynamically set the AUTH_URL to the requested host.
export const POST = async (req: NextRequest) => {
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") || "https";
    if (host) {
        process.env.AUTH_URL = `${proto}://${host}`;
        process.env.NEXTAUTH_URL = `${proto}://${host}`;
    }
    return handlers.POST(req);
}
