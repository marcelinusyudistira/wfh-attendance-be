<p align="center">
  <a href="https://nestjs.com" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
  </a>
</p>

<h1 align="center">WFH Attendance Backend</h1>

<p align="center">
Backend system for managing employee attendance in a Work From Home environment built with <b>NestJS</b>.
</p>

<p align="center">
<img src="https://img.shields.io/badge/NestJS-Framework-red" />
<img src="https://img.shields.io/badge/Node.js-18+-green" />
<img src="https://img.shields.io/badge/Architecture-Microservices-blue" />
<img src="https://img.shields.io/badge/License-MIT-lightgrey" />
</p>

---

# Overview

WFH Attendance Backend is a backend system designed to manage employee attendance for remote work environments.

This project originally started as a **monolithic NestJS application** and was later refactored into a **microservice architecture** to improve scalability and maintainability.

The system now consists of:

* **API Gateway (Monolith Refactored)** – handles incoming requests
* **Employee Service** – manages employee data
* **Attendance Service** – manages attendance records

---

# Architecture

```text
Client
   │
   ▼
Gateway (src)
   │
   ├── Employee Service (apps/employee)
   │
   └── Attendance Service (apps/attendance)
```

The **Gateway** acts as the entry point and communicates with other services via internal APIs.

---

# Project Structure

```text
.
├── apps
│   ├── employee
│   │
│   └── attendance
│
├── src
│   └── gateway (old monolith / API gateway)
│
├── package.json
└── README.md
```

---

# Tech Stack

* **Framework:** NestJS
* **Language:** TypeScript
* **Database:** MySQL / PostgreSQL
* **Architecture:** Monolith → Microservices
* **ORM:** TypeORM
* **Authentication:** JWT

---

# Prerequisites

Before running this project, ensure you have installed:

* Node.js >= 18
* npm
* Git
* MySQL or PostgreSQL

---

# Installation

## 1. Clone the Repository

```bash
git clone https://github.com/marcelinusyudistira/wfh-attendance-be.git
cd wfh-attendance-be
```

---

## 2. Install Dependencies

```bash
npm install
```

---

# Database Setup

Create the following databases:

```sql
CREATE DATABASE wfh_employee_db;
CREATE DATABASE wfh_attendance_db;
```

---

# Run Database Migrations

Run migrations for each service.

### Employee Service

```bash
npm run migrate:employee
```

### Attendance Service

```bash
npm run migrate:attendance
```

---

# Run Database Seeders

Populate the database with initial data.

### Employee Seeder

```bash
npm run seed:employee
```

### Attendance Seeder

```bash
npm run seed:attendance
```

---

# Running the Services

Each service must run separately.

### Start Employee Service

```bash
npm run start:employee
```

Location:

```text
apps/employee
```

---

### Start Attendance Service

```bash
npm run start:attendance
```

Location:

```text
apps/attendance
```

---

### Start Gateway

The gateway is the **original monolithic application** that now acts as the API entry point.

```bash
npm run start:gateway
```

Location:

```text
src
```

---

# Development

During development, run all services simultaneously in separate terminals:

* Gateway
* Employee Service
* Attendance Service

---

# Environment Variables

Create a `.env` file in the root directory.

Example:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password

EMPLOYEE_DB_NAME=wfh_employee_db
ATTENDANCE_DB_NAME=wfh_attendance_db

JWT_SECRET=secret
```

---

# API Documentation

If Swagger is enabled, API documentation can be accessed at:

```
http://localhost:3000/api/docs
```

---

# Future Improvements

* Add message broker (RabbitMQ / Kafka)
* Add API rate limiting
* Implement distributed logging
* Containerization with Docker

---

# License

This project is licensed under the MIT License.
