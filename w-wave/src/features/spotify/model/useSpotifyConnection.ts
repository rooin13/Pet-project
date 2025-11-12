"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type SpotifyConnectionState = {
    isLoading: boolean;
    isConnected: boolean;
};

type SpotifyConnectionHandlers = {
    connect: () => void;
    disconnect: () => Promise<void>;
};

export const useSpotifyConnection = (): {
    state: SpotifyConnectionState;
    handlers: SpotifyConnectionHandlers;
} => {
    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);

    const checkConnection = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/spotify/status");
            const data = await response.json();
            setIsConnected(Boolean(data.connected));
        } catch (error) {
            console.error("failed to check spotify connection", error);
            setIsConnected(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void checkConnection();
    }, [checkConnection]);

    const connect = useCallback(() => {
        window.location.href = "/api/spotify/auth";
    }, []);

    const disconnect = useCallback(async () => {
        const confirmed = window.confirm(
            "are you sure you want to disconnect spotify?"
        );
        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch("/api/spotify/disconnect", {
                method: "POST",
            });

            if (response.ok) {
                setIsConnected(false);
            } else {
                console.error("spotify disconnect failed", response.status);
            }
        } catch (error) {
            console.error("failed to disconnect spotify", error);
        }
    }, []);

    const state = useMemo(
        () => ({
            isLoading,
            isConnected,
        }),
        [isConnected, isLoading]
    );

    return {
        state,
        handlers: {
            connect,
            disconnect,
        },
    };
};


