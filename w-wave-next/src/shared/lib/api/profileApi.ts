import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { createClient } from "@/shared/lib/supabase/client";

export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery: fakeBaseQuery(),
    tagTypes: ["Profile"],
    keepUnusedDataFor: 3600, // Кеш на 1 час
    refetchOnMountOrArgChange: 600, // Refetch только если кеш старше 10 минут
    refetchOnFocus: false,
    refetchOnReconnect: false,
    endpoints: (builder) => ({
        // get current user profile
        getProfile: builder.query<any, void>({
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
                        .single();

                    if (error) throw error;

                    return { data: { user, profile: data } };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            providesTags: ["Profile"],
        }),

        // update username
        updateUsername: builder.mutation<any, { username: string }>({
            async queryFn({ username }) {
                try {
                    const supabase = createClient();
                    const {
                        data: { user },
                    } = await supabase.auth.getUser();

                    if (!user) {
                        throw new Error("Not authenticated");
                    }

                    // check if username is taken
                    const { data: existingUser } = await supabase
                        .from("profiles")
                        .select("id, username")
                        .eq("username", username)
                        .neq("id", user.id)
                        .single();

                    if (existingUser) {
                        throw new Error("Username is already taken");
                    }

                    // update username
                    const { error } = await supabase
                        .from("profiles")
                        .update({ username })
                        .eq("id", user.id);

                    if (error) throw error;

                    return { data: { success: true } };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            invalidatesTags: ["Profile"],
        }),

        // sign in with password
        signInWithPassword: builder.mutation<
            any,
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
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            invalidatesTags: ["Profile"],
        }),

        // sign up
        signUp: builder.mutation<any, { email: string; password: string }>({
            async queryFn({ email, password }) {
                try {
                    const supabase = createClient();
                    const { error } = await supabase.auth.signUp({
                        email,
                        password,
                    });

                    if (error) throw error;

                    return { data: { success: true } };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            invalidatesTags: ["Profile"],
        }),

        // sign out
        signOut: builder.mutation<any, void>({
            async queryFn() {
                try {
                    const supabase = createClient();
                    const { error } = await supabase.auth.signOut();

                    if (error) throw error;

                    return { data: { success: true } };
                } catch (error: any) {
                    return { error: error.message };
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

