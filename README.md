# 🚗 Carpooling App

A full-stack carpooling (ride-sharing) platform where passengers can find trips and drivers can publish rides, manage reservations, vehicles, and payments.



![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4-6DB33F?logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render&logoColor=white)

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router, MUI, Axios, Google Maps API |
| Backend | Spring Boot 4, Spring Security, Spring Data JPA |
| Database | PostgreSQL (Supabase) |
| Auth | BCrypt password hashing |
| Deployment | Vercel (frontend) · Render (backend, Docker) · Supabase (DB) |

## Features

- Passenger & driver (chauffeur) registration and login
- Trip (trajet) search and publishing
- Reservations and booking management
- Vehicle management for drivers
- Payment method handling
- Notifications
- Admin dashboard

## Architecture

```
React (Vercel) ──HTTPS──▶ Spring Boot REST API (Render, Docker) ──▶ PostgreSQL (Supabase)
```

## Getting started locally

### Prerequisites
- Node.js 18+
- Java 21+
- Maven (or use the included `mvnw`)
- A Postgres database (a free Supabase project works for local dev too)

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

The API will run on `http://localhost:8080`.

### Frontend

```bash
cd frontend
cp .env.example .env.local   
npm install
npm start
```

The app will run on `http://localhost:3000`.
