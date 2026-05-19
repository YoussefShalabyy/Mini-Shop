# Mini Shop - Backend API

Built with **Fastify**, **TypeScript**, and **Supabase**.

## Overview
This backend provides a secure, high-performance REST API for the Mini Shop ecosystem.

### Features
- **Fastify:** For extremely low-overhead routing.
- **Zod Validation:** Strict runtime schema validation for all incoming requests.
- **Supabase Integration:** Uses `service_role` keys for admin functions while seamlessly verifying client JWTs.
- **Standardized Errors:** Guaranteed `{ statusCode, error, message }` JSON responses on failure.

## Setup
1. Copy `.env.example` to `.env` and fill in your Supabase credentials.
2. Run `npm install`.
3. Run `npm run dev`.

The server will start on `http://localhost:3000`.
