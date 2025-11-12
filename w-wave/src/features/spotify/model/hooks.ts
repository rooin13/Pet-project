"use client";

import { useCallback, useMemo, useState } from "react";

type ImportResult =
    | {
        type: "success";
        imported: number;
        total: number;
    }
    | {
        type: "error";
        message: string;
    }
    | null;

type ImportLikesState = {
    isImporting: boolean;
    progress: {
        current: number;
        total: number;
        percent: number;
    };
    result: ImportResult;
};

type ImportLikesHandlers = {
    importLikes: () => Promise<void>;
};

export const useImportLikes = (): {
    state: ImportLikesState;
    handlers: ImportLikesHandlers;
} => {
    const [isImporting, setImporting] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [result, setResult] = useState<ImportResult>(null);

    const importLikes = useCallback(async () => {
        setImporting(true);
        setResult(null);
        setProgress({ current: 0, total: 0 });

        try {
            const response = await fetch("/api/spotify/import-likes", {
                method: "POST",
            });

            const data = await response.json();

            if (data.success) {
                setResult({
                    type: "success",
                    imported: data.imported,
                    total: data.total,
                });
                setProgress({ current: data.imported, total: data.total });

                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                setResult({
                    type: "error",
                    message: data.error ?? "Failed to import likes",
                });
            }
        } catch {
            setResult({
                type: "error",
                message: "Failed to import. Connect Spotify first.",
            });
        } finally {
            setImporting(false);
        }
    }, []);

    const state = useMemo<ImportLikesState>(() => {
        const percent =
            progress.total > 0
                ? Math.min(100, (progress.current / progress.total) * 100)
                : 0;

        return {
            isImporting,
            progress: {
                current: progress.current,
                total: progress.total,
                percent,
            },
            result,
        };
    }, [isImporting, progress, result]);

    return {
        state,
        handlers: {
            importLikes,
        },
    };
};


