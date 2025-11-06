import { NextResponse } from "next/server";

/**
 * Spotify OAuth - редирект на страницу авторизации
 * GET /api/spotify/auth
 */
export async function GET() {
    console.log("🎵 SPOTIFY AUTH REQUEST");
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

    console.log("📋 Config:", {
        clientId: clientId?.substring(0, 10) + "...",
        redirectUri,
    });

    if (!clientId || !redirectUri) {
        console.error("❌ Spotify credentials not configured");
        return NextResponse.json(
            { error: "Spotify credentials not configured" },
            { status: 500 }
        );
    }

    // Scopes - что мы хотим получить от Spotify
    const scopes = [
        "user-read-private", // Читать приватные данные пользователя (ТРЕБУЕТСЯ для Premium проверки)
        "user-read-email", // Получить email
        "user-library-read", // Читать лайкнутые треки
        "user-library-modify", // Лайкать/анлайкать
        "user-top-read", // Топ треки/артисты для AI
        "user-read-recently-played", // Недавно прослушанные
        "user-read-playback-position", // Позиция воспроизведения
        "playlist-read-private", // Читать приватные плейлисты
        "playlist-read-collaborative", // Коллаборативные плейлисты
        "playlist-modify-public", // Редактировать публичные плейлисты
        "playlist-modify-private", // Редактировать приватные плейлисты
        "streaming", // Воспроизведение полных треков (Web Playback SDK) - ТРЕБУЕТСЯ!
        "user-read-playback-state", // Читать состояние плеера - ТРЕБУЕТСЯ для SDK!
        "user-modify-playback-state", // Управлять воспроизведением - ТРЕБУЕТСЯ для SDK!
        "user-read-currently-playing", // Текущий трек
    ].join(" ");

    // State для защиты от CSRF
    const state = Math.random().toString(36).substring(7);

    const params = new URLSearchParams({
        client_id: clientId,
        response_type: "code",
        redirect_uri: redirectUri,
        scope: scopes,
        state,
        show_dialog: "true", // Всегда показывать диалог авторизации (для обновления scopes)
    });

    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${params}`;

    console.log("🔗 Redirecting to Spotify authorization...");
    console.log("📋 Requested scopes:", scopes);
    console.log("🎯 Redirect URL:", spotifyAuthUrl);

    return NextResponse.redirect(spotifyAuthUrl);
}

