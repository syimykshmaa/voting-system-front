# Deploy to Railway

This repository is currently configured to deploy the frontend app from `frontend/`.

## 1) Connect repo in Railway

1. Create a new Railway project.
2. Connect this GitHub repository.
3. Railway will auto-detect `railway.json` from project root.

## 2) Required environment variable

Set:

- `VITE_API_URL` = your backend API base URL, for example:
  - `https://your-backend.up.railway.app/api`

If not set, frontend falls back to local default:

- `http://localhost:5000/api`

## 3) Build and start commands (already set)

- Build: `npm install --prefix frontend && npm run build`
- Start: `npm run start`

Root `start` script runs:

- `npm run preview --prefix frontend -- --host 0.0.0.0 --port ${PORT:-3000}`

This makes Vite listen on Railway host and port.

## 4) Local production check

From repo root:

```bash
npm run build
npm run start
```

