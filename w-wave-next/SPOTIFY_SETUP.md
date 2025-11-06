# Spotify API Setup Guide

## Шаг 1: Создание Spotify App

1. Перейди на https://developer.spotify.com/dashboard
2. Войди под своим Spotify аккаунтом
3. Нажми "Create app"
4. Заполни:
    - App name: `W-Wave`
    - App description: `AI-powered music platform`
    - Redirect URIs: `http://localhost:3000/api/spotify/callback`
    - APIs used: `Web API`
    - Согласись с Terms of Service
5. Нажми "Save"

## Шаг 2: Получи учетные данные

1. В созданном приложении нажми "Settings"
2. Скопируй:
    - **Client ID**
    - **Client Secret** (нажми "View client secret")

## Шаг 3: Добавь в .env.local

```env
# Spotify API
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=твой_client_id
SPOTIFY_CLIENT_SECRET=твой_client_secret
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000/api/spotify/callback
```

## Scopes (что разрешаем):

-   `user-library-read` - читать лайкнутые треки
-   `user-library-modify` - лайкать/анлайкать
-   `playlist-read-private` - читать приватные плейлисты
-   `playlist-modify-public` - создавать/редактировать публичные плейлисты
-   `playlist-modify-private` - создавать/редактировать приватные плейлисты
-   `user-read-email` - получить email пользователя
-   `user-top-read` - читать топ треки/артистов (для AI анализа)

## Шаг 4: После настройки

Запусти миграцию БД для хранения токенов:

```bash
psql -h your-supabase-url -d postgres -f supabase/migrations/spotify_tokens.sql
```
