import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Track } from "@/entities/track";

export type PlayerState = {
    currentTrack: Track | null;
    isPlaying: boolean;
    volume: number;
    currentTime: number;
    duration: number;
    queue: Track[];
    history: Track[];
    shuffle: boolean;
    repeat: "off" | "all" | "one";
};

const initialState: PlayerState = {
    currentTrack: null,
    isPlaying: false,
    volume: 0.7,
    currentTime: 0,
    duration: 0,
    queue: [],
    history: [],
    shuffle: false,
    repeat: "off",
};

const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        setCurrentTrack: (state, action: PayloadAction<Track>) => {
            // сохраняем текущий трек в историю
            if (
                state.currentTrack &&
                state.currentTrack.id !== action.payload.id
            ) {
                state.history.push(state.currentTrack);
                // ограничим историю 50 треками
                if (state.history.length > 50) {
                    state.history.shift();
                }
            }
            state.currentTrack = action.payload;
            state.duration = action.payload.duration / 1000; // ms to seconds
            state.currentTime = 0;
        },
        play: (state) => {
            state.isPlaying = true;
        },
        pause: (state) => {
            state.isPlaying = false;
        },
        togglePlayPause: (state) => {
            state.isPlaying = !state.isPlaying;
        },
        setVolume: (state, action: PayloadAction<number>) => {
            state.volume = Math.max(0, Math.min(1, action.payload));
        },
        setCurrentTime: (state, action: PayloadAction<number>) => {
            state.currentTime = action.payload;
        },
        setDuration: (state, action: PayloadAction<number>) => {
            state.duration = action.payload;
        },
        toggleShuffle: (state) => {
            state.shuffle = !state.shuffle;
            if (state.shuffle && state.queue.length > 0) {

                const shuffled = [...state.queue];
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                state.queue = shuffled;
            }
        },
        toggleRepeat: (state) => {
            if (state.repeat === "off") state.repeat = "all";
            else if (state.repeat === "all") state.repeat = "one";
            else state.repeat = "off";
        },
        setQueue: (state, action: PayloadAction<Track[]>) => {
            state.queue = action.payload;

            if (state.shuffle && state.queue.length > 0) {
                const shuffled = [...state.queue];
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                state.queue = shuffled;
            }
        },
        addToQueue: (state, action: PayloadAction<Track>) => {
            state.queue.push(action.payload);
        },
        removeFromQueue: (state, action: PayloadAction<number>) => {
            state.queue.splice(action.payload, 1);
        },
        clearQueue: (state) => {
            state.queue = [];
        },
        playNext: (state) => {
            if (state.repeat === "one" && state.currentTrack) {
                state.currentTime = 0;
                state.isPlaying = true;
                return;
            }

            if (state.queue.length > 0) {
                // сохраняем текущий трек в историю (но не дублируем)
                if (
                    state.currentTrack &&
                    state.currentTrack.id !== state.queue[0]?.id
                ) {
                    state.history.push(state.currentTrack);
                    if (state.history.length > 50) {
                        state.history.shift();
                    }
                }

                const nextTrack = state.queue[0];
                state.currentTrack = nextTrack;
                state.queue.splice(0, 1);
                state.currentTime = 0;
                state.isPlaying = true;
            } else if (state.repeat === "all" && state.history.length > 0) {
                // если repeat = all и очередь пустая, начинаем заново
                state.queue = [...state.history];
                if (state.currentTrack) {
                    state.queue.push(state.currentTrack);
                }
                state.history = [];

                if (state.queue.length > 0) {
                    state.currentTrack = state.queue[0];
                    state.queue.splice(0, 1);
                    state.currentTime = 0;
                    state.isPlaying = true;
                }
            } else {
                state.isPlaying = false;
            }
        },
        playPrevious: (state) => {
            if (state.history.length > 0) {
                // возвращаем текущий трек в очередь
                if (state.currentTrack) {
                    state.queue.unshift(state.currentTrack);
                }
                // берем последний трек из истории
                const previousTrack = state.history.pop();
                if (previousTrack) {
                    state.currentTrack = previousTrack;
                    state.currentTime = 0;
                    state.isPlaying = true;
                }
            } else {
                // если истории нет, просто перемотаем в начало
                state.currentTime = 0;
            }
        },
    },
});

export const {
    setCurrentTrack,
    play,
    pause,
    togglePlayPause,
    setVolume,
    setCurrentTime,
    setDuration,
    toggleShuffle,
    toggleRepeat,
    addToQueue,
    removeFromQueue,
    clearQueue,
    playNext,
    playPrevious,
    setQueue,
} = playerSlice.actions;

export default playerSlice.reducer;

