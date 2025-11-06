// playlist entity types

export interface Playlist {
    id: string;
    title: string;
    description?: string;
    coverUrl?: string;
    owner: string;
    ownerId?: string;
    tracksCount: number;
    isPublic: boolean;
}

// spotify API response type
export interface SpotifyPlaylistResponse {
    id: string;
    name: string;
    description: string | null;
    public: boolean;
    images: { url: string }[];
    tracks: {
        total: number;
    };
    owner: {
        display_name: string;
        id: string;
    };
}

// transform spotify response to playlist entity
export function mapSpotifyPlaylistToPlaylist(
    spotifyPlaylist: SpotifyPlaylistResponse
): Playlist {
    return {
        id: spotifyPlaylist.id,
        title: spotifyPlaylist.name,
        description: spotifyPlaylist.description || undefined,
        coverUrl: spotifyPlaylist.images[0]?.url,
        owner: spotifyPlaylist.owner.display_name,
        ownerId: spotifyPlaylist.owner.id,
        tracksCount: spotifyPlaylist.tracks.total,
        isPublic: spotifyPlaylist.public,
    };
}

