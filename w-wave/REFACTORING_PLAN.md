# 🔥 ПОЛНЫЙ РЕФАКТОРИНГ W-WAVE-NEXT ПО ARCHITECTURE_GUIDE.md

> **Прогресс (09.11.2025):** обновлён `widgets/player` (desktop/mobile/fullscreen) — добавлены a11y-атрибуты, клавиатурные хендлеры, memо/коллбеки, расширены словари `messages/*` для новых aria-label.

## 📊 ТЕКУЩЕЕ СОСТОЯНИЕ

### ❌ Проблемы:

1. **НЕТ `entities/` слоя** - бизнес-сущности не выделены
2. **API структура нарушена** - mixed client/server logic
3. **Комментарии с большой буквы** - не по гайду
4. **НЕТ скелетонов** для async данных
5. **Неполная типизация** - any в некоторых местах
6. **НЕТ SEO** - generateMetadata отсутствует
7. **Нет Error Boundaries**
8. **Неоптимальные изображения** - не везде next/image
9. **Memory leaks** - не все cleanup
10. **Нет CSRF защиты**

---

## 🎯 ДЕТАЛЬНЫЙ ПЛАН РЕФАКТОРИНГА

### 📚 ЭТАП 1: АНАЛИЗ И ПОДГОТОВКА (ТЕКУЩИЙ)

**Задачи:**

-   [x] Прочитать ARCHITECTURE_GUIDE.md
-   [x] Проанализировать текущую структуру
-   [ ] Создать backup текущего состояния
-   [ ] Создать детальный план

---

### 🗂️ ЭТАП 2: FSD СТРУКТУРА - ENTITIES LAYER

**Цель:** Создать полную FSD структуру с entities слоем

#### 2.1 Создать `entities/` структуру:

```
src/entities/
├── track/
│   ├── model/
│   │   ├── types.ts        # Track interface
│   │   ├── hooks.ts        # useTrack, useTrackActions
│   │   └── index.ts
│   ├── ui/
│   │   ├── TrackCard.tsx   # Базовая карточка трека
│   │   ├── TrackRow.tsx    # Строка трека в списке
│   │   └── index.ts
│   └── index.ts
│
├── album/
│   ├── model/
│   │   ├── types.ts        # Album interface
│   │   ├── hooks.ts        # useAlbum
│   │   └── index.ts
│   ├── ui/
│   │   ├── AlbumCard.tsx
│   │   └── index.ts
│   └── index.ts
│
├── artist/
│   ├── model/
│   │   ├── types.ts        # Artist interface
│   │   ├── hooks.ts        # useArtist
│   │   └── index.ts
│   ├── ui/
│   │   ├── ArtistCard.tsx
│   │   └── index.ts
│   └── index.ts
│
├── playlist/
│   ├── model/
│   │   ├── types.ts        # Playlist interface
│   │   ├── hooks.ts        # usePlaylist
│   │   └── index.ts
│   ├── ui/
│   │   ├── PlaylistCard.tsx
│   │   └── index.ts
│   └── index.ts
│
└── user/
    ├── model/
    │   ├── types.ts        # User interface
    │   ├── hooks.ts        # useUser
    │   └── index.ts
    ├── ui/
    │   ├── UserAvatar.tsx
    │   └── index.ts
    └── index.ts
```

#### 2.2 Переместить типы в entities:

**Из:** `shared/lib/spotify/client.ts`
**В:** `entities/track/model/types.ts`, etc.

```typescript
// entities/track/model/types.ts
export interface Track {
	id: string;
	title: string;
	artist: string;
	artistId?: string;
	album?: string;
	albumId?: string;
	coverUrl: string;
	previewUrl: string | null;
	duration: number; // ms
	popularity?: number;
}

// entities/album/model/types.ts
export interface Album {
	id: string;
	name: string;
	artist: string;
	artistId: string;
	imageUrl: string;
	releaseDate: string;
	totalTracks: number;
}

// entities/artist/model/types.ts
export interface Artist {
	id: string;
	name: string;
	imageUrl?: string;
	genres?: string[];
	followers?: number;
}

// entities/playlist/model/types.ts
export interface Playlist {
	id: string;
	title: string;
	description?: string;
	coverUrl?: string;
	owner: string;
	tracksCount: number;
	isPublic: boolean;
}

// entities/user/model/types.ts
export interface User {
	id: string;
	email: string;
	name?: string;
	avatarUrl?: string;
	spotifyConnected: boolean;
}
```

