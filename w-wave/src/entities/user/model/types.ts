// user entity types

export interface User {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
    spotifyConnected: boolean;
    createdAt?: string;
}

