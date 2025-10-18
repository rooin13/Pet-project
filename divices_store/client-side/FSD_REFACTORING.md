# ✅ Feature-Sliced Design Refactoring

## 🎯 Что сделано:

### 1. **Header/Menu** - `widgets/header`

-   ✅ Вынесена конфигурация категорий: `shared/lib/config/categories.config.ts`
-   ✅ Хуки остались в `model/lib/useMobileMenu.ts`
-   ✅ UI компоненты чистые (Menu, Logo, ShopContent, etc.)

### 2. **Cart** - `widgets/cart`

-   ✅ Создан хук `model/useCart.ts` - вся логика расчетов
-   ✅ UI компонент `Cart.tsx` - только отображение
-   ✅ Утилиты вынесены в `shared/lib/utils/cartUtils.ts`

### 3. **Checkout** - `features/checkout-form`

-   ✅ Создан хук `model/hooks/useCheckout.ts` - логика оформления заказа
-   ✅ Создан хук `model/hooks/useAddressAutocomplete.ts` - автозаполнение адресов
-   ✅ `ui/BillingForm.tsx` - чистый UI
-   ✅ `model/validation.ts` - Zod схемы

### 4. **Search** - `features/search`

-   ✅ Создан хук `model/hooks/useProductSearch.ts` - логика поиска
-   ✅ `ui/Search.tsx` - только UI
-   ✅ Debounced search вынесен в хук

### 5. **Product** - `entities/product`

-   ✅ Создан хук `model/hooks/useProductHover.ts` - hover логика
-   ✅ `ui/ProductItem.tsx` - чистый компонент
-   ✅ Использует утилиты из `shared/lib/utils/formatters.ts`

### 6. **Shared/lib** - общие утилиты

-   ✅ `utils/cartUtils.ts` - расчеты корзины, shipping
-   ✅ `utils/formatters.ts` - форматирование цен, дат, телефонов
-   ✅ `config/categories.config.ts` - конфигурация категорий
-   ✅ `config/pages.config.ts` - уже был
-   ✅ `config/meta.config.ts` - уже был

## 📁 Структура FSD:

```
src/
├── app/                    # Next.js App Router
├── features/               # Фичи
│   ├── checkout-form/
│   │   ├── model/
│   │   │   ├── hooks/     # useCheckout, useAddressAutocomplete
│   │   │   └── validation.ts
│   │   └── ui/            # BillingForm
│   ├── search/
│   │   ├── model/hooks/   # useProductSearch
│   │   └── ui/            # Search, SearchDropdown
│   └── auth-btn/
│       └── ui/
├── entities/               # Бизнес-сущности
│   ├── product/
│   │   ├── model/hooks/   # useProductHover
│   │   └── ui/            # ProductItem
│   └── filter/
│       ├── config/
│       └── model/
├── widgets/                # Композитные блоки
│   ├── header/
│   │   ├── model/lib/     # useMobileMenu
│   │   └── ui/            # Menu, CartBtn, etc
│   ├── cart/
│   │   ├── model/         # useCart
│   │   ├── cart-item/ui/
│   │   └── Cart.tsx
│   └── footer/
└── shared/                 # Переиспользуемый код
    ├── ui/                 # UI Kit
    ├── lib/
    │   ├── api/
    │   ├── config/         # categories, pages, meta
    │   ├── hooks/
    │   └── utils/          # cartUtils, formatters, productUtils
    └── types/
```

## 🔥 Преимущества после рефакторинга:

1. **Переиспользование** - хуки можно использовать в разных компонентах
2. **Тестируемость** - логика отделена от UI
3. **Читаемость** - компоненты стали чище
4. **Масштабируемость** - легко добавлять новые фичи
5. **Поддерживаемость** - четкая структура папок
6. **Type-safety** - TypeScript везде

## 🚀 Новые возможности:

-   **Address Autocomplete** - бесплатный через Nominatim (OpenStreetMap)
-   **Валидация форм** - полная Zod validation
-   **Accessibility** - ARIA labels везде
-   **Smart utilities** - переиспользуемые функции

## 📦 Созданные файлы:

### Hooks:

-   `features/checkout-form/model/hooks/useCheckout.ts`
-   `features/checkout-form/model/hooks/useAddressAutocomplete.ts`
-   `features/search/model/hooks/useProductSearch.ts`
-   `widgets/cart/model/useCart.ts`
-   `entities/product/model/hooks/useProductHover.ts`

### Utils:

-   `shared/lib/utils/cartUtils.ts`
-   `shared/lib/utils/formatters.ts`

### Config:

-   `shared/lib/config/categories.config.ts`
