// album entity types

export interface Album {
    id: string;
    name: string;
    artist: string;
    artistId: string;
    imageUrl: string;
    releaseDate: string;
    totalTracks: number;
    uri?: string;
}

// spotify API response type
export interface SpotifyAlbumResponse {
    id: string;
    name: string;
    artists: { name: string; id: string }[];
    images: { url: string; height: number; width: number }[];
    release_date: string;
    total_tracks: number;
    uri: string;
}

// transform spotify response to album entity
export function mapSpotifyAlbumToAlbum(
    spotifyAlbum: SpotifyAlbumResponse
): Album {
    return {
        id: spotifyAlbum.id,
        name: spotifyAlbum.name,
        artist: spotifyAlbum.artists.map((a) => a.name).join(", "),
        artistId: spotifyAlbum.artists[0]?.id || "",
        imageUrl: spotifyAlbum.images[0]?.url || "",
        releaseDate: spotifyAlbum.release_date,
        totalTracks: spotifyAlbum.total_tracks,
        uri: spotifyAlbum.uri,
    };
}

