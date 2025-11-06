# 🎵 Spotify OAuth & Web Playback SDK - Полный разбор

## 📋 Краткое резюме проблемы

**Проблема:** Spotify Web Playback SDK отказывался работать с ошибкой `Invalid token scopes`, даже когда скоупы были правильно запрошены.

**Решение:** Нужно было включить **Web Playback SDK** в настройках приложения Spotify Dashboard (секция "Which API/SDKs are you planning to use?").

**Время на решение:** ~2 часа (можно было сократить до 15 минут с правильным подходом к дебагу).

---

## 🔍 Хронология: Что произошло

### 1. Начальная проблема (04:11)

```
Spotify Player auth error: Invalid token scopes.
GET /v1/melody/v1/check_scope?scope=web-playback 403 Forbidden
```

**Что мы думали:** Скоупы не запрашиваются или не сохраняются.

**Что делали:**

-   Добавили `streaming` скоуп в `auth/route.ts` ✅
-   Добавили `show_dialog: "true"` для принудительного переподключения ✅
-   Множество логов для отслеживания flow

**Проблема:** Скоупы запрашивались, но Spotify их НЕ давал.

---

### 2. Debugging Токенов (04:20-04:30)

**Добавили логирование:**

```typescript
// src/app/api/spotify/callback/route.ts
console.log("📋 Token scopes:", tokens.scope); // ЧТО ВЕРНУЛ Spotify
console.log("💾 Inserting new tokens with scope:", tokens.scope); // ЧТО сохраняем

// src/shared/lib/spotify/tokens.ts
console.log("📋 Token scope from DB:", tokens.scope); // ЧТО читаем из БД
console.log("🔑 Returning token (first 50 chars):", token.substring(0, 50));
```

**Результат логов:**

```
📋 Token scopes: playlist-read-private streaming user-modify-playback-state ...
💾 Inserting new tokens with scope: ... streaming ...
📋 Token scope from DB: ... streaming ...
```

**Вывод:** Скоупы ЕСТЬ в токене и БД! НО SDK все равно выдает 403!

---

### 3. Проблема с дубликатами в БД (04:32)

**Ошибка:**

```
❌ DB error fetching tokens: Cannot coerce the result to a single JSON object
```

**Причина:** В таблице `spotify_tokens` было несколько записей для одного `user_id`.

**Решение:**

```typescript
// Заменили upsert на delete + insert
const { error: deleteError } = await supabase
    .from("spotify_tokens")
    .delete()
    .eq("user_id", user.id);

const { error: dbError } = await supabase
    .from("spotify_tokens")
    .insert({ user_id, access_token, ... });
```

---

### 4. ГЛАВНАЯ ОШИБКА: Настройки Spotify Dashboard (04:48)

**Пользователь сказал:**

> "у меня не был указан Web Playback SDK в Which API/SDKs are you planning to use?"

**ВОТ ЭТО БЫЛО ПРОБЛЕМОЙ!**

Spotify Dashboard → App Settings → **Which API/SDKs are you planning to use?**

-   ✅ Web API
-   ❌ **Web Playback SDK** ← НЕ БЫЛО ОТМЕЧЕНО!

**Без этой галочки Spotify НИКОГДА не даст скоуп `streaming`**, даже если его запрашивать!

**После включения:**

```
✅ Spotify Player initialized successfully
🎧 SDK Status: {useSpotifySDK: true, isSpotifyReady: true, hasToken: true}
```

---

### 5. Новая проблема: Device not found (04:51)

```
PUT /v1/me/player/play?device_id=... 404 Not Found
Failed to play track: Error: Device not found
```

**Причина:** Web Playback SDK создает виртуальное устройство, но оно **не активируется** автоматически в Spotify.

**Решение:** Transfer playback на устройство перед началом воспроизведения:

```typescript
// Активируем устройство
await fetch("https://api.spotify.com/v1/me/player", {
	method: "PUT",
	body: JSON.stringify({
		device_ids: [deviceId],
		play: false,
	}),
});

// Подождем 300ms
await new Promise((resolve) => setTimeout(resolve, 300));

// Теперь играем трек
await fetch(`/v1/me/player/play?device_id=${deviceId}`, {
	method: "PUT",
	body: JSON.stringify({ uris: [trackUri] }),
});
```

---

## 🧠 Как работает Spotify OAuth 2.0 (Computer Science)

### Архитектура OAuth 2.0 Authorization Code Flow

