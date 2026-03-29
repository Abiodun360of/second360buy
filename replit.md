# Second360Buy Marketplace

## Overview

A professional second-hand marketplace website (Second360Buy) built as a full-stack pnpm monorepo using TypeScript, React, Express, and PostgreSQL.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui + Wouter (routing)
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (ESM bundle)
- **AI**: OpenAI via Replit AI Integrations (auto-generates product descriptions)

## Features

- **Homepage**: Product grid, featured products, recently sold, verified seller badge, customer reviews, activity notifications
- **Product pages**: Large image gallery, AI-generated description, condition & status badges, buy-via-email button, related products
- **Admin dashboard**: Password-protected, add/edit/delete products, toggle Available/Sold status, AI auto-generates descriptions
- **Contact**: Buy button opens mailto:second360buy@gmail.com with product inquiry subject

## Admin Access

- URL: `/admin/login`
- Password: Set via `ADMIN_PASSWORD` environment variable (default: `second360buy@2024`)

## Structure

```text
artifacts/
  api-server/          # Express 5 API server
  second360buy/        # React + Vite frontend (marketplace)
lib/
  api-spec/            # OpenAPI spec + Orval codegen config
  api-client-react/    # Generated React Query hooks
  api-zod/             # Generated Zod schemas from OpenAPI
  db/                  # Drizzle ORM schema + DB connection
scripts/               # Utility scripts
```

## API Endpoints

- `GET /api/products` - Get all products (optional `?status=Available|Sold&category=...`)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product with AI description (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `PATCH /api/products/:id/toggle` - Toggle Available/Sold (admin only)
- `POST /api/admin/login` - Admin login (`{password}`)
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/me` - Check auth status

## Database Schema

- **products** table: id, title, condition, price, status, images (JSON array), description, category, key_features, created_at, updated_at

## SEO

- Each page has `<title>` and meta description
- Format: `[Product Name] – Second360Buy`

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. Root `tsconfig.json` lists composite libs as project references.

- Always typecheck from the root: `pnpm run typecheck`
- Run codegen after OpenAPI changes: `pnpm --filter @workspace/api-spec run codegen`
- Push DB schema: `pnpm --filter @workspace/db run push`
