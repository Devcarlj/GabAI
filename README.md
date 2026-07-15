
# 🚀 GabAIyan Application - Local Setup Guide

Follow this step-by-step guide to set up and run GabAIyan on your computer using Docker. This ensures everyone runs the exact same environment with zero version conflicts.

---

## 📋 Prerequisites (First-Time Setup Only)

Before doing anything, you need to install **Docker** and **Git** on your computer. You only need to do this **once**.

1. **Docker Desktop (Required):**
   * Download and install Docker Desktop for your operating system: [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
   * Open Docker Desktop after installing it to ensure the Docker engine is running in the background.
2. **Git:**
   * Download and install from [git-scm.com](https://git-scm.com/) using default options.

---

## 🛠️ Step-by-Step Installation

### Step 1: Open Terminal & Clone the Repository
Open your terminal (Terminal on Mac, or Command Prompt / Git Bash on Windows) and run the following commands to create a folder and download the project code:

```bash
# Create a folder for the project
mkdir GabAIyan

# Move inside the folder
cd GabAIyan

# Download the code into this folder (do NOT forget the '.' at the end)
git clone [https://github.com/Devcarlj/GabAI.git](https://github.com/Devcarlj/GabAI.git) .

```

---

### Step 2: Configure Environment Files (`.env`)

The backend server needs connection strings to talk to the database.

1. Open the project folder in your file explorer or code editor (like VS Code).
2. Go into the `server/` directory and look for a `.env.example` file.
3. Duplicate that file, rename the copy exactly to `.env`, and insert the required API keys or MongoDB connection strings.

---

### Step 3: Run the Application with Live Syncing (Docker Watch)

You **do not** need to open multiple terminal windows or run `npm install`. Docker will handle building the environment and downloading packages automatically inside a secure container sandbox.

Run this single command in the main `GabAIyan` directory:

```bash
docker compose up --watch

```

* **First-time launch:** Docker will download the necessary Node images, safely install all dependencies inside the containers, and launch both the frontend and backend servers.
* **Code updates (Live Reload):** The `--watch` flag tells Docker to actively listen for your code changes. The moment you edit a frontend component or a backend route in your local code editor, Docker instantly syncs it to the container, and the application updates live in your browser!
* **Package changes:** If someone pushes a Git update that changes `package.json`, Docker will automatically catch it and rebuild the image for you.

---

## 🌐 Accessing the App

Once the terminal logs show that the servers are up:

* Open your web browser (Chrome, Edge, Safari, etc.).
* Go to the frontend address: `http://localhost:5173`

---

## 📂 Project Directory Structure

```text
├── client/                 # React Frontend Application
│   ├── src/                # UI Components and Logic
│   ├── Dockerfile          # Frontend Container Configuration
│   └── package.json        # Frontend Dependencies
├── server/                 # Node.js / Express Backend API
│   ├── models/             # Database Schemas (Mongoose)
│   ├── routes/             # Endpoint Routes
│   ├── Dockerfile          # Backend Container Configuration
│   └── package.json        # Backend Dependencies
├── docker-compose.yml      # Orchestration & Live-Sync Orchestrator
└── README.md               # Setup Instructions

```

```

