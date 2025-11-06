import { NextRequest, NextResponse } from "next/server";
import { getSpotifyClient } from "@/shared/lib/spotify/tokens";

/**
 * Универсальный поиск по Spotify
 * GET /api/search?q=query&type=track|artist|album|playlist|all&limit=20
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    let type = searchParams.get("type") || "all";
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!query) {
        return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Нормализация типа (убираем 's' в конце если есть)
    if (type === "tracks") type = "track";
    if (type === "artists") type = "artist";
    if (type === "albums") type = "album";
    if (type === "playlists") type = "playlist";

    try {
        const spotifyClient = await getSpotifyClient();

        if (!spotifyClient) {
            // Fallback - возвращаем пустой результат если нет токена
            return NextResponse.json({
                tracks: [],
                artists: [],
                albums: [],
                playlists: [],
            });
        }

        // Используем клиент с токеном пользователя
        const searchTypes: ("track" | "artist" | "album" | "playlist")[] =
            type === "all"
                ? ["track", "artist", "album", "playlist"]
                : [type as "track" | "artist" | "album" | "playlist"];

        const searchResults = await spotifyClient.search(query, searchTypes, limit);

        return NextResponse.json({
            tracks:
                searchResults.tracks?.items
                    .filter((t) => t && t.id)
                    .map((t) => ({
                        id: t.id,
                        title: t.name,
                        artist: t.artists.map((a) => a.name).join(", "),
                        artistId: t.artists[0]?.id,
                        album: t.album.name,
                        albumId: t.album.id,
                        coverUrl: t.album.images[0]?.url || "",
                        previewUrl: t.preview_url,
                        duration: t.duration_ms,
                    })) || [],
            artists:
                searchResults.artists?.items
                    .filter((a) => a && a.id)
                    .map((a) => ({
                        id: a.id,
                        name: a.name,
                        imageUrl: a.images[0]?.url || "",
                        genres: a.genres,
                        popularity: a.popularity,
                        followers: a.followers.total,
                    })) || [],
            albums:
                searchResults.albums?.items
                    .filter((a) => a && a.id)
                    .map((a) => ({
                        id: a.id,
                        name: a.name,
                        artist: a.artists.map((ar) => ar.name).join(", "),
                        artistId: a.artists[0]?.id,
                        imageUrl: a.images[0]?.url || "",
                        releaseDate: a.release_date,
                        totalTracks: a.total_tracks,
                    })) || [],
            playlists:
                searchResults.playlists?.items
                    .filter((p) => p && p.id)
                    .map((p) => ({
                        id: p.id,
                        name: p.name,
                        description: p.description,
                        imageUrl: p.images[0]?.url || "",
                        tracksCount: p.tracks.total,
                        owner: p.owner.display_name,
                    })) || [],
        });
    } catch (error) {
        console.error("Search error:", error);
        console.error("Error details:", error instanceof Error ? error.message : String(error));
        console.error("Stack:", error instanceof Error ? error.stack : "");
        return NextResponse.json(
            {
                error: "Failed to search",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

