// track entity types

export interface Track {
    id: string;
    title: string;
    artist: string;
    artistId?: string;
    album?: string;
    albumId?: string;
    coverUrl: string;
    previewUrl: string | null;
    duration: number; // milliseconds
    popularity?: number;
    uri?: string;
}

// spotify API response type
export interface SpotifyTrackResponse {
    id: string;
    name: string;
    artists: { name: string; id: string }[];
    album: {
        name: string;
        id: string;
        images: { url: string; height: number; width: number }[];
    };
    duration_ms: number;
    preview_url: string | null;
    uri: string;
    popularity?: number;
}

// transform spotify response to track entity
export function mapSpotifyTrackToTrack(
    spotifyTrack: SpotifyTrackResponse
): Track {
    return {
        id: spotifyTrack.id,
        title: spotifyTrack.name,
        artist: spotifyTrack.artists.map((a) => a.name).join(", "),
        artistId: spotifyTrack.artists[0]?.id,
        album: spotifyTrack.album.name,
        albumId: spotifyTrack.album.id,
        coverUrl: spotifyTrack.album.images[0]?.url || "",
        previewUrl: spotifyTrack.preview_url,
        duration: spotifyTrack.duration_ms,
        popularity: spotifyTrack.popularity,
        uri: spotifyTrack.uri,
    };
}

