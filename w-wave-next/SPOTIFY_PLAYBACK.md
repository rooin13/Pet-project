# Spotify Web Playback SDK Setup

## Что это дает?

✅ **Полные треки** вместо 30-секундных preview
✅ **Контроль плеера** (play, pause, seek, volume)
✅ **Синхронизация** со всеми Spotify устройствами
✅ **Очередь треков** и автоплей

## Требования

-   ✅ Spotify Premium аккаунт
-   ✅ OAuth авторизация с scope `streaming`
-   ✅ Access token пользователя

## Как это работает

```
┌─────────────┐
│  Browser    │
└──────┬──────┘
       │ 1. Загружаем SDK
       ▼
┌─────────────────────┐
│ Spotify SDK Script  │
│ sdk.scdn.co         │
└──────┬──────────────┘
       │ 2. Инициализируем плеер
       ▼
┌─────────────────┐
│ Spotify Player  │ ◄─── Device ID создается
│ (Web Playback)  │
└──────┬──────────┘
       │ 3. Play track
       ▼
┌─────────────────┐
│  Spotify API    │
│  PUT /me/player │
│  /play          │
└──────┬──────────┘
       │ 4. Стримит полный трек
       ▼
┌─────────────────┐
│   Speakers 🔊   │
└─────────────────┘
```

## Текущая реализация

### Гибридный режим:

**Если Spotify подключен:**

-   ✅ Используется Web Playback SDK
-   ✅ Полные треки
-   ✅ Premium качество

**Если Spotify не подключен:**

-   ⚠️ Fallback на HTML5 Audio
-   ⚠️ Только preview URLs (30 сек)
-   ⚠️ Не все треки имеют preview

## Что нужно сделать

### 1. Подключить Spotify (в профиле)

Нажми "Connect Spotify" → авторизуйся → получишь токен

### 2. Миграция БД

Запусти в Supabase SQL Editor:

```sql
-- Уже есть в supabase/migrations/spotify_tokens.sql
```

### 3. Environment Variables в Vercel

```env
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=xxx
SPOTIFY_CLIENT_SECRET=xxx
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=https://домен.vercel.app/api/spotify/callback
```

### 4. Обновить Spotify App Settings

В Spotify Developer Dashboard добавь:

```
Redirect URIs:
- http://localhost:3000/api/spotify/callback
- https://твой-домен.vercel.app/api/spotify/callback
```

## Проверка

Открой консоль браузера:

-   ✅ `Spotify Player ready with Device ID: xxx` - Web Playback работает
-   ⚠️ `Spotify not connected, using HTML5 Audio` - только preview

## Важно!

**Preview URLs могут быть null** для некоторых треков (особенно новых или региональных).
Поэтому лучше подключить Spotify OAuth для полного доступа ко всем трекам.

## API Endpoints

-   `GET /api/spotify/token` - получить access token
-   `POST /api/spotify/play` - воспроизвести трек
-   `GET /api/spotify/status` - проверить подключение
-   `POST /api/spotify/disconnect` - отключить