```
┌─────────┐                                           ┌──────────┐
│ Browser │                                           │  Spotify │
│ (User)  │                                           │   API    │
└────┬────┘                                           └────┬─────┘
     │                                                      │
     │  1. Click "Connect Spotify"                         │
     │────────────────────────────────────────────────────►│
     │                                                      │
     │  2. GET /api/spotify/auth                           │
     │     (наш Next.js API route)                         │
     │◄────────────────────────────────────────────────────│
     │                                                      │
     │  3. Redirect to Spotify authorization               │
     │     https://accounts.spotify.com/authorize?         │
     │     client_id=...&                                   │
     │     redirect_uri=.../callback&                      │
     │     scope=streaming user-library-read&              │
     │     response_type=code                              │
     │────────────────────────────────────────────────────►│
     │                                                      │
     │  4. User logs in & approves permissions             │
     │     (Spotify UI)                                     │
     │                                                      │
     │  5. Redirect back with CODE                         │
     │     /api/spotify/callback?code=AQC...               │
     │◄────────────────────────────────────────────────────│
     │                                                      │
     │  6. Exchange CODE for ACCESS_TOKEN                  │
     │     POST /api/token                                 │
     │     { grant_type: "authorization_code",             │
     │       code: "...", redirect_uri: "..." }            │
     │────────────────────────────────────────────────────►│
     │                                                      │
     │  7. Response with tokens                            │
     │     { access_token, refresh_token, scope }          │
     │◄────────────────────────────────────────────────────│
     │                                                      │
     │  8. Save tokens to Supabase                         │
     │     (server-side, secure)                           │
     │                                                      │
     │  9. Frontend gets token via /api/spotify/token      │
     │                                                      │
     │ 10. Initialize Spotify Web Playback SDK             │
     │     new Spotify.Player({ getOAuthToken: ... })      │
     │                                                      │
     │ 11. SDK internally checks scopes                    │
     │     GET /v1/melody/v1/check_scope?scope=web-playback│
     │────────────────────────────────────────────────────►│
     │                                                      │
     │ 12. 200 OK (if scopes valid) or 403 (if not)       │
     │◄────────────────────────────────────────────────────│
```

---

## 🔑 Ключевые концепции

### 1. **Authorization Code** (одноразовый)

-   Выдается Spotify после одобрения пользователя
-   Живет ~10 минут
-   Можно использовать ОДИН РАЗ для получения токенов
-   **НИКОГДА не хранить!** Сразу обменять на токены

### 2. **Access Token** (краткосрочный)

-   Живет **1 час** (3600 секунд)
-   Используется для ВСЕХ запросов к Spotify API
-   Передается в header: `Authorization: Bearer ${access_token}`
-   После истечения **НЕЛЬЗЯ** использовать - нужен refresh

### 3. **Refresh Token** (долгосрочный)

-   Живет **ВЕЧНО** (пока пользователь не отзовет доступ)
-   Используется для получения НОВЫХ access_token
-   **КРИТИЧНО:** Хранить БЕЗОПАСНО (server-side only!)

### 4. **Scopes** (разрешения)

-   Определяют ЧТО может делать приложение
-   Запрашиваются при авторизации
-   **ВАЖНО:** Возвращаются в токене от Spotify
-   **НЕ МОЖЕМ** изменить после выдачи - нужно переподключение

---

## 🚨 Где мы затупили и как надо было

### ❌ ОШИБКА #1: Не проверили настройки Spotify Dashboard СРАЗУ

**Что делали:**

-   1.5 часа дебажили токены, скоупы, редиректы
-   Проверяли БД, логи, код

**Что НАДО было:**

1. **ПЕРВЫМ ДЕЛОМ** проверить Spotify Dashboard:

    - ✅ Redirect URI правильный?
    - ✅ Web Playback SDK включен?
    - ✅ App в режиме Development/Production?

2. Проверить через **curl/Postman** что Spotify ДЕЙСТВИТЕЛЬНО дает `streaming` скоуп:

```bash
# Получить код вручную через браузер
# Обменять на токен
curl -X POST "https://accounts.spotify.com/api/token" \
  -H "Authorization: Basic BASE64(client_id:client_secret)" \
  -d "grant_type=authorization_code&code=...&redirect_uri=..."

# Посмотреть scope в ответе
```

**Экономия времени:** 1.5 часа → 10 минут

---

### ❌ ОШИБКА #2: Слишком много логов БЕЗ структуры

