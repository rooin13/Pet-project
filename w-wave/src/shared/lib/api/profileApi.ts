import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { createClient } from "@/shared/lib/supabase/client";

type SupabaseUser = {
    id: string;
    email?: string | null;
};

type SupabaseProfile = {
    id: string;
    username?: string | null;
    avatar_url?: string | null;
    [key: string]: unknown;
};

type ProfileResponse = {
    user: SupabaseUser;
    profile: SupabaseProfile | null;
};

type SuccessResponse = { success: true };

const UNKNOWN_ERROR = "Unknown error";

export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery: fakeBaseQuery(),
    tagTypes: ["Profile"],
    keepUnusedDataFor: 3600,
    refetchOnMountOrArgChange: 600,
    refetchOnFocus: false,
    refetchOnReconnect: false,
    endpoints: (builder) => ({
        getProfile: builder.query<ProfileResponse | null, void>({
            async queryFn() {
                try {
                    const supabase = createClient();
                    const {
                        data: { user },
                    } = await supabase.auth.getUser();

                    if (!user) {
                        return { data: null };
                    }

                    const { data, error } = await supabase
                        .from("profiles")
                        .select("*")
                        .eq("id", user.id)
                        .single<SupabaseProfile>();

                    if (error) throw error;

                    return {
                        data: {
                            user: {
                                id: user.id,
                                email: user.email,
                            },
                            profile: data ?? null,
                        },
                    };
                } catch (error) {
                    return {
                        error:
                            error instanceof Error
                                ? error.message
                                : UNKNOWN_ERROR,
                    };
                }
            },
            providesTags: ["Profile"],
        }),

        updateUsername: builder.mutation<SuccessResponse, { username: string }>(
            {
                async queryFn({ username }) {
                    try {
                        const supabase = createClient();
                        const {
                            data: { user },
                        } = await supabase.auth.getUser();

                        if (!user) {
                            throw new Error("Not authenticated");
                        }

                        const { data: existingUser } = await supabase
                            .from("profiles")
                            .select("id")
                            .eq("username", username)
                            .neq("id", user.id)
                            .maybeSingle<{ id: string }>();

                        if (existingUser) {
                            throw new Error("Username is already taken");
                        }

                        const { error } = await supabase
                            .from("profiles")
                            .update({ username })
                            .eq("id", user.id);

                        if (error) throw error;

                        return { data: { success: true } };
                    } catch (error) {
                        return {
                            error:
                                error instanceof Error
                                    ? error.message
                                    : UNKNOWN_ERROR,
                        };
                    }
                },
                invalidatesTags: ["Profile"],
            }
        ),

        signInWithPassword: builder.mutation<
            SuccessResponse,
            { email: string; password: string }
        >({
            async queryFn({ email, password }) {
                try {
                    const supabase = createClient();
                    const { error } = await supabase.auth.signInWithPassword({
                        email,
                        password,
                    });

                    if (error) throw error;

                    return { data: { success: true } };
                } catch (error) {
                    return {
                        error:
                            error instanceof Error
                                ? error.message
                                : UNKNOWN_ERROR,
                    };
                }
            },
            invalidatesTags: ["Profile"],
        }),

        signUp: builder.mutation<SuccessResponse, { email: string; password: string }>(
            {
                async queryFn({ email, password }) {
                    try {
                        const supabase = createClient();
                        const { error } = await supabase.auth.signUp({
                            email,
                            password,
                        });

                        if (error) throw error;

                        return { data: { success: true } };
                    } catch (error) {
                        return {
                            error:
                                error instanceof Error
                                    ? error.message
                                    : UNKNOWN_ERROR,
                        };
                    }
                },
                invalidatesTags: ["Profile"],
            }
        ),

        signOut: builder.mutation<SuccessResponse, void>({
            async queryFn() {
                try {
                    const supabase = createClient();
                    const { error } = await supabase.auth.signOut();

                    if (error) throw error;

                    return { data: { success: true } };
                } catch (error) {
                    return {
                        error:
                            error instanceof Error
                                ? error.message
                                : UNKNOWN_ERROR,
                    };
                }
            },
            invalidatesTags: ["Profile"],
        }),
    }),
});

export const {
    useGetProfileQuery,
    useUpdateUsernameMutation,
    useSignInWithPasswordMutation,
    useSignUpMutation,
    useSignOutMutation,
} = profileApi;

