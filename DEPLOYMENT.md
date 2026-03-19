# BonjourBee Deployment Guide

## Recommended Setup (Render)

This repo includes a Render blueprint in [render.yaml](render.yaml).

### 1. Push latest code

Push your current branch to GitHub.

### 2. Create services from blueprint

1. Open Render dashboard.
2. Click `New +` -> `Blueprint`.
3. Connect your GitHub repo and select this repository.
4. Render will read [render.yaml](render.yaml) and create:
   - `bonjourbee-api` (Node backend)
   - `bonjourbee-client` (static frontend)

### 3. Set required environment variables

For backend service (`bonjourbee-api`):

- `MONGO_URI`: your MongoDB connection string
- `JWT_SECRET`: a strong random secret
- `CORS_ORIGINS`: your frontend URL(s), comma separated

Example:

```env
CORS_ORIGINS=https://bonjourbee-client.onrender.com
```

For frontend service (`bonjourbee-client`):

- `VITE_API_BASE_URL`: your backend API base URL including `/api`

Example:

```env
VITE_API_BASE_URL=https://bonjourbee-api.onrender.com/api
```

### 4. Redeploy

Trigger a redeploy for both services after setting env vars.

### 5. Verify

1. Open frontend URL and test signup/login.
2. Open backend health endpoint:

```
https://bonjourbee-api.onrender.com/api/health
```

Expected response:

```json
{"ok":true}
```

## Notes

- The backend now supports production CORS via `CORS_ORIGINS`.
- Localhost is still allowed for development.
- Keep `.env` files private; use `.env.example` as templates.