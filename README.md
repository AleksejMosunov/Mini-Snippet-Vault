# Snippets App

Monorepo with:

- `apps/backend` - NestJS + MongoDB API
- `apps/frontend` - Next.js UI

## Tech Stack

- Backend: NestJS, Mongoose, class-validator
- Frontend: Next.js (App Router), React, Tailwind CSS
- Database: MongoDB

## 1. Local Run

### Prerequisites

- Node.js 20+
- npm 10+
- MongoDB running locally (or a remote MongoDB URI)

### Install dependencies

From project root:

```bash
npm install
```

### Environment variables

Create `.env` files from examples:

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

### Run in development (2 terminals)

Terminal 1 (backend):

```bash
cd apps/backend
npm run start:dev
```

Terminal 2 (frontend):

```bash
cd apps/frontend
npm run dev
```

Open:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001`

## 2. Environment Variables

### Backend (`apps/backend/.env`)

```env
PORT=3001
MONGO_URI=mongodb://localhost:27017/snippets
FRONTEND_URL=http://localhost:3000
```

### Frontend (`apps/frontend/.env`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 3. API Quick Check

Base URL:

```text
http://localhost:3001
```

### Create snippet

```bash
curl -X POST http://localhost:3001/snippets \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Nest validation notes",
    "content":"Use ValidationPipe globally",
    "type":"note",
    "tags":["nest","validation"]
  }'
```

### Get list (pagination + search + tag)

```bash
curl "http://localhost:3001/snippets?page=1&limit=10&q=validation&tag=nest"
```

### Get one snippet by id

```bash
curl "http://localhost:3001/snippets/<SNIPPET_ID>"
```

### Update snippet

```bash
curl -X PATCH "http://localhost:3001/snippets/<SNIPPET_ID>" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Updated title",
    "content":"Updated content",
    "type":"note",
    "tags":["updated"]
  }'
```

### Delete snippet

```bash
curl -X DELETE "http://localhost:3001/snippets/<SNIPPET_ID>"
```

## 4. Build and Run in Production

### Backend

```bash
cd apps/backend
npm run build
npm run start:prod
```

### Frontend

```bash
cd apps/frontend
npm run build
npm run start
```

Notes:

- Set production values in `.env` before running.
- `NEXT_PUBLIC_API_URL` must point to your deployed backend URL.

## 5. Useful scripts

Backend:

```bash
cd apps/backend
npm run lint
npm run test
```

Frontend:

```bash
cd apps/frontend
npm run lint
```
