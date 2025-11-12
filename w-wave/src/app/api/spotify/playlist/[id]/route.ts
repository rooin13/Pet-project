import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SpotifyPlaylistTrack = {
    id: string;
    name: string;
    preview_url: string | null;
    duration_ms: number;
    artists: { id: string; name: string }[];
    album: {
        id: string;
        name: string;
        images: { url: string }[];
    };
};

const ensureCredentials = () => {
    const clientId =
        process.env.SPOTIFY_CLIENT_ID ?? process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error("Missing Spotify credentials");
    }

    return { clientId, clientSecret };
};

const getAccessToken = async () => {
    const { clientId, clientSecret } = ensureCredentials();

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(
                `${clientId}:${clientSecret}`
            ).toString("base64")}`,
        },
        body: new URLSearchParams({
            grant_type: "client_credentials",
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
            `Failed to fetch Spotify token: ${response.status} ${errorBody}`
        );
    }

    const { access_token } = (await response.json()) as { access_token: string };
    return access_token;
};

const mapToResponse = (tracks: SpotifyPlaylistTrack[]) =>
    tracks
        .filter((track) => Boolean(track) && Boolean(track.id))
        .map((track) => ({
            id: track.id,
            title: track.name,
            artist: track.artists.map((artist) => artist.name).join(", "),
            artistId: track.artists[0]?.id,
            album: track.album?.name ?? "",
            albumId: track.album?.id,
            coverUrl: track.album?.images?.[0]?.url ?? "",
            duration: track.duration_ms,
            previewUrl: track.preview_url,
        }));

export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id: playlistId } = await context.params;

        if (!playlistId) {
            return NextResponse.json(
                { error: "Missing playlist id" },
                { status: 400 }
            );
        }

        let accessToken: string | null = null;

        try {
            accessToken = await getAccessToken();
            console.info("[Spotify API] playlist tracks request", {
                playlistId,
            });
        } catch (tokenError) {
            console.error("[Spotify API] failed to get Spotify token", {
                error: tokenError,
                playlistId,
            });
        }

        if (!accessToken) {
            return NextResponse.json(
                {
                    error: "Failed to obtain Spotify token",
                    tracks: [],
                },
                { status: 503 }
            );
        }

        const response = await fetch(
            `https://api.spotify.com/v1/playlists/${playlistId}?market=US`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("[Spotify API] playlist request failed", {
                playlistId,
                status: response.status,
                error: errorBody,
            });
            throw new Error(
                `Failed to fetch playlist: ${response.status} ${errorBody}`
            );
        }

        const data = await response.json();
        const items: SpotifyPlaylistTrack[] =
            data.tracks?.items
                ?.map(
                    (item: { track?: SpotifyPlaylistTrack | null }) => item.track ?? null
                )
                .filter(Boolean) ?? [];

        const mapped = mapToResponse(items);
        console.info("[Spotify API] playlist tracks success", {
            playlistId,
            count: mapped.length,
        });
        return NextResponse.json({
            tracks: mapped,
        });
    } catch (error) {
        console.error("[Spotify API] error fetching playlist tracks", {
            error,
        });

        return NextResponse.json(
            {
                error: "Failed to fetch Spotify playlist",
                tracks: [],
            },
            { status: 502 }
        );
    }
}

