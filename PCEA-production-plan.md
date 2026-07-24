# PCEA Kandengwa — Demo → Production Migration Plan

**Current state:** React 19 + Vite SPA, all data in `localStorage`, fake email-only "auth," simulated giving.
**Target state:** Full-stack Church Management System with real database, real auth, real deployment. M-Pesa giving deferred to a later phase.

**Stack decision:** TiDB Serverless (MySQL-compatible) — consistent with Pewa, TNMS, and the expense tracker, and you've already solved its common gotchas (no `CREATE DATABASE`, SSL connection config, pooling limits).

---

## Phase 0 — Database Schema

Tables map directly onto the existing `types.ts` interfaces, so the frontend data shapes barely change.

```sql
CREATE TABLE users (
  id            VARCHAR(36) PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('member','clergy','admin') NOT NULL DEFAULT 'member',
  status        ENUM('active','suspended') NOT NULL DEFAULT 'active',
  avatar        VARCHAR(500),
  phone         VARCHAR(30),
  bio           TEXT,
  date_joined   DATE NOT NULL,
  reset_token       VARCHAR(255),
  reset_token_expires DATETIME,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sermons (
  id          VARCHAR(36) PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  speaker     VARCHAR(120) NOT NULL,
  date        DATE NOT NULL,
  video_url   VARCHAR(500),
  audio_url   VARCHAR(500),
  pdf_url     VARCHAR(500),
  duration    VARCHAR(20),
  views       INT DEFAULT 0,
  tags        JSON,
  thumbnail   VARCHAR(500),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
  id          VARCHAR(36) PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  date        DATE NOT NULL,
  time        VARCHAR(20),
  description TEXT,
  location    VARCHAR(200),
  image       VARCHAR(500),
  category    ENUM('Worship','Youth','Community','Conference','Prayer') NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_registrations (
  event_id VARCHAR(36) NOT NULL,
  user_id  VARCHAR(36) NOT NULL,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (event_id, user_id),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE announcements (
  id         VARCHAR(36) PRIMARY KEY,
  title      VARCHAR(200) NOT NULL,
  content    TEXT NOT NULL,
  date       DATE NOT NULL,
  category   ENUM('General','Youth','Events','Urgent','Ministries') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE prayer_requests (
  id            VARCHAR(36) PRIMARY KEY,
  user_id       VARCHAR(36),           -- NULL when isAnonymous
  user_name     VARCHAR(120) NOT NULL,
  user_avatar   VARCHAR(500),
  content       TEXT NOT NULL,
  date          DATE NOT NULL,
  status        ENUM('pending','approved','prayed_for','archived') DEFAULT 'pending',
  prayers_count INT DEFAULT 0,
  is_anonymous  BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE prayer_supporters (
  prayer_id VARCHAR(36) NOT NULL,
  user_id   VARCHAR(36) NOT NULL,
  PRIMARY KEY (prayer_id, user_id),
  FOREIGN KEY (prayer_id) REFERENCES prayer_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE giving_records (
  id             VARCHAR(36) PRIMARY KEY,
  user_id        VARCHAR(36) NOT NULL,
  amount         DECIMAL(12,2) NOT NULL,
  category       ENUM('Tithe','Offering','Missions','Building Fund','Other') NOT NULL,
  date           DATE NOT NULL,
  payment_method VARCHAR(50) NOT NULL,  -- 'Simulated' for now, 'M-Pesa' later
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE notifications (
  id         VARCHAR(36) PRIMARY KEY,
  user_id    VARCHAR(36) NOT NULL,
  title      VARCHAR(200) NOT NULL,
  content    TEXT NOT NULL,
  date       DATE NOT NULL,
  is_read    BOOLEAN DEFAULT FALSE,
  type       ENUM('info','success','alert') DEFAULT 'info',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Note:** `password_hash`, `reset_token`, `reset_token_expires` are new columns not in the current `User` type — required for real auth. `tags` on sermons stored as JSON since TiDB supports it natively.

---

## Phase 1 — Backend Scaffold

- `server/` folder: Express app, structured as `routes/`, `controllers/`, `middleware/`, `db/`
- `db/pool.ts` — mysql2 connection pool to TiDB Serverless (SSL config, as solved in Pewa)
- Environment config: `.env` for `DATABASE_URL`, `JWT_SECRET`, `COOKIE_SECRET`, `CLOUDINARY_*`
- Health check route (`GET /api/health`) to verify DB connectivity before building further
- CORS configured for the Vercel frontend origin, `credentials: true` for cookie-based auth

**Deliverable:** a running Express server with a live TiDB connection, deployable to Render, verified with the health check.

---

## Phase 2 — Real Authentication

Replacing the current email-only fake login.

- `POST /api/auth/register` — bcrypt-hash password (12 rounds), insert user, issue JWT
- `POST /api/auth/login` — bcrypt compare, issue JWT as **httpOnly cookie** (matches your TNMS pattern: access token short-lived + refresh token)
- `POST /api/auth/logout` — clear cookies
- `POST /api/auth/forgot-password` — generate reset token, (email sending deferred or stubbed initially)
- `POST /api/auth/reset-password` — validate token, update password_hash
- `GET /api/auth/me` — return current user from cookie, used on app load to restore session
- Middleware: `requireAuth`, `requireRole('admin' | 'clergy')` for protected routes

**Frontend changes:** `AuthModal.tsx` needs a real password field (currently missing), and calls hit the API instead of `useChurchStore.login()`.

**Deliverable:** working register/login/logout against the real DB, protected routes return 401/403 correctly.

---

## Phase 3 — Core CRUD APIs

One resource at a time, each mirroring a `useChurchStore` function it replaces:

| Resource | Endpoints | Replaces |
|---|---|---|
| Users | `GET/POST/PUT/DELETE /api/users` | `addUser`, `editUser`, `deleteUser`, `updateProfile` |
| Sermons | `GET/POST /api/sermons` | `addSermon` |
| Events | `GET/POST /api/events`, `POST /api/events/:id/register`, `DELETE /api/events/:id/register` | `addEvent`, `registerForEvent`, `unregisterFromEvent` |
| Announcements | `GET/POST /api/announcements` | `addAnnouncement` |
| Prayer requests | `GET/POST /api/prayers`, `POST /api/prayers/:id/pray`, `PATCH /api/prayers/:id/status` | `addPrayerRequest`, `addPrayerCount`, `updatePrayerStatus` |
| Giving | `GET/POST /api/giving` | `addGiving` (payment_method hardcoded to "Simulated" for now) |
| Notifications | `GET /api/notifications`, `PATCH /api/notifications/:id/read`, `PATCH /api/notifications/read-all` | `markNotificationRead`, `markAllNotificationsRead` |

Notification fan-out (e.g. "new sermon" → notify all users) moves server-side, ideally as a single bulk `INSERT ... SELECT` instead of the current per-user loop.

**Deliverable:** full REST API covering everything the demo does, testable via curl/Postman before touching the frontend.

---

## Phase 4 — Frontend Integration

- Replace `useChurchStore.ts` internals: same function names/signatures where possible (so components barely change), but bodies become `fetch()` calls
- Add loading and error states to components that currently assume synchronous local data (`MemberPortal`, `AdminPortal`, `PublicWebsite`)
- Session restore on load via `GET /api/auth/me` instead of reading `localStorage.fcc_current_user`
- Remove the "Sandbox Role Switcher" widget (or gate it behind a dev-only flag) before going live

**Deliverable:** the existing UI fully running against the real backend, `localStorage` no longer used for church data.

---

## Phase 5 — File Uploads

- Cloudinary (or similar) for sermon video/audio/PDF and gallery images, matching the mockup's "Storage: Cloudinary" note
- `POST /api/sermons` accepts multipart upload, stores returned URLs in `video_url`/`audio_url`/`pdf_url`
- Admin UI (`AdminPortal.tsx`) gets a real file picker instead of URL-only inputs (if that's how it currently works — worth checking when we get here)

---

## Phase 6 — Deployment

- Backend → Render (as with Pewa, TNMS, Auto-Link v2)
- Frontend → Vercel
- Environment variables set on both platforms; CORS locked to production origins
- Smoke test each role (public, member, clergy, admin) against the live URLs

---

## Phase 7 — Later: Real M-Pesa Giving

Deferred per your call — revisit once core CMS is live. Will follow the same Daraja/Lipana STK Push pattern used in Pewa: sandbox first, webhook confirmation endpoint, `payment_method` recorded as `"M-Pesa"`, receipt notification on confirmation.

---

## Suggested order for our sessions

1. Phase 0 + 1 (schema + backend scaffold + DB connectivity) — one session
2. Phase 2 (auth) — one session
3. Phase 3 (CRUD APIs) — likely 1–2 sessions, can split by resource
4. Phase 4 (frontend rewire) — one session
5. Phase 5 (uploads) — one session
6. Phase 6 (deploy) — one session
7. Phase 7 (M-Pesa) — later, separate effort

