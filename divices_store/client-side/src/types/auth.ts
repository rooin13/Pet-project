// shared/types/auth.ts
export type RegisterPayload = {
    email: string;
    password: string;
    name: string;
    surname: string;
};

export type RegisterResponse = {
    id: string;
    email: string;
};

export type RegisterErrorResponse = {
    error: string;
};
