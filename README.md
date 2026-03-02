# Socsargen Hospital System

Hospital Management System para sa Socsargen County Hospital, General Santos City.

## Features

- **Public Website** - Homepage, Services, Doctors, Contact
- **Patient Portal** - Registration, Appointment Booking, Dashboard
- **Doctor Dashboard** - Appointment Management, Schedule
- **Admin Dashboard** - User Management, Services, Reports
- **AI Chatbot** - Gemini Flash powered assistant

## Tech Stack

**Frontend:**
- React.js
- Tailwind CSS v4
- React Router
- Socket.io Client

**Backend:**
- Node.js + Express.js
- PostgreSQL
- JWT Authentication
- Socket.io
- Google Gemini Flash API

---

## Installation Guide (Bisaya)

### Prerequisites - Kinahanglan nimo ni una:

1. **Node.js** (v18 or higher) - [Download diri](https://nodejs.org/)
2. **PostgreSQL** (v14 or higher) - [Download diri](https://www.postgresql.org/download/)
3. **Git** - [Download diri](https://git-scm.com/)

---

### Step 1: Clone ang Repository

Ablihi ang terminal o command prompt, unya i-type ni:

```bash
git clone https://github.com/Jacintalama/socsargen-system.git
```

Sulod sa folder:

```bash
cd socsargen-system
```

---

### Step 2: Setup sa Database (PostgreSQL)

#### 2.1 Ablihi ang pgAdmin o psql terminal

#### 2.2 Himo og bag-o nga database:

```sql
CREATE DATABASE socsargen_hospital;
```

#### 2.3 Import ang database backup (RECOMMENDED):

Gamit og command prompt o terminal:

```bash
psql -U postgres -d socsargen_hospital -f database_backup.sql
```

**Windows with full path:**
```bash
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d socsargen_hospital -f database_backup.sql
```

**Kung successful, skip na ang Step 3.3 (db:setup) kay naa na ang data!**

#### 2.4 (Optional) Kung naa kay password sa postgres user:

I-update ang connection string sa `backend/.env` file:

```
DATABASE_URL=postgresql://postgres:IMONG_PASSWORD@localhost:5432/socsargen_hospital
```

Kung walay password (default):
```
DATABASE_URL=postgresql://postgres:@localhost:5432/socsargen_hospital
```

---

### Step 3: Setup sa Backend

#### 3.1 Sulod sa backend folder:

```bash
cd backend
```

#### 3.2 Install ang dependencies:

```bash
npm install
```

#### 3.3 Copy ang environment file:

**IMPORTANTE NI! Kinahanglan nimo ni bago mo-start ang server.**

```bash
copy ..\.env.example .env
```

O manually: Copy ang `.env.example` file gikan sa root folder ngadto sa `backend/.env`

#### 3.4 Setup ang database tables ug sample data:

**SKIP NI kung nag-import ka og database_backup.sql sa Step 2.3!**

```bash
npm run db:setup
```

Kung successful, makita nimo ni:
```
===========================================
  DATABASE SETUP COMPLETE!
===========================================

  Default Admin Login:
  Email: admin@socsargen-hospital.com
  Password: admin123

  Sample Doctor Login:
  Email: doctor.santos@socsargen-hospital.com
  Password: doctor123

  Sample HR Login:
  Email: hr@socsargen-hospital.com
  Password: hr123
```

#### 3.5 (Optional) Add Gemini API Key para sa AI Chatbot:

I-edit ang `backend/.env` file ug i-add ang imong Gemini API key:

```
GEMINI_API_KEY=imong-api-key-diri
```

Kuhaon ang API key diri: https://aistudio.google.com/app/apikey

#### 3.6 Start ang backend server:

```bash
npm start
```

Ang backend mo-run sa: `http://localhost:5000`

---

### Step 4: Setup sa Frontend

#### 4.1 Ablihi og bag-o nga terminal, unya sulod sa frontend folder:

```bash
cd frontend
```

(Kung naa ka sa backend folder, i-type: `cd ../frontend`)

#### 4.2 Install ang dependencies:

```bash
npm install
```

#### 4.3 Start ang frontend:

```bash
npm run dev
```

Ang frontend mo-run sa: `http://localhost:5173`

---

### Step 5: Ablihi ang Website

Ablihi ang browser unya adto sa:

```
http://localhost:5173
```

---

## Login Credentials (Test Accounts)

### Admin & HR & Patient

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@socsargen-hospital.com | admin123 |
| HR | hr@socsargen-hospital.com | hr123 |
| Patient | patient@socsargen-hospital.com | patient123 |

### Doctors (All passwords: `doctor123`)

| Name | Email | Department |
|------|-------|------------|
| Dr. Maria Santos | doctor.santos@socsargen-hospital.com | Internal Medicine |
| Dr. Juan Reyes | doctor.reyes@socsargen-hospital.com | Pediatrics |
| Dr. Ana Cruz | doctor.cruz@socsargen-hospital.com | OB-GYN |
| Dr. Carlos Garcia | doctor.garcia@socsargen-hospital.com | Cardiology |
| Dr. Elena Mendoza | doctor.mendoza@socsargen-hospital.com | Orthopedics |
| Dr. Roberto Villanueva | doctor.villanueva@socsargen-hospital.com | Surgery |
| Dr. Patricia Torres | doctor.torres@socsargen-hospital.com | Neurology |
| Dr. Miguel Bautista | doctor.bautista@socsargen-hospital.com | Dermatology |
| Dr. Isabel Fernandez | doctor.fernandez@socsargen-hospital.com | Ophthalmology |
| Dr. Antonio Ramos | doctor.ramos@socsargen-hospital.com | Dental Medicine |

---

## Folder Structure

```
socsargen-system/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/         # Database config
│   │   ├── controllers/    # Route handlers
│   │   ├── database/       # Schema & seed files
│   │   ├── middleware/     # Auth middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helper functions
│   ├── .env                # Environment variables
│   └── package.json
│
├── frontend/               # React + Tailwind
│   ├── src/
│   │   ├── assets/        # Images, logos
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   └── services/      # API calls
│   └── package.json
│
└── README.md
```

---

## Common Issues & Solutions

### Issue: "ECONNREFUSED" or database connection error

**Solution:** Siguradoha nga naka-start ang PostgreSQL service.

Windows:
- Search "Services" sa Start Menu
- Pangitaa "postgresql" unya i-click "Start"

### Issue: "Port 5000 already in use"

**Solution:** May lain nga app nag-gamit sa port 5000. I-kill siya o i-change ang port sa `backend/.env`:

```
PORT=5001
```

### Issue: "Module not found"

**Solution:** I-delete ang `node_modules` folder unya i-install balik:

```bash
rm -rf node_modules
npm install
```

Windows:
```bash
rmdir /s /q node_modules
npm install
```

---

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new patient
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user

### Appointments
- `GET /api/appointments` - Get user appointments
- `POST /api/appointments` - Book new appointment
- `PATCH /api/appointments/:id` - Update appointment

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID

### Services
- `GET /api/services` - Get all services

---

## Contact

**Socsargen County Hospital**
- Address: L. Arradaza St., Bula-Lagao Road, Lagao, General Santos City, 9500
- Phone: 553-8906 / 553-8907
- Mobile: 0932-692-4708
- Email: socsargencountyhospital@gmail.com

---

## License

This project is proprietary software developed for Socsargen County Hospital.

---

Made with ❤️ in General Santos City
