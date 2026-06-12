# Deployment Guide

## 1. GitHub

Repository:

```text
https://github.com/sanidhya254/sanidhya-demo
```

Push commands:

```bash
git add .
git commit -m "Final Project Submission"
git push origin main
```

## 2. Cloud PostgreSQL

Use Neon PostgreSQL.

1. Create a Neon account.
2. Create a database named `employee-management-system`.
3. Copy the connection string.
4. Run `DATABASE_SCHEMA.sql` in the SQL editor.

Environment variable:

```text
DATABASE_URL=postgresql://user:password@host/employee-management-system
```

## 3. Backend on Render

1. Go to Render.
2. New Web Service.
3. Connect GitHub repository `sanidhya-demo`.
4. Use:

```text
Build Command: npm install
Start Command: npm start
```

Environment variables:

```text
NODE_ENV=production
JWT_SECRET=your-secure-secret
DATABASE_URL=your-neon-connection-string
FRONTEND_URL=https://your-vercel-url.vercel.app
```

Health check:

```text
https://your-render-url.onrender.com/api/health
```

Expected:

```json
{ "status": "UP" }
```

## 4. Frontend on Vercel

1. Go to Vercel.
2. Import GitHub repository `sanidhya-demo`.
3. Framework: Vite.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Add environment variable:

```text
VITE_API_URL=https://your-render-url.onrender.com
```

## 5. Final Testing

Test these flows after deployment:

- Login and logout
- Signup
- Employee create/list/filter
- Leave approval/rejection
- Asset overview
- Reports and CSV export
- Dashboard graphs
- Student filters
- API health endpoint
