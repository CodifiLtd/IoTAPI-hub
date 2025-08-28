# IoTAPI Hub

A TypeScript/Express backend for managing IoT devices, users, households, and device configurations. Built with Prisma (SQL Server), robust error handling, strict typing, and full OpenAPI documentation. Includes comprehensive tests and JSDoc coverage for maintainability.

## Features

- User registration, authentication (JWT), and household management
- Device registration, configuration, and ownership
- Role-based access (user, guest)
- OpenAPI spec for all endpoints
- Jest + Supertest test suite
- Prisma ORM with SQL Server
- Strict TypeScript typing and JSDoc documentation

## Assumptions

- **Config history not required:** Only the latest device configuration is stored; previous versions are not tracked.
- **No age-based features:** Date of birth (DOB) is omitted from the User model for privacy and PII minimization.

## Requirements

- Node.js 18+
- SQL Server database
- npm (or yarn)

## Setup & Running

**Important:** Before running migrations, you must manually create a SQL Server database named `iothub`.
   - Example (SQL Server):
      ```sql
      CREATE DATABASE iothub;
      ```

1. **Clone the repository:**
   ```bash
   git clone https://github.com/CodifiLtd/IoTAPI-hub.git
   cd IoTAPI-hub
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment:**
   - Copy `.env.example` to `.env` and set your database connection string and JWT secret.
4. **Run database migrations:**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```
5. **Seed the database (optional):**
   ```bash
   npm run seed
   ```
6. **Start the server:**
   ```bash
   npm run dev
   # or
   npm start
   ```
7. **API Documentation:**
   - OpenAPI spec is at `openapi.yaml`.
   - Swagger UI available at `/docs` (if enabled in app).

## Testing

Run all tests:

```bash
npm test
```

## Project Structure

- `src/` - Main source code (controllers, services, routes, middleware, schemas, types, utils)
- `prisma/` - Prisma schema, migrations, and seed script
- `tests/` - Jest/Supertest test suite
- `openapi.yaml` - OpenAPI documentation

## Contact & Support

For issues or feature requests, open a GitHub issue or contact Codifi Ltd.

---

_This project is designed for maintainability, security, and extensibility. All business logic, error handling, and API contracts are documented and tested._
