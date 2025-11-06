import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";

/**
 * Spotify OAuth Callback
 * Обменивает authorization code на access/refresh токены
 * GET /api/spotify/callback?code=xxx&state=xxx
 */
export async function GET(request: NextRequest) {
    console.log("🎵 SPOTIFY CALLBACK RECEIVED");
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    console.log("📋 Callback params:", { code: code?.substring(0, 20) + "...", error });

    // Обработка ошибок от Spotify
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

    console.log("🔑 Exchanging code for tokens...");
    console.log("📍 Redirect URI:", redirectUri);

    try {
        // Обмен code на токены
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
        console.log("✅ Tokens received");
        console.log("📋 Token scopes:", tokens.scope);
        console.log("🔑 Access token (first 50 chars):", tokens.access_token?.substring(0, 50) + "...");
        console.log("📝 Token expires_in:", tokens.expires_in, "seconds");

        // Получаем текущего пользователя Supabase
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

        console.log("👤 User authenticated:", user.id);
        console.log("💾 Saving Spotify tokens to database...");

        // Сначала удаляем старые токены (если есть)
        const { error: deleteError } = await supabase
            .from("spotify_tokens")
            .delete()
            .eq("user_id", user.id);

        if (deleteError) {
            console.error("⚠️ Failed to delete old tokens:", deleteError);
        } else {
            console.log("🗑️ Old tokens deleted");
        }

        // Сохраняем новые токены
        const expiresAt = new Date(
            Date.now() + tokens.expires_in * 1000
        ).toISOString();

        console.log("💾 Inserting new tokens with scope:", tokens.scope);

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

        console.log("✅ Spotify tokens saved successfully!");
        console.log("🎉 SPOTIFY CONNECTION COMPLETE");

        // Редирект на главную с успехом
        return NextResponse.redirect(
            new URL("/?spotify_connected=true", request.url)
        );
    } catch (error) {
        console.error("❌ Spotify callback error:", error);
        console.error("Error details:", error instanceof Error ? error.message : String(error));
        return NextResponse.redirect(
            new URL("/?error=callback_failed", request.url)
        );
    }
}

