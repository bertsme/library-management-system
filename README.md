# Library Management System

NestJS + Prisma 7 + PostgreSQL (Neon) API for a library's book catalog.

## Setup

1. `cd api && npm install`
2. Copy `.env.example` to `.env` and set your real `DATABASE_URL`
3. `npx prisma migrate dev`
4. `npx prisma db seed`
5. `npm run start:dev`

## Schema Decisions

**Why Book references Genre instead of embedding it:** Genre is its own table, and each Book stores a `genreId` foreign key with a `@relation` to it. The genre's name lives in one place, so renaming it updates every book at once instead of editing copies. Many books can share one genre without duplicating data. The database enforces integrity (`onDelete: Restrict` prevents deleting a genre that still has books). Queries like "all books in a genre" or "count books per genre" are simple joins. Embedding the genre in each book would duplicate data and risk inconsistencies like "Self-Help" vs "Self help".

**Role enum:** User roles are limited to `PATRON` and `LIBRARIAN`, so invalid roles are rejected by the database and the type system.

## Prisma vs a document database

Relations and constraints are declared up front in the schema and enforced by the database, instead of being a convention in application code.
