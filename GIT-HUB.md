# 🚀 Team Contribution Guide
Welcome to the team! To keep our codebase stable and avoid messy merge conflicts, we use a structured workflow. Please follow these guidelines whenever you are working on a new feature or bug fix.
---
## 🔑 1. Setup Your Environment Variables (`.env`)

We **never** commit secret passwords or database connection strings directly to GitHub. 

1. Find the `.env.example` file in the root directory.
2. Duplicate the file and rename the copy to exactly `.env`.
3. Open your new `.env` file and fill in the missing values (ask the repository owner for the live MongoDB URI connection string via our private chat).

*Note: Your `.env` file is already listed in `.gitignore`, so it will stay safely on your local computer and will never be pushed to GitHub.*
---## 🌿 2. The Feature Branch Workflow
Our `main` branch is protected and locked down. **You cannot push code directly to `main` (`git push origin main` will be rejected).** All work must be done on a separate branch and submitted via a Pull Request.
### Step-by-Step Cycle for Every New Feature:

#### 1️⃣ Start with a Clean SlateBefore starting any new task, switch to your local `main` branch and pull the latest changes that other teammates have merged:

```bash
git checkout main
git pull origin main
```
#### 2️⃣ Create a Fresh Feature BranchCreate a brand-new branch named after the task you are working on. Use prefixes like `feature/` or `bugfix/`:
```bash
git checkout -b feature/add-login-page
```
#### 3️⃣ Write Code and Commit Your ChangesWork on your feature in VS Code. When you are ready, stage and commit your work locally:
```bash
git add .
git commit -m "Add user login interface and form validation"
```
#### 4️⃣ Push Your Branch to GitHubPush your custom feature branch up to the remote repository:

```bash
git push origin feature/add-login-page
```
#### 5️⃣ Open a Pull Request (PR)1. Go to our repository page on GitHub.2. Click the green **Compare & pull request** button that pops up.3. Describe what you built and submit it for review. 
4. Wait for the project owner to review, approve, and merge your code into the `main` branch.
---## 🧹 3. Next Steps After Your Code is Merged
Once your Pull Request is successfully merged into `main` on GitHub, your feature branch's lifecycle is completely over. **Do not reuse it for your next task.** Clean up your terminal using this exact sequence:

```bash
# 1. Switch back to your local main branch
git checkout main

# 2. Download the newly merged code (yours + teammate updates)
git pull origin main

# 3. Delete your old local feature branch to stay organized
git branch -d feature/add-login-page

# 4. Ready for a new feature? Start fresh!
git checkout -b feature/your-next-task-name
```