**Что делали:**

-   Добавляли логи везде подряд
-   Логи дублировались
-   Сложно найти нужную информацию

**Что НАДО было:**

1. Создать **ОДИН центральный лог** для OAuth flow:

```typescript
// src/lib/debug/spotify-oauth-logger.ts
export function logOAuthFlow(step: string, data: any) {
	console.log(`🔐 [OAuth ${step}]`, JSON.stringify(data, null, 2));
}

// Использовать:
logOAuthFlow("AUTH_REQUEST", { scopes, redirectUri });
logOAuthFlow("CALLBACK_RECEIVED", { code: code?.substring(0, 20) });
logOAuthFlow("TOKENS_RECEIVED", { scope: tokens.scope, expires_in });
logOAuthFlow("TOKENS_SAVED", { user_id, scope });
```

2. **Группировать логи** по flow:

```
🔐 [OAuth AUTH_REQUEST] → 🔐 [OAuth CALLBACK_RECEIVED] → 🔐 [OAuth TOKENS_RECEIVED]
```

**Экономия времени:** Легче читать логи, находить проблему за 5 минут вместо 30.

---

### ❌ ОШИБКА #3: Не использовали Spotify Web Console

**Что делали:**

-   Дебажили через логи сервера
-   Гадали что возвращает Spotify

**Что НАДО было:**

1. Открыть https://developer.spotify.com/console/
2. Проверить:

    - Get User's Profile (проверить что токен работает)
    - Get Playback State (проверить скоупы)
    - Start/Resume Playback (проверить `streaming`)

3. Сравнить **scope в токене** с **требуемыми скоупами** для Web Playback SDK

**Экономия времени:** 30 минут → 5 минут

---

## 📚 Как работает OAuth 2.0 (Глубокое понимание)

### Зачем нужен OAuth?

**Проблема без OAuth:**

```
User: "Хочу подключить Spotify к W-Wave"
W-Wave: "Дай мне свой логин и пароль от Spotify"
User: 😱 "Что?? Нет!"
```

**С OAuth:**

```
User: "Хочу подключить Spotify"
W-Wave: "Окей, я перенаправлю тебя на Spotify, там ты разрешишь мне доступ"
User: *переходит на Spotify, логинится*
Spotify: "W-Wave хочет читать твои плейлисты и управлять плеером. Разрешить?"
User: "Да" ✅
Spotify: *дает W-Wave специальный ключ (token)*
W-Wave: *использует ключ для API запросов*
```

**Безопасность:**

-   W-Wave **НИКОГДА** не видит пароль пользователя
-   Пользователь может **ОТОЗВАТЬ** доступ в любой момент
-   Token **ограничен по времени** и **по разрешениям** (scopes)

---

### Authorization Code Flow - Пошагово

#### Step 1: Authorization Request (GET /authorize)

**Frontend:**

```typescript
// User clicks "Connect Spotify"
window.location.href = "/api/spotify/auth";
```

**Backend (Next.js API Route):**

```typescript
// src/app/api/spotify/auth/route.ts
const params = new URLSearchParams({
	client_id: "YOUR_CLIENT_ID",
	response_type: "code", // Просим CODE
	redirect_uri: "https://yourapp.com/api/spotify/callback",
	scope: "streaming user-library-read", // ЧТО хотим
	state: "random_csrf_token", // Защита от CSRF
	show_dialog: "true", // Показать диалог (опционально)
});

return redirect(`https://accounts.spotify.com/authorize?${params}`);
```

**Что происходит:**

-   Браузер перенаправляется на **accounts.spotify.com**
-   Пользователь видит **Spotify Login Page**
-   После логина - **Consent Screen** (разрешения)

---

#### Step 2: User Grants Permission

**Spotify UI показывает:**

```
w-wave wants to:
✅ Read your library
✅ Stream music on your devices
✅ Control playback

[AGREE] [CANCEL]
```

**Если User нажимает AGREE:**

-   Spotify проверяет **какие скоупы РАЗРЕШЕНЫ** для этого приложения (в Dashboard)
-   Если `streaming` НЕ включен в Dashboard → **НЕ ДАСТ** этот скоуп!
-   Генерирует одноразовый **authorization code**

---

#### Step 3: Callback with Code

**Spotify редиректит обратно:**

```
GET https://yourapp.com/api/spotify/callback?code=AQC...xyz&state=abc123
```

**Важно:**

-   `code` - одноразовый, живет ~10 минут
-   `state` - должен совпадать с тем что мы отправили (CSRF protection)

**Backend получает:**

```typescript
// src/app/api/spotify/callback/route.ts
const code = searchParams.get("code");
const state = searchParams.get("state");

