// spotify api configuration
export const SPOTIFY_CONFIG = {
    clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
};

// spotify api types
export type SpotifyTrack = {
    id: string;
    name: string;
    artists: Array<{ name: string }>;
    album: {
        name: string;
        images: Array<{ url: string }>;
    };
    duration_ms: number;
    preview_url: string | null;
};

export type SpotifySearchResponse = {
    tracks: {
        items: SpotifyTrack[];
    };
};

// get spotify access token using client credentials
export async function getSpotifyAccessToken(): Promise<string> {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
                "Basic " +
                Buffer.from(
                    SPOTIFY_CONFIG.clientId + ":" + SPOTIFY_CONFIG.clientSecret
                ).toString("base64"),
        },
        body: "grant_type=client_credentials",
    });

    if (!response.ok) {
        throw new Error("Failed to get Spotify access token");
    }

    const data = await response.json();
    return data.access_token;
}

// search tracks on spotify
export async function searchSpotifyTracks(
    query: string,
    accessToken: string,
    limit: number = 10
): Promise<SpotifyTrack[]> {
    const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to search Spotify tracks");
    }

    const data: SpotifySearchResponse = await response.json();
    return data.tracks.items;
}

// Note: getUserLikedTracks removed - we use Supabase database instead
// User's liked tracks are stored in liked_tracks table

// search tracks by genre and mood
export async function searchByGenre(
    genre: string,
    accessToken: string,
    limit: number = 20
): Promise<SpotifyTrack[]> {
    const query = `genre:${genre}`;
    return searchSpotifyTracks(query, accessToken, limit);
}

