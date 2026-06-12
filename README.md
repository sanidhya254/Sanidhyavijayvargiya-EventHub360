# Enterprise HRMS Training Suite

Final internship full-stack project for employee management, leave workflow, assets, reports, analytics, and deployment practice.

## Developer

Sanidhya Vijayvargiya

## Features

- JWT login/signup with bcrypt password hashing
- Protected dashboard and API routes
- Employee profile management with department and skills mapping
- Multiple file upload endpoint using Multer
- Leave application and approval workflow
- Asset tracking and allocation overview
- Notification engine and audit trail records
- Dashboard analytics with department, leave, asset, city, salary, and mode graphs
- Student filtering by semester, city, domain, and online/offline/hybrid mode
- Salary report with TDS, PF, net salary, and CSV export
- Deploy-ready Render and Vercel configuration
- PostgreSQL schema for cloud database setup

## Tech Stack

- Frontend: React, Vite, Recharts, Lucide React
- Backend: Node.js, Express.js
- Auth: JWT, bcryptjs
- Uploads: Multer
- Database Design: PostgreSQL schema
- Deployment: Render backend, Vercel frontend, Neon PostgreSQL

## Local Installation

```bash
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5001
```

Health check:

```text
http://localhost:5001/api/health
```

Demo login:

```text
Email: admin@hrms.com
Password: 123456
```

On macOS, double-click:

```text
Open Enterprise HRMS.command
```

## Deployment URLs

Fill these after deploying:

```text
GitHub Repository: https://github.com/sanidhya254/sanidhya-demo
Live Frontend URL: pending Vercel deployment
Live Backend API URL: pending Render deployment
Database: pending Neon PostgreSQL connection
```

## Deployment Files

- `render.yaml` for Render backend deployment
- `vercel.json` for Vercel frontend deployment
- `DATABASE_SCHEMA.sql` for PostgreSQL schema
- `DEPLOYMENT.md` for step-by-step deployment instructions
- `docs/PROJECT_DOCUMENTATION.pdf` for final documentation
- `docs/Enterprise_HRMS_Presentation.pptx` for final presentation

## Previous Uploaded Project

The earlier uploaded GitHub project has been preserved inside:

```text
previous-upload/frontend
previous-upload/backend
```

The final Enterprise HRMS submission is at the repository root.

## Environment Variables

Frontend:

```text
VITE_API_URL=https://your-render-api.onrender.com
```

Backend:

```text
JWT_SECRET=your-secure-secret
DATABASE_URL=your-neon-postgres-connection-string
FRONTEND_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
```
