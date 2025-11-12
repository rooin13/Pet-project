import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Spotify OAuth Callback
 * Обменивает authorization code на access/refresh токены
 * GET /api/spotify/callback?code=xxx&state=xxx
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
        console.error("❌ Spotify authorization error:", error);
        return NextResponse.redirect(
            new URL(`/?error=${error}`, request.url)
        );
    }

    if (!code) {
        console.error("❌ No authorization code received");
        return NextResponse.redirect(
            new URL("/?error=no_code", request.url)
        );
    }

    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
    const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!;

    try {
        const tokenResponse = await fetch(
            "https://accounts.spotify.com/api/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${Buffer.from(
                        `${clientId}:${clientSecret}`
                    ).toString("base64")}`,
                },
                body: new URLSearchParams({
                    grant_type: "authorization_code",
                    code,
                    redirect_uri: redirectUri,
                }),
            }
        );

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json();
            console.error("❌ Token exchange failed:", errorData);
            throw new Error("Failed to exchange code for tokens");
        }

        const tokens = await tokenResponse.json();

        const supabase = await createClient();
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error("❌ User not authenticated:", userError);
            return NextResponse.redirect(
                new URL("/?error=not_authenticated", request.url)
            );
        }

        const { error: deleteError } = await supabase
            .from("spotify_tokens")
            .delete()
            .eq("user_id", user.id);

        if (deleteError) {
            console.error("⚠️ Failed to delete old tokens:", deleteError);
        }

        const expiresAt = new Date(
            Date.now() + tokens.expires_in * 1000
        ).toISOString();

        const { error: dbError } = await supabase
            .from("spotify_tokens")
            .insert({
                user_id: user.id,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                expires_at: expiresAt,
                scope: tokens.scope,
            });

        if (dbError) {
            console.error("❌ Failed to save tokens to database:", dbError);
            return NextResponse.redirect(
                new URL("/?error=db_error", request.url)
            );
        }

        return NextResponse.redirect(
            new URL("/?spotify_connected=true", request.url)
        );
    } catch (error) {
        console.error("❌ Spotify callback error:", error);
        return NextResponse.redirect(
            new URL("/?error=callback_failed", request.url)
        );
    }
}

