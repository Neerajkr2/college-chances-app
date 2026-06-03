# Prepitus — College Chances Calculator

> See how your GPA and SAT scores measure up to your dream colleges. Get personalized estimates and improvement recommendations — delivered straight to your inbox.

A full-stack web application where students enter their academic profile, compare themselves against real college benchmarks, and instantly receive a personalized admission report PDF via email.

---

## Live Demo

| Layer | URL |
|---|---|
| Frontend | *(deploy to Vercel — see [Deployment](#deployment))* |
| Backend API | *(deploy to Render — see [Deployment](#deployment))* |

---

## Features

- **Multi-step Wizard** — guided GPA + SAT input with real-time validation
- **College Search & Comparison** — search and select from a curated college dataset
- **Likely / Target / Reach Classification** — instant per-college admission chance based on SAT range and GPA
- **Chance Gauge** — visual indicator of overall admission strength
- **Email Report** — styled HTML email + PDF attachment sent automatically on form submit
- **User Deduplication** — prevents duplicate entries by email

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite |
| Backend | Node.js, Express |
| Email | Nodemailer + Gmail SMTP |
| Storage | JSON flat-file (`users.json`) |
| Dev tooling | nodemon |

---

## Project Structure

```
college-chances-app/
├── backend/
│   ├── server.js                          # Express API — email sending, college analysis
│   ├── userStorage.js                     # Read/write users.json with deduplication
│   ├── Prepitus_College_Admission_Report.pdf  # PDF attached to every report email
│   ├── package.json
│   └── .env                               # Environment config (never commit this)
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Wizard.jsx                 # Multi-step form controller
    │   │   ├── Step1.jsx                  # GPA + SAT input
    │   │   ├── Step2.jsx                  # College selection
    │   │   ├── CollegeSearch.jsx          # Search + filter colleges
    │   │   ├── CollegeComparison.jsx      # Side-by-side college stats
    │   │   ├── ChanceGauge.jsx            # Visual admission chance meter
    │   │   ├── BasicInfoModal.jsx         # Name + email capture → triggers report send
    │   │   ├── ReportTeaser.jsx           # Pre-submit report preview
    │   │   ├── ReportSuccessModal.jsx     # Post-submit confirmation
    │   │   ├── Footer.jsx
    │   │   └── Header.jsx
    │   ├── data/
    │   │   └── collegeData.js             # College dataset (SAT range, GPA avg, admit rate)
    │   ├── utils/
    │   │   └── calculations.js            # Admission chance logic
    │   ├── styles/
    │   │   └── App.css
    │   ├── App.jsx
    │   └── main.jsx
    ├── vite.config.js                     # Dev server (port 3001) + proxy to backend (3000)
    └── package.json
```

---

## Prerequisites

- **Node.js** v18 or later — [nodejs.org](https://nodejs.org)
- A **Gmail account** with [2-Step Verification](https://myaccount.google.com/security) enabled
- A **Gmail App Password** — [generate one here](https://myaccount.google.com/apppasswords) (use this as `SMTP_PASS`, not your regular Gmail password)

---

## Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/Neerajkr2/college-chances-app.git
cd college-chances-app
```

### 2. Configure backend environment

Create `backend/.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx    # 16-char Gmail App Password
FROM_EMAIL=your-email@gmail.com
FROM_NAME="Prepitus College Chances"
PORT=3000
CORS_ORIGIN=http://localhost:3001
NODE_ENV=development
```

### 3. Start the backend

```bash
cd backend
npm install
npm run dev        # nodemon — auto-reloads on file save
# or: npm start   # plain node
```

Expected output:
```
✅ SMTP server is ready to take messages
🚀 Prepitus College Chances Backend - v2.0
🌐 Server running on port: 3000
```

### 4. Start the frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

> The Vite dev server automatically proxies all `/api/*` requests to `http://localhost:3000`, so both terminals must be running.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `SMTP_HOST` | Gmail SMTP host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | Gmail address used to send emails | `you@gmail.com` |
| `SMTP_PASS` | Gmail App Password (16 chars, not login password) | `abcd efgh ijkl mnop` |
| `FROM_EMAIL` | Sender email shown to recipients | `you@gmail.com` |
| `FROM_NAME` | Sender display name | `Prepitus College Chances` |
| `PORT` | Backend port | `3000` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:3001` |
| `NODE_ENV` | Environment | `development` |

### Frontend (Vercel environment variable)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend URL in production (leave empty for local dev) | `https://your-app.onrender.com` |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/store-user-and-send-report` | Store user + send report email |
| `POST` | `/api/send-college-report` | Send report email only (legacy) |

### POST `/api/store-user-and-send-report`

**Request body:**
```json
{
  "userData": {
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane@example.com",
    "gpa": "3.8",
    "satScore": "1350",
    "graduationYear": "2025"
  },
  "selectedColleges": [...],
  "formData": { ... }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Your college admission report has been sent successfully!",
  "data": {
    "email": "jane@example.com",
    "isDuplicate": false,
    "collegesAnalyzed": 5,
    "overallChance": "Target",
    "summary": { "likely": 1, "target": 3, "reach": 1 }
  }
}
```

---

## How It Works

```
Student fills GPA + SAT → selects colleges → enters name/email
         ↓
Backend calculates Likely / Target / Reach per college
         ↓
User stored in users.json (deduplicated by email)
         ↓
Styled HTML email + PDF report sent via Gmail SMTP
```

**Classification logic:**

| Result | Criteria |
|---|---|
| **Likely** | SAT above college's upper range AND GPA above average |
| **Target** | SAT within college's range AND GPA within 0.2 of average |
| **Reach** | SAT or GPA below college's minimum range |

---

## Deployment

Free deployment using **Render** (backend) + **Vercel** (frontend).

### Backend → Render

1. Go to [render.com](https://render.com) → New → **Web Service**
2. Connect your GitHub repo
3. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
4. Add all backend environment variables (from the table above)
5. Set `CORS_ORIGIN` to your Vercel frontend URL after Step 2 below

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → import repo
2. Set:
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add environment variable:
   - `VITE_API_URL` = `https://your-render-app.onrender.com`
4. Deploy → copy the Vercel URL → update `CORS_ORIGIN` on Render

### Connection diagram

```
Vercel (React build)  ──HTTPS──►  Render (Express API)  ──SMTP──►  Gmail
```

> **Note:** Render's free tier spins down after 15 min of inactivity (cold start ~30s). The flat-file `users.json` is also reset on each redeploy. For persistent storage, connect a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster.

---

## Common Issues

| Problem | Fix |
|---|---|
| `SMTP connection error: 535 Username and Password not accepted` | You must use a **Gmail App Password**, not your regular Gmail password. Generate one at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords). |
| `PDF file not found` | Make sure `Prepitus_College_Admission_Report.pdf` exists inside `backend/`. |
| Frontend shows proxy errors | Confirm the backend is running on port `3000` before starting the frontend. |
| CORS error in production | Make sure `CORS_ORIGIN` on Render matches your exact Vercel URL (no trailing slash). |
| Port already in use | Change `PORT` in `backend/.env` and update `CORS_ORIGIN` + the `target` in `frontend/vite.config.js`. |

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "add my feature"`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

MIT © [Prepitus](https://www.prepitus.com)