#### 2.3 Создать базовые UI компоненты в entities:

```typescript
// entities/track/ui/TrackCard.tsx
export function TrackCard({ track }: { track: Track }) {
	return (
		<div className="group relative bg-gray-800/50 hover:bg-gray-800 transition p-4 rounded-lg">
			<Image
				src={track.coverUrl}
				alt={track.title}
				width={160}
				height={160}
			/>
			<h3 className="text-white font-medium truncate">{track.title}</h3>
			<p className="text-gray-400 text-sm truncate">{track.artist}</p>
		</div>
	);
}

// entities/track/ui/TrackRow.tsx
export function TrackRow({ track, index }: { track: Track; index: number }) {
	return (
		<div className="grid grid-cols-[16px_1fr_auto] gap-4 items-center p-2 hover:bg-white/5 rounded">
			<span className="text-gray-400 text-sm">{index + 1}</span>
			<div className="flex items-center gap-3">
				<Image
					src={track.coverUrl}
					alt={track.title}
					width={40}
					height={40}
				/>
				<div>
					<p className="text-white font-medium">{track.title}</p>
					<p className="text-gray-400 text-sm">{track.artist}</p>
				</div>
			</div>
			<span className="text-gray-400 text-sm">
				{formatDuration(track.duration)}
			</span>
		</div>
	);
}
```

---

### 📡 ЭТАП 3: API LAYER РЕФАКТОРИНГ

**Цель:** Правильное разделение client/server API

#### 3.1 RTK Query Setup:

```typescript
// shared/lib/api/baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
	tagTypes: ["Track", "Album", "Artist", "Playlist", "User"],
	endpoints: () => ({}),
});

// shared/lib/api/trackApi.ts
import { baseApi } from "./baseApi";
import { Track } from "@/entities/track";

export const trackApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		searchTracks: builder.query<{ tracks: Track[] }, string>({
			query: (q) => `/tracks/search?q=${q}`,
			providesTags: (result) =>
				result
					? [
							...result.tracks.map(({ id }) => ({
								type: "Track" as const,
								id,
							})),
							{ type: "Track", id: "LIST" },
					  ]
					: [{ type: "Track", id: "LIST" }],
		}),
		getTrack: builder.query<Track, string>({
			query: (id) => `/tracks/${id}`,
			providesTags: (result, error, id) => [{ type: "Track", id }],
		}),
	}),
});

export const { useSearchTracksQuery, useGetTrackQuery } = trackApi;
```

#### 3.2 Переместить API routes logic:

**Правило:** Server logic в `app/api/`, client hooks в `shared/lib/api/`

```typescript
// app/api/tracks/search/route.ts - ТОЛЬКО server logic
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const query = searchParams.get("q");

		// validation
		if (!query) {
			return NextResponse.json(
				{ error: "Query required" },
				{ status: 400 }
			);
		}

		// spotify api call
		const accessToken = await getSpotifyAccessToken();
		const tracks = await searchSpotifyTracks(query, accessToken);

		return NextResponse.json({ tracks });
	} catch (error) {
		console.error("Track search error:", error);
		return NextResponse.json(
			{ error: "Failed to search tracks" },
			{ status: 500 }
		);
	}
}
```

---

### 🎨 ЭТАП 4: UI COMPONENTS РЕФАКТОРИНГ

**Цель:** Все компоненты соответствуют гайду

> **Статус:** `widgets/player` (desktop/mobile/fullscreen) обновлён — aria-label, keyboard support, memoизация, локализации. `features/ai-playlist` — schema validation (клиент + сервер), безопасный Supabase парсинг, skeleton’ы в UI. `features/search/ui/UniversalSearch` — skeleton блоки для всех вкладок во время загрузки. `features/music/ui/AddToPlaylistMenuEnhanced` — skeleton + aria в меню плейлистов, пока подтягиваются данные. `app/[locale]/artist/[id]/page`, `app/[locale]/album/[id]/page`, `app/[locale]/playlist/[id]/page`, `app/[locale]/liked/page`, `app/[locale]/create-playlist/page`, `app/[locale]/library/page`, `features/profile/ui/ProfileEditor`, `widgets/main-content/ui/MainContent`, `widgets/sidebar/ui/Sidebar`, `features/track-search/ui/TrackSearch` — skeleton layout вместо спиннеров, проставлены `role="status"` и aria-лейблы для озвучки загрузки и интерактивов. Комментарии в целевых компонентах приведены к нижнему регистру согласно гайду.

