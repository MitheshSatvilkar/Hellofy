# Project Name

A full-stack web application built with:

- **Frontend:** React.js
- **Backend:** Node.js
- **Database:** MongoDB

The project is organized into two separate folders:

```
project-root/
│
├── frontend/     # React.js application
├── backend/      # Node.js + Express API
└── README.md
```

---

# Prerequisites

Before running this project, make sure the following software is installed on your system.

## 1. Node.js

Install Node.js (LTS version recommended).

Verify installation:

```bash
node -v
npm -v
```

---

## 2. MongoDB

Install MongoDB Community Edition and make sure the MongoDB service is running locally.

Verify MongoDB is running before starting the backend server.

---

# Getting Started

## Step 1: Download the Project

Download the repository as a ZIP file from GitHub.

Or clone it using Git:

```bash
git clone <repository-url>
```

---

## Step 2: Extract the ZIP

If you downloaded the ZIP:

- Extract it to your desired location.
- Open a terminal in the extracted project folder.

---

# Install Dependencies

Both frontend and backend have their own dependencies.

## Install Backend Dependencies

```bash
cd backend
npm install
```

Wait until all packages are installed.

---

## Install Frontend Dependencies

Open another terminal (or return to project root):

```bash
cd frontend
npm install
```

Wait until installation completes.

---

# Database Setup

The backend uses MongoDB.

Ensure:

- MongoDB is installed.
- MongoDB service is running locally.
- Your backend configuration points to your local MongoDB instance.

---

# Import Demo Data

Before running the application for the first time, populate the database with demo data.

Open a terminal inside the backend folder:

```bash
cd backend
```

Run:

```bash
node dev-data/import-dev-data.js --import
```

This command imports sample/demo data into the MongoDB database.

> **Important:** Run this command only after MongoDB is running.

---

# Running the Application

The frontend and backend must both be started separately.

---

## Start Backend

Navigate to:

```bash
cd backend
```

Run:

```bash
npm run dev
```

The backend development server will start.

---

## Start Frontend

Open another terminal.

Navigate to:

```bash
cd frontend
```

Run:

```bash
npm run dev
```

The React development server will start.

---

# Development Workflow

After setup, your workflow will usually be:

1. Start MongoDB
2. Start Backend

```bash
cd backend
npm run dev
```

3. Start Frontend

```bash
cd frontend
npm run dev
```

Open the application in your browser using the URL shown in the terminal (typically provided by the React development server).

---

# Project Structure

```
project-root/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── dev-data/
│   │    └── import-dev-data.js
│   ├── package.json
│   └── ...
│
└── README.md
```

---

# Available Commands

## Backend

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Import demo data:

```bash
node dev-data/import-dev-data.js --import
```

---

## Frontend

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

---

# First-Time Setup Checklist

- [ ] Install Node.js
- [ ] Install MongoDB
- [ ] Start MongoDB service
- [ ] Download or clone the repository
- [ ] Install backend dependencies (`npm install`)
- [ ] Install frontend dependencies (`npm install`)
- [ ] Import demo data

```bash
node dev-data/import-dev-data.js --import
```

- [ ] Start backend

```bash
npm run dev
```

- [ ] Start frontend

```bash
npm run dev
```

---

# Troubleshooting

## npm install fails

Try deleting the `node_modules` folder and reinstalling:

```bash
npm install
```

---

## MongoDB Connection Error

Make sure:

- MongoDB is installed.
- MongoDB service is running.
- The backend is configured to connect to the correct MongoDB instance.

---

## Demo Data Not Appearing

Verify that:

- MongoDB is running.
- The import command completed successfully.

Run again if necessary:

```bash
node dev-data/import-dev-data.js --import
```

---

## Backend Does Not Start

Ensure:

- All backend dependencies are installed.
- MongoDB is running.
- Environment variables (if required) are properly configured.

---

## Frontend Does Not Start

Ensure:

- All frontend dependencies are installed.
- The backend server is already running if API calls are required.

---

# Technologies Used

### Frontend

- React.js
- JavaScript
- npm

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

---

# Notes

- Both frontend and backend are independent Node.js projects.
- Each folder contains its own `package.json`.
- Run `npm install` separately inside both folders.
- Run `npm run dev` separately for frontend and backend.
- Demo data only needs to be imported before the first run (or whenever you want to reset the database).

---

# License

This project is intended for educational/development purposes. Update this section with your preferred license if distributing publicly.