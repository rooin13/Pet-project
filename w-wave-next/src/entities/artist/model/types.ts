// artist entity types

export interface Artist {
    id: string;
    name: string;
    imageUrl?: string;
    genres?: string[];
    followers?: number;
    popularity?: number;
}

// spotify API response type
export interface SpotifyArtistResponse {
    id: string;
    name: string;
    genres: string[];
    images: { url: string; height: number; width: number }[];
    popularity: number;
    followers: { total: number };
}

// transform spotify response to artist entity
export function mapSpotifyArtistToArtist(
    spotifyArtist: SpotifyArtistResponse
): Artist {
    return {
        id: spotifyArtist.id,
        name: spotifyArtist.name,
        imageUrl: spotifyArtist.images[0]?.url,
        genres: spotifyArtist.genres,
        followers: spotifyArtist.followers.total,
        popularity: spotifyArtist.popularity,
    };
}

