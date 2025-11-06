/**
 * Spotify Token Management
 * Получение и обновление access токенов
 */

import { createClient } from "@/shared/lib/supabase/server";
import { SpotifyClient } from "./client";

/**
 * Получить валидный access token для пользователя
 * Автоматически обновляет если истек
 */
export async function getSpotifyAccessToken(
    userId?: string
): Promise<string | null> {
    console.log("🔑 getSpotifyAccessToken called for userId:", userId);
    const supabase = await createClient();

    // Если userId не передан, берем текущего пользователя
    let targetUserId = userId;
    if (!targetUserId) {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            console.log("❌ No user found");
            return null;
        }
        targetUserId = user.id;
    }

    console.log("📊 Fetching tokens from DB for user:", targetUserId);
    // Получаем токены из БД
    const { data: tokens, error } = await supabase
        .from("spotify_tokens")
        .select("*")
        .eq("user_id", targetUserId)
        .single();

    if (error) {
        console.log("❌ DB error fetching tokens:", error.message);
        return null;
    }

    if (!tokens) {
        console.log("⚠️ No tokens found in DB");
        return null;
    }

    console.log("✅ Tokens found, expires_at:", tokens.expires_at);
    console.log("📋 Token scope from DB:", tokens.scope);

    // Проверяем истек ли токен (с запасом 5 минут)
    const expiresAt = new Date(tokens.expires_at);
    const now = new Date();
    const fiveMinutes = 5 * 60 * 1000;

    const timeUntilExpiry = expiresAt.getTime() - now.getTime();
    console.log("⏰ Time until expiry (ms):", timeUntilExpiry);

    if (timeUntilExpiry > fiveMinutes) {
        // Токен еще валиден
        console.log("✅ Token is valid, returning access_token");
        console.log("🔑 Returning token (first 50 chars):", tokens.access_token?.substring(0, 50) + "...");
        return tokens.access_token;
    }

    console.log("🔄 Token expired, refreshing...");
    // Токен истек, обновляем
    if (tokens.refresh_token) {
        return await refreshSpotifyToken(targetUserId, tokens.refresh_token);
    }
    console.log("❌ No refresh_token available");
    return null;
}

/**
 * Обновить access token используя refresh token
 */
async function refreshSpotifyToken(
    userId: string,
    refreshToken: string
): Promise<string | null> {
    console.log("🔄 refreshSpotifyToken called for user:", userId);
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

    try {
        console.log("📡 Requesting new token from Spotify...");
        const response = await fetch(
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
                    grant_type: "refresh_token",
                    refresh_token: refreshToken,
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Spotify refresh failed:", response.status, errorText);
            throw new Error("Failed to refresh token");
        }

        const tokens = await response.json();
        console.log("✅ New token received from Spotify");

        // Обновляем токены в БД
        const expiresAt = new Date(
            Date.now() + tokens.expires_in * 1000
        ).toISOString();

        console.log("💾 Updating tokens in DB...");
        const supabase = await createClient();
        const { error } = await supabase
            .from("spotify_tokens")
            .update({
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token || refreshToken,
                expires_at: expiresAt,
            })
            .eq("user_id", userId);

        if (error) {
            console.error("❌ DB update error:", error);
            throw error;
        }

        console.log("✅ Tokens updated in DB successfully");
        return tokens.access_token;
    } catch (error) {
        console.error("❌ Failed to refresh Spotify token:", error);
        return null;
    }
}

/**
 * Получить SpotifyClient для пользователя
 */
export async function getSpotifyClient(
    userId?: string
): Promise<SpotifyClient | null> {
    const accessToken = await getSpotifyAccessToken(userId);
    if (!accessToken) return null;

    return new SpotifyClient(accessToken);
}

/**
 * Проверить подключен ли Spotify у пользователя
 */
export async function isSpotifyConnected(userId?: string): Promise<boolean> {
    const supabase = await createClient();

    let targetUserId = userId;
    if (!targetUserId) {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return false;
        targetUserId = user.id;
    }

    const { data, error } = await supabase
        .from("spotify_tokens")
        .select("id")
        .eq("user_id", targetUserId)
        .single();

    return !error && !!data;
}

/**
 * Отключить Spotify (удалить токены)
 */
export async function disconnectSpotify(userId?: string): Promise<boolean> {
    const supabase = await createClient();

    let targetUserId = userId;
    if (!targetUserId) {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return false;
        targetUserId = user.id;
    }

    const { error } = await supabase
        .from("spotify_tokens")
        .delete()
        .eq("user_id", targetUserId);

    return !error;
}

