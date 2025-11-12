import createMiddleware from "next-intl/middleware";
import { locales } from "./i18n";
import { updateSession } from "./shared/lib/supabase/middleware";
import { type NextRequest } from "next/server";

const intlMiddleware = createMiddleware({
    locales,
    defaultLocale: "en",
    localePrefix: "as-needed",
});

export async function middleware(request: NextRequest) {
    // update supabase session
    const { supabaseResponse } = await updateSession(request);

    // handle i18n
    const response = intlMiddleware(request);

    // merge cookies from supabase
    supabaseResponse.cookies.getAll().forEach((cookie) => {
        response.cookies.set(cookie.name, cookie.value);
    });

    return response;
}

export const config = {
    matcher: [
        "/",
        "/(en|fr)/:path*",
        "/((?!api|auth|_next|_vercel|.*\\..*).*)",
    ],
};

