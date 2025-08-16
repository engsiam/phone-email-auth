# Phone & Email Authentication System

A **full-featured authentication system** built with **Node.js, TypeScript, Express, and MongoDB**, supporting registration, login, phone/email verification, password management, and user profile management.

> **Note:** This project uses **fake SMS and email utilities** for demonstration. No third-party services like Twilio or SendGrid are integrated.

## **Table of Contents**

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Folder Structure](#folder-structure)
4. [Setup & Installation](#setup--installation)
5. [Environment Variables](#environment-variables)
6. [API Endpoints](#api-endpoints)
7. [Password Requirements](#password-requirements)
8. [Postman Collection](#postman-collection)

## **Features**

- **User Registration**

  - Register with full name, phone number, email, and password.
  - Prevent registration if phone/email is already verified by another user.
  - OTP verification for phone (5 minutes expiry).
  - Email verification via JWT link (24 hours expiry).

- **Login**

  - Login with phone number and password.
  - Login requires phone verification.

- **Password Management**

  - Forgot/reset password via phone OTP.
  - Change password after login.

- **User Profile**

  - Get profile information via `/profile` endpoint.

- **Utilities**
  - Fake `sendSms` and `sendEmail` functions log messages to console.

## **Tech Stack**

- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT
- **Password Hashing:** bcryptjs

## **Folder Structure**

```
auth-system/
├─ src/
│  ├─ controllers/         # Express route handlers
│  │   └─ authController.ts
│  ├─ services/            # Business logic / service layer
│  │   └─ authService.ts
│  ├─ models/              # Mongoose models
│  │   └─ User.ts
│  ├─ middleware/          # Auth middleware
│  │   └─ authMiddleware.ts
│  ├─ utils/               # Utilities (OTP, JWT, email/sms, password validator)
│  │   ├─ generateOTP.ts
│  │   ├─ passwordValidator.ts
│  │   ├─ senders.ts
│  │   └─ jwt.ts
│  ├─ config/              # DB configuration
│  │   └─ db.ts
│  ├─ server.ts            # Express server entry point
├─ package.json
├─ tsconfig.json
└─ .env
```

## **Setup & Installation**

1. Clone the repository:

```bash
git clone https://github.com/yourusername/auth-system.git
cd auth-system
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mydatabase
JWT_SECRET=supersecretkey
BASE_URL=http://localhost:5000
```

4. Start the server:

```bash
npm run dev
```

> Server will run on `http://localhost:5000`.

---

## **Environment Variables**

| Variable   | Description                           |
| ---------- | ------------------------------------- |
| PORT       | Server port (default: 5000)           |
| MONGO_URI  | MongoDB connection URI                |
| JWT_SECRET | Secret key for JWT token              |
| BASE_URL   | Base URL for email verification links |

## **API Endpoints**

| Method | Endpoint                   | Description                                             |
| ------ | -------------------------- | ------------------------------------------------------- |
| POST   | `/api/register`            | Register new user (requires phone & email verification) |
| POST   | `/api/verify-phone`        | Verify phone using OTP                                  |
| GET    | `/api/verify-email/:token` | Verify email via JWT link                               |
| POST   | `/api/login`               | Login using phone & password                            |
| POST   | `/api/forgot-password`     | Send OTP for resetting password                         |
| POST   | `/api/reset-password`      | Reset password using OTP                                |
| POST   | `/api/change-password`     | Change password after login                             |
| GET    | `/api/profile`             | Get logged-in user profile                              |

## **Password Requirements**

- Minimum 12 characters
- Must contain:

  - Uppercase letters
  - Lowercase letters
  - Numbers
  - Symbols (e.g., `@, $, !, %, *, ?, &`)

## **Usage Notes**

- **OTP for phone verification** expires in 5 minutes.
- **Email verification link** expires in 24 hours.
- **Forgot password** can only be done via phone OTP, not email.
- **Fake SMS/Email**: Check console for OTP and email verification URL.

## Postman Collection

You can use the provided **Postman collection** to test all API endpoints.

**File:** `auth-system-ts.postman.json`

### Instructions:

1. Open Postman.
2. Go to **File → Import → Choose Files**.
3. Select `auth-system-ts.postman.json`.
4. All routes (register, login, verify, reset password, profile, etc.) will be available.
5. Ensure your server is running at `http://localhost:5000` and your `.env` file is correctly configured.

