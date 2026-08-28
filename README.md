# Daymark

Daymark is a full-stack goal tracker built with React, TanStack Query, Express, MongoDB, JWT authentication, and Nodemailer.

## Requirements

- Node.js 18 or newer
- MongoDB running locally or a MongoDB connection string
- An SMTP account for real verification and password-reset emails

## Install

From the project root:

```bash
npm install
cd frontend
npm install
cd ..
```

Create a root `.env` file. The backend loads this file from the project root:

```env
PORT=8000
NODE_ENV = development
MONGO_URI=mongodb://127.0.0.1:27017/daymark
JWT_SECRET=replace-with-a-long-random-secret
JWT_SECRET_EXPIRY=7d

# Use false locally to print OTPs in the backend terminal.
SMTP_REQUIRED=false
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-google-app-password
SMTP_FROM=your-email@gmail.com
```

Copy `.env.example` as a starting point:

```bash
copy .env.example .env
```

The frontend environment file is `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

Restart the frontend after changing `frontend/.env`.

## Run

Start the backend from the root:

```bash
npm run dev
```

In another terminal, start the frontend:

```bash
cd frontend
npm start
```

Open http://localhost:3000.

## Email and OTPs

Nodemailer sends email through an SMTP provider; Nodemailer does not provide an inbox.

For Gmail:

1. Enable 2-Step Verification.
2. Create a Google App Password.
3. Use the App Password as `SMTP_PASS`, not your normal Gmail password.
4. Set `SMTP_REQUIRED=true` when real SMTP delivery is configured.

When `SMTP_REQUIRED=false` and SMTP values are missing or placeholders, OTPs are printed in the backend terminal for local testing. Never commit real SMTP credentials or `.env` files.

## Main flows

- Registration sends an email verification OTP and does not issue a token until verification succeeds.
- Login accepts either username or email after verification.
- Forgot password sends a short-lived reset OTP.
- Changing a profile email sends a new verification OTP.
- Goals support search, completed/favorite filters, and pages of up to 8 results.

```

## Checks

```bash
cd frontend
npm run build
```

Backend syntax can be checked with:

```bash
node --check backend/server.js
node --check backend/controller/userController.js
```
