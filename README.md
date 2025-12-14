# 🌦️ Weather Track App

The **Weather Track App** is a backend API that provides weather information based on either a **city name** or **geographic coordinates (latitude & longitude)**. The application supports **user registration and authentication**, applies **rate limiting**, and logs weather provider requests and errors.

Weather data is retrieved using multiple providers to ensure reliability:

- **OpenWeather**
- **Tomorrow.io**

---

## 📚 Table of Contents

- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Security](#security)
- [Testing](#testing)

---

## 📁 Project Structure

```bash
.
├── backend
│   ├── src
│   │   ├── common
│   │   │   ├── middleware
│   │   │   │   ├── weather-logging
│   │   │   │   │   └── weather-logging.interceptor.ts
│   │   │   │   └── rate-limit
│   │   │   │       └── rate-limit.middleware.ts
│   │   │   ├── api-responses
│   │   │   ├── constants
│   │   │   └── utilities.ts
│   │   │
│   │   ├── config
│   │   │   └── data-source.ts
│   │   │
│   │   ├── database
│   │   │   └── migrations
│   │   │
│   │   ├── modules
│   │   │   ├── auth
│   │   │   │   ├── jwt-strategy
│   │   │   │   │   ├── jwt-strategy.ts
│   │   │   │   │   └── local.strategy.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.module.ts
│   │   │   │
│   │   │   ├── health-check
│   │   │   │   ├── health.controller.ts
│   │   │   │   └── health.module.ts
│   │   │   │
│   │   │   ├── redis
│   │   │   │   ├── redis.module.ts
│   │   │   │   └── redis.service.ts
│   │   │   │
│   │   │   ├── user
│   │   │   │   ├── dto
│   │   │   │   │   └── create-user.dto.ts
│   │   │   │   ├── entities
│   │   │   │   │   └── user.entity.ts
│   │   │   │   ├── user.controller.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   └── user.module.ts
│   │   │   │
│   │   │   └── weather
│   │   │       ├── dto
│   │   │       │   └── get-weather.dto.ts
│   │   │       ├── entities
│   │   │       │   ├── weather-provider-log.entity.ts
│   │   │       │   └── weather-provider-error-log.entity.ts
│   │   │       ├── providers
│   │   │       │   ├── openweather.ts
│   │   │       │   └── tomorrow.ts
│   │   │       ├── weather-provider
│   │   │       │   └── weather-provider.interface.ts
│   │   │       ├── weather-response
│   │   │       │   └── weather-response.interface.ts
│   │   │       ├── weather.controller.ts
│   │   │       ├── weather.service.ts
│   │   │       ├── weather.module.ts
│   │   │       ├── weather.controller.spec.ts
│   │   │       └── weather.service.spec.ts
│   │   │
│   │   ├── app.controller.ts
│   │   ├── app.service.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   ├── test
│   │   ├── jest-e2e.json
│   │   └── weather.e2e-spec.ts
│   │
│   ├── .env
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
└── .gitignore
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Anas-i-okasha/weather-track-app.git
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run database migrations

```bash
npm run migration:run
```

### 4. Start the application

```bash
npm run start:dev
```

---

## 🚀 Usage

### Environment Setup

Create a `.env` file in the `backend` directory and populate it with the required environment variables.

⚠️ Important: Sensitive values (secrets and credentials) are shared separately via email.
If you don’t have access to them, please contact me via email at <okasha.i.anas@gmail> or through LinkedIn: https://www.linkedin.com/in/anas-okasha/
.

---

## 🧪 Testing

### Run unit tests

```bash
npm run test
```

### Run end-to-end (E2E) tests

```bash
npm run test:e2e
```

---

## 🔌 API Endpoints

API documentation with request/response examples is available via Postman:

👉 **Postman Documentation:**
[https://documenter.getpostman.com/view/12996171/2sB3dTrnMM](https://documenter.getpostman.com/view/12996171/2sB3dTrnMM)

---

## 🔐 Security

### JWT Authentication

The API uses **JSON Web Tokens (JWT)** for securing endpoints:

- Users authenticate via the login endpoint
- A JWT is returned upon successful authentication
- Protected routes require a valid JWT in the `Authorization` header
- Tokens are verified server-side to ensure authenticated access

Additional security features include:

- **Rate limiting** using Redis
- **Request & provider error logging** for observability

---

✅ **Built with NestJS, TypeScript, Redis, and PostgreSQL**
