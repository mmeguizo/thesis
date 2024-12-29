# NestJS Backend Thesis Project

A NestJS backend application with MongoDB, Prisma, JWT Authentication, and Role-based Authorization.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies
3. Set up environment variables
4. Run the development server
5. Generate Prisma Client

## API Documentation

Swagger documentation is available at: `http://localhost:3000/api-docs`

### Authentication Required
- Username: SWAGGER_USER from .env
- Password: SWAGGER_PASSWORD from .env

## Features

- User Authentication (Register/Login)
- JWT Token Based Authorization
- Role-Based Access Control (Admin/Teacher/Student)
- User Management (Admin only)
- Swagger API Documentation
- MongoDB with Prisma ORM
- Password Encryption
- Input Validation

## API Endpoints

### Auth
- POST /api/auth/register - Register new user (default role: STUDENT)
- POST /api/auth/login - User login
- GET /api/auth/profile - Get user profile (requires authentication)

### Users (Admin Only)
- GET /api/users - Get all users with pagination
- POST /api/users/add-user - Create new user with specified role

## Project Structure

## Git Commands

Initialize and push to repository:

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial project setup with auth and user management"

# Set main as default branch
git branch -M main

# Add remote repository
git remote add origin https://github.com/mmeguizo/thesis.git

# Push to GitHub
git push -u origin main