// Проверка state (опционально, но РЕКОМЕНДУЕТСЯ)
if (state !== savedState) {
	throw new Error("CSRF attack detected");
}
```

---

#### Step 4: Exchange Code for Tokens

**Backend делает POST запрос:**

```typescript
const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${base64(client_id:client_secret)}`,
    },
    body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code, // Одноразовый код
        redirect_uri: redirect_uri, // ДОЛЖЕН совпадать с тем что в authorize!
    }),
});

const tokens = await response.json();
// {
//   access_token: "BQD...",
//   token_type: "Bearer",
//   expires_in: 3600,
//   refresh_token: "AQB...",
//   scope: "streaming user-library-read" // ЧТО РЕАЛЬНО ДАЛИ
// }
```

**КРИТИЧНО:**

-   `redirect_uri` должен **ТОЧНО** совпадать с тем что был в `/authorize`
-   `client_id:client_secret` - Base64 encoded
-   **ПРОВЕРИТЬ `scope` В ОТВЕТЕ!** Там то что **РЕАЛЬНО** дал Spotify!

---

#### Step 5: Save Tokens (Securely!)

**❌ НИКОГДА не хранить токены на frontend!**

```typescript
// ❌ ПЛОХО
localStorage.setItem("spotify_token", access_token); // УЯЗВИМОСТЬ!
```

**✅ ПРАВИЛЬНО - server-side (Supabase, БД):**

```typescript
await supabase.from("spotify_tokens").insert({
	user_id: user.id,
	access_token: tokens.access_token,
	refresh_token: tokens.refresh_token,
	expires_at: new Date(Date.now() + tokens.expires_in * 1000),
	scope: tokens.scope, // ВАЖНО! Сохраняем скоупы
});
```

**Почему так:**

-   Токены = ключи к аккаунту пользователя
-   XSS атака может украсть токен из localStorage
-   Server-side - безопасно, frontend только запрашивает через API

---

#### Step 6: Use Access Token

**Frontend запрашивает токен:**

```typescript
const response = await fetch("/api/spotify/token");
const { token } = await response.json();

// Инициализируем SDK
const player = new Spotify.Player({
	name: "W-Wave",
	getOAuthToken: (cb) => cb(token),
});
```

**Backend (/api/spotify/token):**

```typescript
// Получаем токен из БД
const { data: tokens } = await supabase
	.from("spotify_tokens")
	.select("*")
	.eq("user_id", user.id)
	.single();

// Проверяем не истек ли
if (new Date(tokens.expires_at) < new Date()) {
	// ИСТЕК! Нужен refresh
	return await refreshToken(tokens.refresh_token);
}

return { token: tokens.access_token };
```

---

#### Step 7: Refresh Token

**Когда access_token истек:**

```typescript
async function refreshToken(refresh_token: string) {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Authorization": `Basic ${base64(client_id:client_secret)}`,
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refresh_token,
        }),
    });

    const tokens = await response.json();
    // {
    //   access_token: "новый токен",
    //   expires_in: 3600,
    //   refresh_token: "может быть новый или старый"
    // }

    // Обновляем в БД
    await supabase.from("spotify_tokens").update({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || refresh_token,
        expires_at: new Date(Date.now() + 3600 * 1000),
    });

    return tokens.access_token;
}
```

**Важно:**

-   Refresh token НЕ истекает (unless revoked)
-   Можно получать новые access_token БЕСКОНЕЧНО
-   Spotify **может** вернуть новый refresh_token (но не обязан)

---

## 🎯 Scopes - Что это и как работает

### Что такое Scope?

**Scope = Permission = Разрешение**

```typescript
scope: "user-library-read user-library-modify streaming";
```

Это как:

```
User: "Я разрешаю W-Wave:
✅ Читать мои лайкнутые треки (user-library-read)
✅ Лайкать треки от моего имени (user-library-modify)
✅ Играть музыку на моих устройствах (streaming)"
```

### Критичные Scopes для Web Playback SDK

