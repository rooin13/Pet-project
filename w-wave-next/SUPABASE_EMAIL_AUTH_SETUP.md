# 📧 Supabase Email Authentication Setup Guide

## Быстрая настройка для регистрации через email с подтверждением

### 1️⃣ Настройка Supabase Dashboard

1. **Открой проект в Supabase Dashboard**

    - https://supabase.com/dashboard/project/YOUR_PROJECT_ID

2. **Authentication → Providers**

    - ✅ Включи **Email** provider
    - Выбери режим:
        - **"Require email confirmation"** (рекомендуется для продакшена)
        - Или "Disable email confirmation" (только для теста!)

3. **Authentication → URL Configuration**

    - **Site URL**: `https://w-wave-next.vercel.app`
    - **Redirect URLs** (Add URL):
        ```
        https://w-wave-next.vercel.app/auth/callback
        http://localhost:3000/auth/callback
        ```

4. **Authentication → Email Templates**
    - Проверь шаблон **"Confirm signup"**
    - Убедись, что ссылка ведет на: `{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email`

---

### 2️⃣ Настройка SMTP (обязательно для продакшена!)

По умолчанию Supabase использует свой SMTP (ограничен 3-4 письмами/час).

**Для продакшена настрой свой SMTP:**

1. **Authentication → Email Settings**
2. Нажми **"Enable Custom SMTP"**
3. Заполни:
    ```
    SMTP Host: smtp.gmail.com (или Resend, SendGrid, Mailgun)
    SMTP Port: 587
    SMTP User: your-email@gmail.com
    SMTP Password: your-app-password
    SMTP Sender Email: noreply@yourapp.com
    SMTP Sender Name: W-Wave
    ```

**Рекомендуемые провайдеры:**

-   **Resend** (бесплатно 3000 писем/месяц, для разработчиков)
-   **SendGrid** (бесплатно 100 писем/день)
-   **Gmail** (для теста, нужен App Password)

---

### 3️⃣ Переменные окружения в Vercel

Добавь в Vercel → Project → Settings → Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://w-wave-next.vercel.app

# Опционально (если используешь сервисные операции):
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**После добавления переменных → Redeploy!**

---

### 4️⃣ Тестирование

1. **Открой:** https://w-wave-next.vercel.app/login
2. Переключись на **"Sign Up"**
3. Введи:
    - Email: `test@example.com`
    - Password: `Test123!`
    - Confirm Password: `Test123!`
4. Нажми **"Sign Up"**
5. **Увидишь:** "✅ Account created! Check your email to confirm your account."
6. **Проверь почту** → Открой письмо → Кликни на ссылку
7. **Перенаправит на:** `https://w-wave-next.vercel.app/` (автологин)

---

### 5️⃣ Проблемы и решения

#### ❌ "Email not confirmed"

-   Проверь, что включен "Require email confirmation" в Supabase
-   Проверь спам-папку
-   Проверь SMTP настройки

#### ❌ "Invalid redirect URL"

-   Добавь URL в Redirect URLs (см. шаг 1.3)
-   Redeploy после изменений в Supabase

#### ❌ "Failed to send email"

-   Supabase SMTP лимит исчерпан (3-4 письма/час)
-   Настрой свой SMTP (см. шаг 2)

#### ❌ "User already registered"

-   Email уже занят
-   Используй другой email
-   Или удали пользователя в Supabase → Authentication → Users

---

### 6️⃣ Локальная разработка

Для теста без email подтверждения (только локально!):

1. **Supabase Dashboard → Authentication → Email**

    - Временно отключи **"Require email confirmation"**

2. **Локально:**

    ```bash
    npm run dev
    ```

3. Открой: http://localhost:3000/login
4. Зарегистрируйся → Войдешь сразу (без подтверждения)

---

### 7️⃣ Дополнительные фичи

#### Resend password (forgot password)

Уже работает! Supabase автоматически обрабатывает:

-   `supabase.auth.resetPasswordForEmail(email)`

#### Magic Link (без пароля)

```ts
await supabase.auth.signInWithOtp({
	email: "user@example.com",
	options: {
		emailRedirectTo: `${window.location.origin}/auth/callback`,
	},
});
```

---

## ✅ Готово!

Теперь регистрация через email с подтверждением работает! 🎉

**Что работает:**

-   ✅ Регистрация через email/password
-   ✅ Подтверждение email через письмо
-   ✅ Автоматический логин после подтверждения
-   ✅ Callback обработка
-   ✅ Форма логина/регистрации

**Следующие шаги:**

-   Настрой SMTP для продакшена
-   Добавь "Forgot Password" форму
-   Кастомизируй email шаблоны
