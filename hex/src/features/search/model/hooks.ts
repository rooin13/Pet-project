import { useState, useEffect } from "react";
import { useAppDispatch } from "@/store";
import { setQuery } from "./slice";

export const useSearch = () => {
    const dispatch = useAppDispatch();
    const [query, setQueryState] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => {
            dispatch(setQuery(query));
        }, 300);

        return () => clearTimeout(timeout);
    }, [query, dispatch]);

    const updateQuery = (value: string) => {
        setQueryState(value);
    };

    return {
        query,
        updateQuery,
    };
};