```typescript
// ОБЯЗАТЕЛЬНЫЕ для SDK:
"streaming"; // Без этого SDK НЕ РАБОТАЕТ вообще
"user-read-playback-state"; // Читать что играет
"user-modify-playback-state"; // Управлять (play/pause/skip)

// РЕКОМЕНДУЕМЫЕ:
"user-read-private"; // Проверить Premium (SDK требует Premium!)
"user-read-email"; // Для идентификации пользователя
```

### Как Spotify проверяет scopes

**При инициализации SDK:**

```javascript
// Web Playback SDK делает ВНУТРЕННИЙ запрос:
GET https://api.spotify.com/v1/melody/v1/check_scope?scope=web-playback
Authorization: Bearer YOUR_ACCESS_TOKEN

// Ответы:
200 OK → скоуп есть, SDK работает ✅
403 Forbidden → скоупа НЕТ, SDK НЕ РАБОТАЕТ ❌
```

**Spotify НЕ ДАСТ скоуп если:**

1. ❌ Скоуп не запрошен в `/authorize`
2. ❌ **Скоуп не включен в Dashboard** ← НАША ПРОБЛЕМА!
3. ❌ У пользователя нет Premium (для `streaming`)
4. ❌ Приложение не одобрено для этого скоупа

---

## 🔧 Правильный подход к дебагу Spotify OAuth

### Чеклист при ошибке "Invalid token scopes"

```
✅ 1. Проверить Spotify Dashboard
   - App Settings → Which API/SDKs → Web Playback SDK отмечен?
   - Redirect URIs → URL точно совпадает?
   - Quota mode → Development/Extended?

✅ 2. Проверить что запрашиваем правильные scopes
   - src/app/api/spotify/auth/route.ts
   - scope: "streaming user-read-playback-state ..."

✅ 3. Проверить ЧТО ВЕРНУЛ Spotify при callback
   - console.log("Token scopes:", tokens.scope)
   - Есть ли там "streaming"?

✅ 4. Проверить что сохранили в БД
   - SELECT scope FROM spotify_tokens WHERE user_id = '...'
   - Совпадает с тем что вернул Spotify?

✅ 5. Проверить что отдаем frontend
   - /api/spotify/token → console.log(token)
   - Это тот же токен что в БД?

✅ 6. Проверить Premium статус
   - GET /v1/me
   - { "product": "premium" } ← ОБЯЗАТЕЛЬНО для streaming!

✅ 7. Проверить Redirect URI совпадение
   - Dashboard: https://app.com/api/spotify/callback
   - .env: NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=https://app.com/api/spotify/callback
   - ДОЛЖНЫ БЫТЬ ИДЕНТИЧНЫ (даже http/https, trailing slash)!
```

---

### Инструменты для быстрого дебага

#### 1. **Spotify Web Console**

https://developer.spotify.com/console/

-   Проверить что токен работает
-   Посмотреть какие скоупы у токена
-   Протестировать API endpoints

#### 2. **JWT Decoder** (для access_token)

https://jwt.io/

**НО:** Spotify Access Token **НЕ JWT**! Это opaque token.
Нельзя декодировать и посмотреть скоупы.

**Решение:** Использовать `/v1/me` endpoint:

```bash
curl https://api.spotify.com/v1/me \
  -H "Authorization: Bearer YOUR_TOKEN"

# Ответ покажет:
# - product: "premium" / "free"
# - email, display_name, etc.
```

#### 3. **curl для проверки scope**

```bash
# Попробовать использовать streaming endpoint
curl -X PUT "https://api.spotify.com/v1/me/player/play" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"uris":["spotify:track:..."]}'

# Если 403 → скоупов нет
# Если 404 → скоупы есть, но device не найден
# Если 204 → ВСЕ РАБОТАЕТ! ✅
```

---

## 🎓 Computer Science концепции

### 1. **OAuth 2.0 - Delegation Pattern**

**Паттерн делегирования доступа:**

```
User owns Resource (Spotify Library)
         ↓
User delegates access to Application (W-Wave)
         ↓
Application acts on behalf of User
```

**Ключевые роли:**

-   **Resource Owner** - Пользователь (владеет данными в Spotify)
-   **Client** - W-Wave (хочет доступ к данным)
-   **Authorization Server** - Spotify Auth (выдает токены)
-   **Resource Server** - Spotify API (отдает данные)

---

### 2. **State Management для OAuth**

**Проблема:** Асинхронность, редиректы, потеря контекста

**Решение - State Machine:**