### UI:

-   [ ] Скелетоны для ВСЕХ async данных — **AI playlist (UI + меню), universal search, artist page, album page, playlist page, liked page, create-playlist page, widgets/main-content, sidebar, track-search ✅ (остальные страницы проверить)**
-   [x] Комментарии с маленькой буквы
-   [x] next/image везде
-   [ ] Responsive (sm/md/lg/xl)
-   [ ] a11y (aria-label, alt, semantic HTML) — **widgets/player ✅**

#### 4.1 Добавить скелетоны для ВСЕХ async данных:

```typescript
// shared/ui/TrackCardSkeleton.tsx
export function TrackCardSkeleton() {
  return (
    <div className="bg-gray-800/50 p-4 rounded-lg animate-pulse">
      <div className="w-full h-40 bg-gray-700 rounded mb-3" />
      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-700 rounded w-1/2" />
    </div>
  );
}

// Использование:
function TrackList() {
  const { data, isLoading } = useSearchTracksQuery("rock");

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <TrackCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return ...;
}
```

#### 4.2 Исправить ВСЕ комментарии:

**ДО:**

```typescript
// This Component Displays The Product Card
{
	/* Product Image Container */
}
// TODO: Fix this later
```

**ПОСЛЕ:**

```typescript
// product card
{
	/* product image */
}
```

#### 4.3 Добавить responsive и a11y:

```typescript
// ✅ Responsive
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

// ✅ Accessibility
<button aria-label="Play track">
<img alt="Album cover" />
<input aria-label="Search music" />
```

#### 4.4 Заменить img на next/image:

```typescript
// ❌ ДО
<img src={album.imageUrl} />

// ✅ ПОСЛЕ
<Image
  src={album.imageUrl}
  alt={album.name}
  width={300}
  height={300}
  className="rounded-lg"
/>
```

---

### 🔐 ЭТАП 5: SECURITY & ERROR HANDLING

**Цель:** 80% ошибок в API, 15% RTK, 5% hooks

#### 5.1 Error Handling Strategy:

```typescript
// app/api/tracks/search/route.ts (80% ошибок ЗДЕСЬ)
export async function GET(request: NextRequest) {
	try {
		// validation
		const { searchParams } = new URL(request.url);
		const query = searchParams.get("q");

		if (!query) {
			return NextResponse.json(
				{ error: "Search query is required" },
				{ status: 400 }
			);
		}

		if (query.length < 2) {
			return NextResponse.json(
				{ error: "Query must be at least 2 characters" },
				{ status: 400 }
			);
		}

		// api call with error handling
		try {
			const tracks = await searchSpotifyTracks(query);
			return NextResponse.json({ tracks });
		} catch (apiError) {
			console.error("Spotify API error:", apiError);
			return NextResponse.json(
				{ error: "Spotify service unavailable" },
				{ status: 503 }
			);
		}
	} catch (error) {
		console.error("Unexpected error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// shared/lib/api/trackApi.ts (15% ошибок)
export const trackApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		searchTracks: builder.query<{ tracks: Track[] }, string>({
			query: (q) => `/tracks/search?q=${q}`,
			transformErrorResponse: (response) => {
				// transform API error для UI
				return {
					message: response.data?.error || "Failed to search tracks",
					status: response.status,
				};
			},
		}),
	}),
});

// features/search/model/hooks.ts (5% ошибок)
export function useTrackSearch(query: string) {
	const { data, error, isLoading } = useSearchTracksQuery(query, {
		skip: query.length < 2,
	});

	// minimal error handling
	if (error) {
		toast.error(error.message);
	}

	return { tracks: data?.tracks, isLoading };
}

// UI Component (0% ошибок - НИКАКОЙ обработки!)
function TrackList({ query }: { query: string }) {
	const { tracks, isLoading } = useTrackSearch(query);

	if (isLoading) return <TrackCardSkeleton />;

	return tracks?.map((track) => <TrackCard key={track.id} track={track} />);
}
```

#### 5.2 Error Boundaries:

