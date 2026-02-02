# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

---

## Deploying to GitHub Pages (via GitHub Actions)

I added a GitHub Actions workflow (`.github/workflows/deploy.yml`) that will build the app and publish the `dist` output to GitHub Pages whenever you push to the `main` branch.

Steps to publish:

1. Create a repository on GitHub (https://github.com/new) and note the repo URL (e.g., `git@github.com:you/your-repo.git`).
2. In your local project, add the remote and push:

```bash
# set your repo remote (replace with your repo URL)
git remote add origin <YOUR_REPO_URL>
# ensure main branch exists locally
git branch -M main
git add .
git commit -m "Prepare project for GitHub Pages deployment"
git push -u origin main
```

After pushing, GitHub Actions will run the `deploy` workflow and publish the site. The Pages site URL will be available in the repository's Settings → Pages (or the Actions run summary will show the Pages URL).

If you want, I can prepare a branch with a README update and the workflow committed and then provide the exact git commands to push. (Note: this environment doesn't have `git` installed here, so you'll need to run the push commands locally on your machine.)


## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