```typescript
enum OAuthState {
	IDLE, // Не подключен
	AUTH_REQUESTED, // Перенаправлен на Spotify
	CODE_RECEIVED, // Вернулись с кодом
	EXCHANGING, // Меняем код на токены
	CONNECTED, // Токены сохранены
	ERROR, // Ошибка
}

// В Redux/Zustand:
const [oauthState, setOAuthState] = useState<OAuthState>(OAuthState.IDLE);
```

---

### 3. **Security Best Practices**

#### ✅ DO:

```typescript
// 1. Токены ТОЛЬКО на backend
await supabase.from("spotify_tokens").insert({...}); // ✅ Server-side

// 2. CSRF protection
const state = crypto.randomUUID();
await redis.set(`oauth:state:${state}`, user.id, "EX", 600);

// 3. Проверка redirect_uri
if (redirect_uri !== process.env.SPOTIFY_REDIRECT_URI) {
    throw new Error("Invalid redirect_uri");
}

// 4. HTTPS ONLY в production
if (process.env.NODE_ENV === "production" && !request.url.startsWith("https")) {
    throw new Error("HTTPS required");
}
```

#### ❌ DON'T:

```typescript
// ❌ Токены в localStorage
localStorage.setItem("token", access_token);

// ❌ Client_secret на frontend
const clientSecret = "abc123"; // EXPOSED!

// ❌ Токен в URL
redirect(`/dashboard?token=${access_token}`); // Leaked in logs!

// ❌ Игнорировать state
// CSRF attack возможен!
```

---

## 🚀 Web Playback SDK - Как работает

### Архитектура

```
Browser (Your App)                    Spotify Servers
     │                                       │
     │  1. new Spotify.Player({              │
     │      getOAuthToken: cb => cb(token)   │
     │  })                                    │
     │──────────────────────────────────────►│
     │                                        │
     │  2. SDK проверяет token                │
     │     GET /v1/melody/v1/check_scope     │
     │──────────────────────────────────────►│
     │                                        │
     │  3. 200 OK (if scopes valid)          │
     │◄──────────────────────────────────────│
     │                                        │
     │  4. player.connect()                   │
     │     (создает WebSocket соединение)    │
     │◄═════════════════════════════════════►│
     │         WebSocket OPENED               │
     │                                        │
     │  5. "ready" event with device_id      │
     │◄──────────────────────────────────────│
     │                                        │
     │  6. PUT /v1/me/player/play             │
     │     { device_ids: [device_id] }       │
     │     (активировать устройство)          │
     │──────────────────────────────────────►│
     │                                        │
     │  7. PUT /v1/me/player/play?device_id  │
     │     { uris: ["spotify:track:..."] }   │
     │──────────────────────────────────────►│
     │                                        │
     │  8. Audio streaming via WebSocket     │
     │◄═════════════════════════════════════►│
     │      🎵 MUSIC PLAYS! 🎵                │
```

### Почему device_id не находится?

**Проблема:**

```
PUT /v1/me/player/play?device_id=xxx
404 Not Found - "Device not found"
```

**Причина:**

-   SDK создает **виртуальное устройство**
-   Spotify его регистрирует
-   НО! Устройство **НЕ АКТИВНО** по умолчанию

**Решение - Transfer Playback:**

```typescript
// 1. Активировать устройство
await fetch("https://api.spotify.com/v1/me/player", {
	method: "PUT",
	body: JSON.stringify({
		device_ids: [device_id], // Наше SDK устройство
		play: false, // Не играть сразу
	}),
});

// 2. Подождать (устройство активируется асинхронно)
await sleep(300);

// 3. ТЕПЕРЬ играть
await fetch(`/v1/me/player/play?device_id=${device_id}`, {
	method: "PUT",
	body: JSON.stringify({ uris: ["spotify:track:xxx"] }),
});
```

---

## 📖 Lessons Learned

### 1. **Read The Fucking Manual First**

Spotify документация **ЯВНО** говорит:

> To use Web Playback SDK, enable it in your app settings.

**Мы потратили 1.5 часа**, не прочитав это.

**Урок:** При интеграции нового API/SDK - **СНАЧАЛА** полностью прочитать Quick Start Guide.

---

### 2. **Проверяй внешние зависимости ПЕРВЫМ ДЕЛОМ**

**Порядок дебага:**

1. ✅ **Внешние сервисы** (Dashboard, настройки)
2. ✅ **Переменные окружения** (.env, Vercel)
3. ✅ **Network запросы** (что отправляем/получаем)
4. ✅ **Код** (логика)