```typescript
// shared/ui/ErrorBoundary.tsx
"use client";

export class ErrorBoundary extends React.Component<
	{ children: React.ReactNode },
	{ hasError: boolean }
> {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		console.error("Error caught by boundary:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="flex flex-col items-center justify-center min-h-[400px]">
					<h2 className="text-xl font-bold text-white mb-4">
						Something went wrong
					</h2>
					<button
						onClick={() => this.setState({ hasError: false })}
						className="px-4 py-2 bg-purple-600 text-white rounded"
					>
						Try again
					</button>
				</div>
			);
		}

		return this.props.children;
	}
}

// Использование в критичных местах
<ErrorBoundary>
	<Player />
</ErrorBoundary>;
```

#### 5.3 CSRF Protection:

```typescript
// app/api/playlists/create/route.ts
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
	// verify CSRF token for non-auth users
	const cookieStore = await cookies();
	const csrfToken = request.headers.get("x-csrf-token");
	const storedToken = cookieStore.get("csrf-token")?.value;

	if (!csrfToken || csrfToken !== storedToken) {
		return NextResponse.json(
			{ error: "Invalid CSRF token" },
			{ status: 403 }
		);
	}

	// process request...
}
```

---

### ⚡ ЭТАП 6: PERFORMANCE OPTIMIZATION

**Цель:** 90+ Lighthouse score

#### 6.1 Мемоизация:

```typescript
// widgets/spotify/Player.tsx
const Player = React.memo(function Player() {
  const currentTrack = useSelector((state: RootState) => state.player.currentTrack);

  // memoize expensive calculations
  const formattedTime = useMemo(
    () => formatDuration(currentTrack?.duration),
    [currentTrack?.duration]
  );

  // memoize callbacks
  const handlePlay = useCallback(() => {
    dispatch(togglePlayPause());
  }, [dispatch]);

  return ...;
});
```

#### 6.2 Cleanup всех timers/listeners:

```typescript
// widgets/spotify/Player.tsx
useEffect(() => {
	if (!useSpotifySDK || !isPlaying) return;

	const interval = setInterval(() => {
		spotifyPlayerRef.current?.getCurrentState().then((state) => {
			if (state && !state.paused) {
				dispatch(setCurrentTime(state.position / 1000));
			}
		});
	}, 100);

	return () => clearInterval(interval); // ✅ CLEANUP
}, [useSpotifySDK, isPlaying, dispatch]);
```

#### 6.3 Dynamic imports:

```typescript
// app/[locale]/ai-playlist/page.tsx
import dynamic from "next/dynamic";

const AIPlaylistGenerator = dynamic(
	() =>
		import("@/features/ai-playlist").then((mod) => mod.AIPlaylistGenerator),
	{
		loading: () => <div className="animate-pulse">Loading...</div>,
		ssr: false, // если компонент использует browser API
	}
);
```

#### 6.4 Debounce для search:

```typescript
// features/search/model/hooks.ts
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";

export function useTrackSearch(query: string) {
	const debouncedQuery = useDebouncedValue(query, 300);

	const { data, isLoading } = useSearchTracksQuery(debouncedQuery, {
		skip: debouncedQuery.length < 2,
	});

	return { tracks: data?.tracks, isLoading };
}

// shared/hooks/useDebouncedValue.ts
export function useDebouncedValue<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedValue(value), delay);
		return () => clearTimeout(timer);
	}, [value, delay]);

	return debouncedValue;
}
```

---

### 🔍 ЭТАП 7: SEO & METADATA

**Цель:** generateMetadata для ВСЕХ страниц

#### 7.1 Добавить metadata:

```typescript
// app/[locale]/album/[id]/page.tsx
import { Metadata } from "next";

export async function generateMetadata({
	params,
}: {
	params: { id: string };
}): Promise<Metadata> {
	const album = await getAlbum(params.id);

	return {
		title: `${album.name} - ${album.artist} | W-Wave`,
		description: `Listen to ${album.name} by ${album.artist}. ${album.totalTracks} tracks. Released ${album.releaseDate}.`,
		openGraph: {
			title: `${album.name} - ${album.artist}`,
			description: `${album.totalTracks} tracks • ${album.releaseDate}`,
			images: [album.imageUrl],
			type: "music.album",
		},
		twitter: {
			card: "summary_large_image",
			title: `${album.name} - ${album.artist}`,
			description: `${album.totalTracks} tracks • ${album.releaseDate}`,
			images: [album.imageUrl],
		},
	};
}

export default async function AlbumPage({
	params,
}: {
	params: { id: string };
}) {
	const album = await getAlbum(params.id);
	return <AlbumDetail album={album} />;
}
```
