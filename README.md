# Notes API with MongoDB (Mongoose)

Assignment 7 — Phase 4 Backend. Notes REST API persisted in MongoDB.

## Setup
```bash
npm install
cp .env.example .env     # set MONGO_URI (local or Atlas)
npm run seed             # run once to insert 7 sample notes
npm run dev              # or: npm start
```

## Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/notes | All notes (optional `?category=Work`) |
| GET | /api/notes/:id | Single note |
| POST | /api/notes | Create note (`title`, `content` required) |
| PUT | /api/notes/:id | Update note |
| DELETE | /api/notes/:id | Delete note |

## Status codes
200/201 success · 400 validation error / invalid id / invalid category · 404 note not found · 500 server error

## Verify persistence
1. `npm run seed`, then `npm start`, then `GET /api/notes`
2. Stop the server (Ctrl+C), start it again
3. `GET /api/notes` — the same notes are still returned