**Мы делали:**

1. ❌ Код
2. ❌ Логи
3. ❌ БД
4. ✅ Dashboard (ПОСЛЕДНИМ!)

**Результат:** Потеря времени.

---

### 3. **Structured Logging > Console.log Spam**

**❌ Плохо:**

```typescript
console.log("получили токен");
console.log("токен:", token);
console.log("скоупы:", scope);
console.log("сохранили");
```

**✅ Хорошо:**

```typescript
logger.oauth({
	step: "TOKEN_EXCHANGE_SUCCESS",
	data: { scope, expires_in },
	timestamp: Date.now(),
});
```

**Преимущества:**

-   Структурированные данные
-   Легко фильтровать
-   Можно отправлять в Sentry/LogRocket
-   Производственный код не засирается логами

---

### 4. **Test Incrementally**

**❌ Что мы делали:**

```
1. Добавили весь OAuth flow
2. Добавили Web Playback SDK
3. Добавили UI
4. Задеплоили
5. "Почему не работает???" 😱
```

**✅ Правильно:**

```
1. OAuth flow → TEST → ✅ Токен получен
2. Сохранение в БД → TEST → ✅ Токен в БД
3. /api/spotify/token → TEST → ✅ Frontend получает токен
4. SDK initialization → TEST → ✅ Device ID создан
5. Transfer playback → TEST → ✅ Device активен
6. Play track → TEST → ✅ Трек играет
```

**Каждый шаг проверяем ОТДЕЛЬНО!**

---

## 🛠️ Production-Ready OAuth Implementation

### Обработка ошибок

```typescript
// src/app/api/spotify/callback/route.ts
export async function GET(request: NextRequest) {
    try {
        const code = searchParams.get("code");
        const error = searchParams.get("error");

        // Error from Spotify
        if (error) {
            return redirect(`/?error=spotify_${error}`);
        }

        // Exchange code for tokens
        const tokenResponse = await fetch(...);

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json();
            console.error("[OAuth] Token exchange failed:", errorData);

            // Логируем в Sentry
            Sentry.captureException(new Error("Spotify token exchange failed"), {
                extra: { error: errorData, code: code?.substring(0, 10) }
            });

            return redirect("/?error=token_exchange_failed");
        }

        const tokens = await tokenResponse.json();

        // Validate scopes
        const requiredScopes = ["streaming", "user-library-read"];
        const receivedScopes = tokens.scope.split(" ");
        const hasAllScopes = requiredScopes.every(s => receivedScopes.includes(s));

        if (!hasAllScopes) {
            console.error("[OAuth] Missing required scopes!");
            console.error("Required:", requiredScopes);
            console.error("Received:", receivedScopes);

            return redirect("/?error=insufficient_scopes");
        }

        // Save tokens...

    } catch (error) {
        console.error("[OAuth] Unexpected error:", error);
        Sentry.captureException(error);
        return redirect("/?error=unexpected");
    }
}
```

---

### Rate Limiting & Retry Logic

```typescript
// Spotify API имеет rate limits
// 429 Too Many Requests → retry after X seconds

async function fetchWithRetry(url: string, options: any, maxRetries = 3) {
	for (let i = 0; i < maxRetries; i++) {
		const response = await fetch(url, options);

		if (response.status === 429) {
			const retryAfter = response.headers.get("Retry-After") || "5";
			console.warn(`Rate limited, waiting ${retryAfter}s`);
			await sleep(parseInt(retryAfter) * 1000);
			continue;
		}

		return response;
	}

	throw new Error("Max retries exceeded");
}
```

---

### Token Refresh Strategy

```typescript
// Проактивное обновление (ДО истечения)
async function getValidToken(userId: string) {
	const tokens = await db.getTokens(userId);

	const expiresAt = new Date(tokens.expires_at);
	const now = new Date();

	// Обновляем ЗАРАНЕЕ (за 5 минут до истечения)
	const fiveMinutes = 5 * 60 * 1000;

	if (expiresAt.getTime() - now.getTime() < fiveMinutes) {
		console.log("Token expires soon, refreshing proactively");
		return await refreshToken(tokens.refresh_token);
	}

	return tokens.access_token;
}
```

---

## 📊 Метрики и мониторинг

### Что логировать в production

