# GEMINI.md

## Project Overview

This project is a monorepo containing two main packages: `gateway` and `tools/weather`.

The `gateway` is a Node.js application built with TypeScript, Fastify, and Prisma. It acts as a central gateway for the Model-Context-Protocol (MCP). It handles user authentication, and provides a routing mechanism for MCP tools.

The `tools/weather` package is a command-line tool that provides weather information. It is designed to be used as a tool within the MCP ecosystem.

## Building and Running

### Gateway

*   **Install dependencies:** `npm install`
*   **Run in development mode:** `npm run dev`
*   **Build for production:** `npm run build`
*   **Run in production:** `npm run start`
*   **Run tests:** `npm run test`
*   **Prisma migrations:** `npm run prisma:migrate`

### Weather Tool

*   **Install dependencies:** `npm install`
*   **Run in development mode:** `npm run dev`
*   **Build for production:** `npm run build`
*   **Run in production:** `npm run start`

## Development Conventions

*   The project uses TypeScript for static typing.
*   The `gateway` uses Fastify for the web server and Prisma as the ORM.
*   Testing is done with Jest.
*   The project follows the standard Node.js project structure.
