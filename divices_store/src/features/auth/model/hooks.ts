import { useSession } from "next-auth/react";


export function useAuthUser() {
    const { data: session, status } = useSession();

    return {
        data: session?.user ?? null,
        isPending: status === "loading",
    };
}




