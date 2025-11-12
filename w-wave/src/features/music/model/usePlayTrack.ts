import { useCallback } from "react";
import { usePlayerControls } from "@/widgets/player";
import type { Track } from "@/entities/track";

export const usePlayTrack = () => {
    const {
        setCurrentTrack,
        play,
        setQueue,
        clearQueue,
    } = usePlayerControls();

    const playTrack = useCallback(
        (track: Track, queue?: Track[]) => {
            console.info("[Player] playTrack invoked", {
                trackId: track.id,
                title: track.title,
                queueSize: queue?.length ?? 0,
            });
            if (queue && queue.length > 0) {
                const queueWithoutCurrent = queue.filter(
                    (item) => item.id !== track.id
                );
                console.info("[Player] setting queue", {
                    queueSize: queueWithoutCurrent.length,
                    queueIds: queueWithoutCurrent.map((item) => item.id),
                });
                setQueue(queueWithoutCurrent);
            } else {
                console.info("[Player] clearing queue");
                clearQueue();
            }

            setCurrentTrack(track);
            console.info("[Player] current track dispatched", {
                trackId: track.id,
                previewUrl: track.previewUrl,
            });

            play();
            console.info("[Player] play action dispatched");
        },
        [clearQueue, play, setCurrentTrack, setQueue]
    );

    return { playTrack };
};
