# Firebase Authentication with React and MongoDB

This project demonstrates a full-stack application with Firebase Authentication on the frontend (React) and MongoDB for data storage on the backend (Node.js/Express).

## Project Structure

- `client/` - React frontend with Firebase Authentication
- `server/` - Node.js/Express backend with MongoDB

## Setup Instructions

### Prerequisites

- Node.js installed
- MongoDB installed and running
- Firebase account

### Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Add a web app to your Firebase project
3. Enable Authentication (Email/Password and Google Sign-in methods)
4. Generate Firebase Admin SDK service account key (for backend)
5. Copy your Firebase configuration details

### Client Setup

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Update Firebase configuration in `src/firebase.js` with your own Firebase config

4. Start the development server:
   ```
   npm run dev
   ```

### Server Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file and add your environment variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/firebase-auth-db
   ```

4. Add your Firebase Admin SDK configuration details to the `.env` file (or use a JSON file)

5. Start the server:
   ```
   npm run dev
   ```

## Features

### Authentication
- User registration and login using Firebase
- Role-based authentication (Teacher/Student)
- Google authentication integration
- Protected routes with React Router

### Dashboard & Account Management
- User profile management and account details
- Role-specific dashboards for students and teachers

### Quiz Functionality
- **For Students:**
  - Join existing quizzes using a quiz code
  - Take AI-generated quizzes based on subject, course, and difficulty
  - View history of previously taken quizzes
  
- **For Teachers:**
  - Host new quizzes
  - Manage existing quizzes
  - View student performance analytics

### Quiz Taking Experience
- Distraction-free quiz interface (no sidebar)
- Options to exit or submit quizzes
- Support for various question types

## User Flow
1. New users sign up and select their role (Teacher/Student)
2. Users are directed to their role-specific dashboard
3. Students can join quizzes by code or take AI-generated quizzes
4. Teachers can create and manage quizzes
5. When taking a quiz, users see a clean interface with only quiz content and submit/exit buttons

## Technologies Used

- **Frontend**: React, Vite, Firebase Auth, React Router, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB, Mongoose, Firebase Admin SDK
- **Additional**: AI integration for quiz generation 