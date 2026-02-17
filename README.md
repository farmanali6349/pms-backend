# Backend

This document provides an overview of the backend services, their architecture, setup, and deployment.

## Table of Contents

- [Backend](#backend)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Technology Stack](#technology-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Application](#running-the-application)
  - [Project Structure](#project-structure)
  - [Database](#database)
    - [Schema](#schema)
    - [Relations](#relations)
  - [API Endpoints](#api-endpoints)
  - [Job Queue](#job-queue)
  - [Environment Variables](#environment-variables)

## Overview

The backend is an Express.js application responsible for handling API requests, interacting with the database, and processing background jobs. It uses Clerk for authentication and Inngest for serverless function management.

## Technology Stack

- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **Drizzle ORM**: TypeScript ORM for PostgreSQL
- **PostgreSQL**: Relational database
- **Clerk**: User authentication and authorization
- **Inngest**: Serverless background jobs and scheduled functions
- **CORS**: Cross-Origin Resource Sharing middleware
- **Dotenv**: Loading environment variables from a `.env` file

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Clerk Account
- Inngest Account

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Create a `.env` file in the `backend` directory and configure your environment variables (see [Environment Variables](#environment-variables)).
2. Start the development server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000` (or `PORT` specified in `.env`).

## Project Structure

```
backend/
├── server.js               # Main application entry point
├── package.json            # Project dependencies and scripts
├── drizzle.config.js       # Drizzle ORM configuration
├── src/
│   ├── config/             # Configuration files
│   │   └── config.js       # Database URL configuration
│   ├── db/                 # Database related files
│   │   ├── db.js           # Drizzle ORM instance
│   │   ├── relations.js    # Drizzle ORM schema relations
│   │   └── schema.js       # Drizzle ORM database schema
│   └── inngest/            # Inngest serverless functions
│       └── index.js        # Inngest client and function definitions
│   └── validation/         # Zod validation schemas
│       ├── clerk.js        # Clerk webhook payload schemas
│       └── validation.js   # Entity validation schemas
└── README.md               # This file
```

## Database

The database uses PostgreSQL and Drizzle ORM for schema definition and interactions.

### Schema

The `src/db/schema.js` file defines the database tables and their columns, including:

- `users`: Stores user information.
- `workspaces`: Represents different workspaces, owned by users.
- `workspaceMembers`: Junction table for users and workspaces.
- `projects`: Projects within a workspace, with an assigned team lead.
- `projectMembers`: Junction table for users and projects.
- `tasks`: Tasks within a project, assigned to users.
- `comments`: Comments on tasks, made by users.

### Relations

The `src/db/relations.js` file defines the relationships between the different tables using Drizzle ORM's `relations` function. This includes one-to-many and many-to-many relationships crucial for data integrity and querying.

## API Endpoints

- `GET /`: Basic endpoint to check if the server is live.
- `POST /api/inngest`: Endpoint for Inngest serverless functions.
- Other API endpoints will be added for managing users, workspaces, projects, tasks, and comments (to be implemented).

## Job Queue

This project integrates [Inngest](https://www.inngest.com/) for handling background jobs and scheduled tasks. Inngest functions are defined in `src/inngest/index.js`.

## Environment Variables

Create a `.env` file in the backend root directory with the following variables:

- `PORT`: Port for the Express server (default: `5000`).
- `DATABASE_URL`: Connection string for your PostgreSQL database.
- `CLERK_SECRET_KEY`: Your Clerk secret key for authentication.
- `INNGEST_SIGNING_KEY`: Your Inngest signing key.
- `INNGEST_EVENT_KEY`: Your Inngest event key.
