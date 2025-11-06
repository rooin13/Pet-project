import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/shared/lib/api";
import { profileApi } from "@/shared/lib/api/profileApi";
import { musicApi } from "@/shared/lib/api/musicApi";
import { playlistTracksApi } from "@/shared/lib/api/playlistTracksApi";
import { playerReducer } from "@/widgets/spotify/Player/model";

export const makeStore = () => {
	return configureStore({
		reducer: {
			// new RTK Query API
			[baseApi.reducerPath]: baseApi.reducer,
			// legacy APIs (will migrate gradually)
			[profileApi.reducerPath]: profileApi.reducer,
			[musicApi.reducerPath]: musicApi.reducer,
			[playlistTracksApi.reducerPath]: playlistTracksApi.reducer,
			// slices
			player: playerReducer,
		},
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				serializableCheck: false,
			}).concat(
				baseApi.middleware,
				profileApi.middleware,
				musicApi.middleware,
				playlistTracksApi.middleware
			),
	});
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

