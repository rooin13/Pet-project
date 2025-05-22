import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store";
import { setQuery } from "./slice";

export const useMovieSearch = () => {
    const dispatch = useAppDispatch();
    const [localQuery, setLocalQuery] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => {
            dispatch(setQuery(localQuery));
        }, 200);

        return () => clearTimeout(timeout);
    }, [localQuery, dispatch]);

    return {
        updateQuery: (value: string) => setLocalQuery(value),
        query: localQuery
    };
};
