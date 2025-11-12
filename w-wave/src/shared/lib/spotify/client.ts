/**
 * Spotify API Client
 * Wrapper для работы с Spotify Web API
 */

export type SpotifyTrack = {
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
};

export type SpotifyArtist = {
    id: string;
    name: string;
    genres: string[];
    images: { url: string; height: number; width: number }[];
    popularity: number;
    followers: { total: number };
};

export type SpotifyAlbum = {
    id: string;
    name: string;
    artists: { name: string; id: string }[];
    images: { url: string; height: number; width: number }[];
    release_date: string;
    total_tracks: number;
    uri: string;
};

export type SpotifyPlaylist = {
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
};

export class SpotifyClient {
    private accessToken: string;

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }

    private async fetch(endpoint: string, options: RequestInit = {}) {
        const url = `https://api.spotify.com/v1${endpoint}`;

        const response = await fetch(url, {
            ...options,
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(
                `Spotify API error: ${response.status} - ${error.error?.message || response.statusText
                }`
            );
        }

        return response.json();
    }

    // ============ TRACKS ============

    /**
     * Получить информацию о треке
     */
    async getTrack(trackId: string): Promise<SpotifyTrack> {
        return this.fetch(`/tracks/${trackId}`);
    }

    /**
     * Получить несколько треков
     */
    async getTracks(trackIds: string[]): Promise<{ tracks: SpotifyTrack[] }> {
        const ids = trackIds.join(",");
        return this.fetch(`/tracks?ids=${ids}`);
    }

    /**
     * Поиск треков
     */
    async searchTracks(
        query: string,
        limit: number = 20
    ): Promise<{
        tracks: {
            items: SpotifyTrack[];
            total: number;
        };
    }> {
        const params = new URLSearchParams({
            q: query,
            type: "track",
            limit: limit.toString(),
        });

        return this.fetch(`/search?${params}`);
    }

    /**
     * Универсальный поиск (треки, артисты, альбомы, плейлисты)
     */
    async search(
        query: string,
        types: ("track" | "artist" | "album" | "playlist")[],
        limit: number = 20
    ): Promise<{
        tracks?: { items: SpotifyTrack[]; total: number };
        artists?: { items: SpotifyArtist[]; total: number };
        albums?: { items: SpotifyAlbum[]; total: number };
        playlists?: { items: SpotifyPlaylist[]; total: number };
    }> {
        const params = new URLSearchParams({
            q: query,
            type: types.join(","),
            limit: limit.toString(),
        });

        return this.fetch(`/search?${params}`);
    }

    // ============ USER LIBRARY ============

    /**
     * Получить лайкнутые треки пользователя
     */
    async getSavedTracks(
        limit: number = 50,
        offset: number = 0
    ): Promise<{
        items: { added_at: string; track: SpotifyTrack }[];
        total: number;
        next: string | null;
    }> {
        const params = new URLSearchParams({
            limit: limit.toString(),
            offset: offset.toString(),
        });

        return this.fetch(`/me/tracks?${params}`);
    }

    /**
     * Лайкнуть трек
     */
    async saveTrack(trackId: string): Promise<void> {
        await this.fetch(`/me/tracks?ids=${trackId}`, {
            method: "PUT",
        });
    }

    /**
     * Удалить лайк с трека
     */
    async removeTrack(trackId: string): Promise<void> {
        await this.fetch(`/me/tracks?ids=${trackId}`, {
            method: "DELETE",
        });
    }

    /**
     * Проверить лайкнут ли трек
     */
    async checkSavedTracks(trackIds: string[]): Promise<boolean[]> {
        const ids = trackIds.join(",");
        return this.fetch(`/me/tracks/contains?ids=${ids}`);
    }

    // ============ PLAYLISTS ============

    /**
     * Получить плейлисты пользователя
     */
    async getMyPlaylists(
        limit: number = 50,
        offset: number = 0
    ): Promise<{
        items: SpotifyPlaylist[];
        total: number;
        next: string | null;
    }> {
        const params = new URLSearchParams({
            limit: limit.toString(),
            offset: offset.toString(),
        });

        return this.fetch(`/me/playlists?${params}`);
    }

    /**
     * Создать плейлист
     */
    async createPlaylist(
        userId: string,
        name: string,
        isPublic: boolean = true,
        description?: string
    ): Promise<SpotifyPlaylist> {
        return this.fetch(`/users/${userId}/playlists`, {
            method: "POST",
            body: JSON.stringify({
                name,
                public: isPublic,
                description,
            }),
        });
    }

    /**
     * Добавить треки в плейлист
     */
    async addTracksToPlaylist(
        playlistId: string,
        trackUris: string[]
    ): Promise<{ snapshot_id: string }> {
        return this.fetch(`/playlists/${playlistId}/tracks`, {
            method: "POST",
            body: JSON.stringify({
                uris: trackUris,
            }),
        });
    }

    /**
     * Получить треки плейлиста
     */
    async getPlaylistTracks(
        playlistId: string,
        limit: number = 50,
        offset: number = 0
    ): Promise<{
        items: { added_at: string; track: SpotifyTrack }[];
        total: number;
        next: string | null;
    }> {
        const params = new URLSearchParams({
            limit: limit.toString(),
            offset: offset.toString(),
        });

        return this.fetch(`/playlists/${playlistId}/tracks?${params}`);
    }

    // ============ ARTISTS ============

    /**
     * Получить информацию об артисте
     */
    async getArtist(artistId: string): Promise<SpotifyArtist> {
        return this.fetch(`/artists/${artistId}`);
    }

    /**
     * Получить топ треки артиста
     */
    async getArtistTopTracks(artistId: string, market: string = "US"): Promise<{ tracks: SpotifyTrack[] }> {
        return this.fetch(`/artists/${artistId}/top-tracks?market=${market}`);
    }

    /**
     * Получить альбомы артиста
     */
    async getArtistAlbums(
        artistId: string,
        limit: number = 20,
        offset: number = 0
    ): Promise<{
        items: SpotifyAlbum[];
        total: number;
        next: string | null;
    }> {
        const params = new URLSearchParams({
            limit: limit.toString(),
            offset: offset.toString(),
        });
        return this.fetch(`/artists/${artistId}/albums?${params}`);
    }

    // ============ ALBUMS ============

    /**
     * Получить информацию об альбоме
     */
    async getAlbum(albumId: string): Promise<SpotifyAlbum & { tracks: { items: SpotifyTrack[] } }> {
        return this.fetch(`/albums/${albumId}`);
    }

    // ============ USER ============

    /**
     * Получить профиль текущего пользователя
     */
    async getMe(): Promise<{
        id: string;
        display_name: string;
        email: string;
        images: { url: string }[];
    }> {
        return this.fetch("/me");
    }

    /**
     * Получить топ треки пользователя (для AI анализа)
     */
    async getTopTracks(
        timeRange: "short_term" | "medium_term" | "long_term" = "medium_term",
        limit: number = 50
    ): Promise<{
        items: SpotifyTrack[];
        total: number;
    }> {
        const params = new URLSearchParams({
            time_range: timeRange,
            limit: limit.toString(),
        });

        return this.fetch(`/me/top/tracks?${params}`);
    }

    /**
     * Получить топ артистов пользователя (для AI анализа)
     */
    async getTopArtists(
        timeRange: "short_term" | "medium_term" | "long_term" = "medium_term",
        limit: number = 50
    ): Promise<{
        items: {
            id: string;
            name: string;
            genres: string[];
        }[];
        total: number;
    }> {
        const params = new URLSearchParams({
            time_range: timeRange,
            limit: limit.toString(),
        });

        return this.fetch(`/me/top/artists?${params}`);
    }
}

/**
 * Утилита для конвертации Spotify трека в наш формат
 */
export function spotifyTrackToTrackData(track: SpotifyTrack) {
    return {
        title: track.name,
        artist: track.artists.map((a) => a.name).join(", "),
        artistId: track.artists[0]?.id || undefined, // ID первого артиста для навигации
        album: track.album.name,
        albumId: track.album.id,
        coverUrl: track.album.images[0]?.url || "",
        duration: track.duration_ms,
        previewUrl: track.preview_url,
        uri: track.uri, // для Spotify SDK
    };
}

