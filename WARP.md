# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is the Afiyet backend application, a NestJS-based API server for managing patient data and medical examinations. The system handles patient registration, medical examinations, and data synchronization between tablets and the server.

## Common Commands

### Development
```bash
# Install dependencies
yarn install

# Run in development mode with hot reload
yarn start:dev

# Run in debug mode
yarn start:debug

# Build the project
yarn build

# Run in production mode
yarn start:prod
```

### Testing
```bash
# Run unit tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run with coverage
yarn test:cov

# Run e2e tests
yarn test:e2e

# Debug tests
yarn test:debug
```

### Code Quality
```bash
# Lint code
yarn lint

# Format code
yarn format
```

## Architecture Overview

### Core Structure
The application follows NestJS modular architecture with three main business domains:

1. **Patient Module** (`src/patient/`) - Handles patient registration, management, and ID assignment
2. **Examination Module** (`src/examination/`) - Manages medical examination records
3. **Sync Module** (`src/sync/`) - Handles bidirectional data synchronization between tablets and server

### Key Architectural Patterns

#### Data Models
- **Patient Model**: Stores patient demographics with both permanent (`patientId`) and temporary (`tmpPatientId`) ID support
- **Examination Model**: Contains comprehensive medical examination data with 40+ symptom/vital sign fields
- **PatientId Model**: Manages unique patient ID generation and assignment

#### Synchronization System
The sync system supports bidirectional data flow:
- **Tablet → Server**: Handles CREATE operations for patients and examinations
- **Server → Tablet**: Returns all patients and examinations for offline access
- Uses temporary IDs during offline operation, later reconciled with permanent IDs

#### Validation & Error Handling
- Custom Zod validation pipe (`ZodValidationPipe`) for request validation
- Comprehensive error handling with detailed logging
- Patient existence guards for examination creation

### Dependencies
- **MongoDB**: Primary database using Mongoose ODM
- **@aafiat/common**: Shared types and interfaces across the application
- **Zod**: Schema validation
- **Multer**: File upload handling
- **Moment**: Date/time manipulation

### Database Configuration
MongoDB connection is configured through environment variables:
- `MONGODB_URI`: Database connection string
- `MONGODB_DB_NAME`: Database name (default: "afiyet")
- `MONGODB_USER`: Database username
- `MONGODB_PASSWORD`: Database password

### Testing Strategy
- Unit tests using Jest with TypeScript support
- E2E tests in `test/` directory
- Coverage reporting enabled
- Test files follow `*.spec.ts` pattern in `src/` directory

## Development Notes

### Patient ID Management
The system uses a dual-ID approach:
- Temporary IDs for offline tablet operation
- Permanent IDs assigned by server during synchronization
- PatientIdService manages ID generation and assignment

### File Uploads
The system handles compressed images through the `scripts/save_compressed_image.sh` script and Pako compression library.

### Environment Setup
Copy `.env.example` to `.env` and configure MongoDB connection details before running the application.

### Code Standards
- TypeScript strict mode enabled with some relaxed settings for NestJS compatibility
- ESLint + Prettier for code formatting
- Decorators and metadata emission enabled for NestJS functionality