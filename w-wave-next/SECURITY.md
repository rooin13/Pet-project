# Security & Error Handling

## Архитектура обработки ошибок (соответствует ARCHITECTURE_GUIDE.md)

### 80% - API Routes (Server-side)

**Файлы:** `src/shared/lib/errors/apiErrors.ts`, `src/shared/lib/middleware/`

Все API routes используют централизованную обработку:

```typescript
import { handleApiError, ValidationError } from "@/shared/lib/errors";
import {
	validateRequestBody,
	rateLimit,
	requireAuth,
} from "@/shared/lib/middleware";

export async function POST(request: NextRequest) {
	try {
		// rate limiting
		rateLimit(request, { maxRequests: 10, windowMs: 60000 });

		// authentication
		const { user, supabase } = await requireAuth();

		// validation
		const body = await validateRequestBody(request, schema);

		// business logic...
	} catch (error) {
		const { status, body } = handleApiError(error);
		return NextResponse.json(body, { status });
	}
}
```

**Доступные классы ошибок:**

-   `ValidationError` (400) - для ошибок валидации Zod
-   `AuthError` (401) - для unauthorized
-   `ForbiddenError` (403) - для forbidden
-   `NotFoundError` (404) - для not found
-   `RateLimitError` (429) - для rate limit
-   `ExternalAPIError` (502) - для ошибок внешних API (Spotify, Gemini)

---

### 15% - RTK Query (Client-side API state)

**Файл:** `src/shared/lib/api/baseApi.ts`

Централизованная обработка ошибок в baseQuery с логированием:

```typescript
const baseQueryWithErrorHandling: BaseQueryFn = async (
	args,
	api,
	extraOptions
) => {
	const result = await baseQuery(args, api, extraOptions);

	if (result.error) {
		console.error("API Error:", {
			endpoint: typeof args === "string" ? args : args.url,
			status: result.error.status,
			data: result.error.data,
		});
		// можно добавить toast notifications
	}

	return result;
};
```

---

### 5% - Hooks (Component-level)

Хуки выбрасывают ошибки наверх для обработки в Error Boundary:

```typescript
export function useAIPlaylist() {
	const [generate, { isLoading, error }] = useGeneratePlaylistMutation();

	const handleGenerate = async (data) => {
		try {
			const result = await generate(data).unwrap();
			return result;
		} catch (err) {
			// error already handled by RTK Query
			throw err;
		}
	};

	return { handleGenerate, isLoading, error };
}
```

---

## Rate Limiting

**In-memory rate limiter** (для production используй Redis):

```typescript
rateLimit(request, {
	maxRequests: 10, // количество запросов
	windowMs: 60000, // окно в миллисекундах
});
```

**Endpoints:**

-   `/api/ai/generate-playlist` - 10 req/min
-   `/api/tracks/search` - 30 req/min (рекомендуется)
-   `/api/playlists` - 20 req/min (рекомендуется)

---

## Validation

Используется **Zod** для всех входных данных:

```typescript
import { validateRequestBody, validateQuery } from "@/shared/lib/middleware";

// body validation
const body = await validateRequestBody(request, schema);

// query params validation
const query = validateQuery(request, querySchema);
```

При ошибке валидации возвращается структурированный ответ:

```json
{
	"error": "Validation failed",
	"code": "VALIDATION_ERROR",
	"fields": {
		"prompt": ["String must contain at least 3 character(s)"],
		"useMyLikes": ["Expected boolean, received string"]
	}
}
```

---

## Authentication

Все защищенные endpoints используют Supabase Auth:

```typescript
import { requireAuth, optionalAuth } from "@/shared/lib/middleware";

// обязательная авторизация (выбрасывает AuthError)
const { user, supabase } = await requireAuth();

// опциональная авторизация (не выбрасывает ошибку)
const { user, supabase } = await optionalAuth();
```

---

## Рекомендации

1. **Никогда не показывай stack traces в production** - handleApiError скрывает детали автоматически
2. **Всегда логируй ошибки на сервере** - используй console.error или сервис логирования
3. **Используй правильные HTTP статусы** - 400 для валидации, 401 для auth, 429 для rate limit, 502 для external API
4. **Валидируй все входные данные** - используй Zod schemas
5. **Rate limit критичные endpoints** - AI generation, authentication, search
6. **Не доверяй клиенту** - вся бизнес-логика и проверки на сервере

---

## TODO для Production

-   [ ] Redis для rate limiting (вместо in-memory)
-   [ ] Error Boundary для React компонентов
-   [ ] Sentry или другой сервис для мониторинга ошибок
-   [ ] CSRF tokens для мутирующих запросов
-   [ ] Request ID для трейсинга
-   [ ] Structured logging (Winston, Pino)
