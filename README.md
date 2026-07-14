
# 🚀 GabAIyan Application - Local Setup Guide

Follow this step-by-step guide to set up and run GabAIyan on your computer.

---

## 📋 Prerequisites (First-Time Setup Only)

Before doing anything, you need two essential tools installed on your computer. You only need to do this **once**.

1. **Node.js (Required):**
   * Download the **LTS (Long Term Support)** version from [nodejs.org](https://nodejs.org/).
   * Run the installer and click "Next" through all default settings.
2. **Git:**
   * Download and install from [git-scm.com](https://git-scm.com/) using default options.

> **Verification:** Open your Terminal (Mac/Linux) or Command Prompt / Git Bash (Windows) and run:
> ```bash
> node -v
> npm -v
> ```
> If both commands show version numbers, you are ready!

---

## 🛠️ Step-by-Step Installation

### Step 1: Open Terminal & Clone the Repository
Open your terminal and run the following commands to create a project folder on your computer and download the code:

```bash
# Create a folder for the project (replace 'my-mern-app' with your preferred folder name)
mkdir GabAIyan

# Move inside the folder
cd GabAIyan

# Download the code into this folder (do NOT forget the '.' at the end)
git clone https://github.com/Devcarlj/GabAI.git .

```

---

### Step 2: Configure Environment Files (`.env`)

If the project uses environment configuration files:

1. Open the project folder in your file explorer or code editor.
2. Check if there are `.env.example` files inside `server/` or `client/`.
3. Duplicate those files, rename the copies to strictly `.env`, and insert the required API keys or database strings.


---

### Step 3: Install Dependencies (`npm ci`)

To prevent any version conflicts, we use `npm ci` instead of standard install.

Run these exact commands in your terminal:

```bash
# 1. Navigate to the backend server directory and install packages
cd server
npm ci

# 2. Navigate to the frontend client directory and install packages
cd ../client
npm ci

# 3. Go back to the main project folder
cd ..

```

---

## 🚀 Running the Application

To run the application, you need to start **both** the backend server and frontend client simultaneously using **two separate terminal windows**.

### Terminal Window 1 (Backend Server)

Open your first terminal window, navigate to the project, and run:

```bash
cd server
npm run dev

```

*(Leave this terminal running in the background).*

### Terminal Window 2 (Frontend Client)

Open a second terminal window, navigate to the project, and run:

```bash
cd client
npm run dev

```

---

## 🌐 Accessing the App

Once both terminals are running without errors:

* Open your web browser (Chrome, Edge, Safari, etc.).
* Go to the URL shown in **Terminal Window 2** (typically `http://localhost:5173` or `http://localhost:3000`).

---

## 📂 Project Directory Structure

```text
├── client/                 # React Frontend Application
│   ├── src/                # UI Components and Logic
│   ├── package.json        # Frontend Configuration
│   └── package-lock.json   # Exact Lockfile for Dependencies
├── server/                 # Node.js / Express Backend API
│   ├── models/             # Database Schemas (Mongoose)
│   ├── routes/             # Endpoint Routes
│   ├── package.json        # Backend Configuration
│   └── package-lock.json   # Exact Lockfile for Dependencies
└── README.md               # Setup Instructions

```

```

```
