# sisen-FE

Frontend for **Shisen / 시선 / 視線** — a bilingual (Korean / Japanese) news-comparison product. Pairs with the FastAPI backend in `sisen-BE`.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind v4 · TanStack Query v5 · next-intl 4 (`ko` default, `ja`) · pnpm

## Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

## Project layout

```
src/
  app/
    layout.jsx              # root passthrough
    icon.png                # favicon (auto-emitted by Next)
    [locale]/
      layout.jsx            # <html lang>, NextIntlClientProvider, QueryProvider
      page.jsx              # entire current UI
  i18n/                     # next-intl routing + request config
  proxy.js                  # next-intl locale middleware (Next 16 renamed from middleware.js)
  providers/QueryProvider.jsx
  hooks/                    # useTopics, useArticles, useArticle (TanStack Query wrappers)
  lib/
    api.js                  # fetch wrappers
    transforms.js           # BE schema → FE shape
  styles.css                # Tailwind + the mockup's vanilla CSS
messages/{ko,ja}.json
public/                     # static images
```

## i18n

Locale is URL-prefixed (`/ko/...`, `/ja/...`) corresponding target clients' nationalities.
