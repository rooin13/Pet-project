import { useDispatch } from "react-redux";
import { setCurrentTrack, play, setQueue, clearQueue } from "@/widgets/spotify/Player/model";
import type { Track } from "@/entities/track";

export const usePlayTrack = () => {
    const dispatch = useDispatch();

    const playTrack = (track: Track, queue?: Track[]) => {
        dispatch(setCurrentTrack(track));

        // если передана очередь, устанавливаем её (без текущего трека)
        if (queue && queue.length > 0) {
            const queueWithoutCurrent = queue.filter((t) => t.id !== track.id);
            dispatch(setQueue(queueWithoutCurrent));
        } else {
            // очищаем очередь если её нет
            dispatch(clearQueue());
        }

        dispatch(play());
    };

    return { playTrack };
};