```typescript
// Success rate
analytics.track("spotify_connection_success", {
	user_id,
	scopes: tokens.scope,
	timestamp: Date.now(),
});

// Failures
analytics.track("spotify_connection_failed", {
	user_id,
	error: "invalid_scopes",
	requested_scopes: scopes,
	received_scopes: tokens.scope,
});

// Performance
analytics.track("oauth_flow_duration", {
	duration_ms: Date.now() - startTime,
	steps: ["auth", "callback", "token_exchange", "db_save"],
});
```

### Важные метрики

```typescript
// 1. OAuth Success Rate
const successRate = successful_connections / total_attempts;
// Цель: > 95%

// 2. Token Refresh Success Rate
const refreshRate = successful_refreshes / total_refreshes;
// Цель: > 99%

// 3. Scope Grant Rate
const scopeGrantRate = users_with_streaming / total_connected_users;
// Если < 90% → проблема в Dashboard settings!

// 4. Average OAuth Flow Duration
// Цель: < 5 секунд от click до saved tokens
```

---

## 🎯 Итоговые рекомендации

### Quick Debug Protocol

**При ошибке OAuth - делай В ЭТОМ ПОРЯДКЕ:**

```bash
# 1. Проверь Dashboard (30 секунд)
→ Spotify Developer Dashboard → App Settings
→ Web Playback SDK отмечен? ✅
→ Redirect URI совпадает? ✅

# 2. Проверь переменные окружения (30 секунд)
→ Vercel → Settings → Environment Variables
→ NEXT_PUBLIC_SPOTIFY_REDIRECT_URI совпадает с Dashboard? ✅
→ GEMINI_API_KEY есть? ✅

# 3. Проверь что Spotify ДЕЙСТВИТЕЛЬНО дал скоупы (2 минуты)
→ Запусти vercel logs
→ Найди "📋 Token scopes: ..."
→ Есть "streaming"? ✅

# 4. Проверь Premium (30 секунд)
→ https://www.spotify.com/account/overview
→ Premium Family? ✅

# 5. ТОЛЬКО ПОТОМ дебажь код
```

**Экономия:** 2 часа → 10 минут

---

### Архитектура для масштабирования

```typescript
// src/lib/oauth/spotify.ts
export class SpotifyOAuthManager {
	async startAuthFlow(userId: string) {
		const state = await this.createState(userId);
		const authUrl = this.buildAuthUrl(state);
		return authUrl;
	}

	async handleCallback(code: string, state: string) {
		await this.validateState(state);
		const tokens = await this.exchangeCode(code);
		await this.validateScopes(tokens.scope);
		await this.saveTokens(tokens);
		return tokens;
	}

	async getValidToken(userId: string) {
		const tokens = await this.getTokens(userId);
		if (this.isExpired(tokens)) {
			return await this.refreshToken(tokens.refresh_token);
		}
		return tokens.access_token;
	}
}
```

**Преимущества:**

-   Все OAuth логика в одном месте
-   Легко тестировать
-   Легко добавить другие провайдеры (Apple Music, YouTube Music)

---

## 🎉 Финальный чеклист для следующего раза

```
□ 1. RTFM - прочитать Quick Start целиком
□ 2. Проверить Dashboard настройки ПЕРВЫМ
□ 3. Проверить .env переменные
□ 4. Тестировать каждый шаг ОТДЕЛЬНО
□ 5. Логировать структурированно
□ 6. Использовать Spotify Console для тестов
□ 7. Проверять что Spotify ВЕРНУЛ (не что мы запросили!)
□ 8. При 403 → Dashboard, при 404 → код, при 500 → Spotify down
□ 9. Читать error.message от Spotify (там часто вся инфа!)
□ 10. Гуглить ТОЧНУЮ ошибку ("Invalid token scopes Spotify SDK")
```

---

## 🔗 Полезные ссылки

-   **Spotify OAuth Guide:** https://developer.spotify.com/documentation/web-api/concepts/authorization
-   **Web Playback SDK:** https://developer.spotify.com/documentation/web-playback-sdk
-   **Scopes Reference:** https://developer.spotify.com/documentation/web-api/concepts/scopes
-   **API Console (для тестов):** https://developer.spotify.com/console/
-   **OAuth 2.0 RFC:** https://datatracker.ietf.org/doc/html/rfc6749

---

**Создано:** 2025-11-03  
**Проект:** W-Wave Music Platform  
**Проблема:** Spotify Web Playback SDK Integration  
**Время на решение:** 2 часа (можно было 15 минут)  
**Главный урок:** Проверяй Dashboard настройки ПЕРВЫМ! 🎯
