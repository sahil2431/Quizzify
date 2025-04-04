# Firebase Auth API Server

This is the backend server for the Firebase Authentication project. It uses Express.js with MongoDB for data storage and Firebase Admin SDK for verifying tokens.

## Project Structure

- **config/** - Configuration files (Firebase admin setup)
- **controllers/** - Business logic separated from routes
- **middleware/** - Custom middleware (auth verification)
- **models/** - MongoDB schemas
- **routes/** - API route definitions

## ES6 Features Used

- ES6 Modules (`import`/`export` syntax)
- Arrow Functions
- Async/Await
- Template Literals
- Destructuring
- Optional Chaining
- Default Parameters

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root of the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/firebase-auth-db
   
   # Firebase Admin SDK credentials
   FIREBASE_TYPE=
   FIREBASE_PROJECT_ID=
   FIREBASE_PRIVATE_KEY_ID=
   FIREBASE_PRIVATE_KEY=
   FIREBASE_CLIENT_EMAIL=
   FIREBASE_CLIENT_ID=
   FIREBASE_AUTH_URI=
   FIREBASE_TOKEN_URI=
   FIREBASE_AUTH_PROVIDER_CERT_URL=
   FIREBASE_CLIENT_CERT_URL=
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Public Endpoints

- `GET /` - API health check

### Auth Endpoints

- `GET /api/auth/verify-token` - Verify Firebase token and get/create user

### User Endpoints (require Firebase authentication)

- `GET /api/users/me` - Get the current user's profile
- `PUT /api/users/me` - Update the current user's profile
- `GET /api/users` - Get all users (admin only)

## Architecture

This project follows the MVC (Model-View-Controller) pattern:

1. **Models**: Define data structures using Mongoose schemas
2. **Controllers**: Contain the business logic and separate it from routes
3. **Routes**: Define API endpoints and connect them to controllers
4. **Middleware**: Handle cross-cutting concerns like authentication

## Using ES6 Modules

This project uses ECMAScript Modules. The key points to note:

1. `"type": "module"` is added to the package.json to enable ES6 modules natively
2. Files are imported with their full extensions (e.g., `import User from './models/User.js'`)
3. There is no `require()` - only `import` statements
4. `module.exports` is replaced with `export default` or named exports

## Middleware

The `authMiddleware` validates Firebase tokens and stores user information in the request object for use in protected routes. 