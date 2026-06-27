# Website Handoff Guide

This guide explains how to put this website live on **your own GitHub + Vercel accounts**. Everything runs on accounts **you** create, so the site is fully yours.

Set aside about **30–45 minutes**. You do not need to be a programmer; just follow the steps in order.

---

## What you'll need (4 free accounts)

| Account | What it's for | Sign up at |
| --- | --- | --- |
| **GitHub** | Stores the website's code | https://github.com/signup (free) |
| **Vercel** | Hosts the live website | https://vercel.com/signup (use the free "Hobby" plan) |
| **Supabase** | Stores form submissions + uploaded photos | https://supabase.com (free plan) |
| **Google AI Studio** | Powers the smile-photo check (Gemini) | https://aistudio.google.com/app/apikey |

Almost everything is done in your web browser. There's one short step where you paste a few commands into the Mac **Terminal** to send the code to GitHub (Step 5) — it's copy-and-paste, no programming.

> 💡 You can create all four accounts with the same email.

---

## Step 1 — Set up Supabase (your database + photo storage)

1. Go to https://supabase.com, sign up, and click **New Project**. Give it any name and choose a password (save that password somewhere).
2. Once the project is ready, open **Project Settings → API**. Copy and save these two values — you'll need them later:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **service_role** key (under "Project API keys" — the **secret** one, *not* the "anon public" one)
3. In the left menu, open the **SQL Editor**, click **New query**, paste the block below, and click **Run**. This creates the table the website saves submissions into:

   ```sql
   create table submissions (
     id uuid primary key default gen_random_uuid(),
     name text not null,
     phone text not null,
     photo_url text not null,
     status text not null default 'new',
     created_at timestamptz not null default now()
   );
   ```

4. In the left menu, open **Storage** → **New bucket**. Name it exactly:

   ```
   smile-photos
   ```

   Turn **ON** the **"Public bucket"** option, then create it. (The bucket must be public so uploaded photos can be shown.)

---

## Step 2 — Get a Gemini API key

1. Go to https://aistudio.google.com/app/apikey and sign in with a Google account.
2. Click **Create API key** and copy the key. Save it — this is your `GEMINI_API_KEY`.

---

## Step 3 — Your admin login + security secrets

The website has a private admin page (`/admin`) to view submissions. It needs four values:

- `ADMIN_USERNAME` — the login name for the `/admin` page
- `ADMIN_PASSWORD` — the login password for the `/admin` page
- `ADMIN_COOKIE_SECRET` — a random secret that keeps admin logins secure
- `CHALLENGE_SECRET` — a random secret that protects the form from bots

**The developer is providing these four values to you as ready-to-paste text.** You don't need to create or generate anything — just keep them handy. You'll paste them into Vercel in Step 5.

---

## Step 4 — Remove the old secrets from the folder

Inside the project folder there may be a file named **`.env`** containing the previous developer's keys. **Delete that `.env` file now** — you'll be supplying your own values directly in Vercel in Step 5, so the website never needs this file.

> ℹ️ The project is already set up to **never upload `.env` to GitHub** (it's listed in a file called `.gitignore`). Deleting it is just an extra safety step so the old keys can't leak.

---

## Step 5 — Put the website live (GitHub → Vercel)

You'll put the website's code on **GitHub** (one short Terminal step), then connect **Vercel** to it in the browser. Vercel automatically builds and hosts the site from your GitHub code.

### 5a. Send the code to GitHub

The GitHub website's "drag files here" uploader **can't handle a website this size** (too many files). Instead, you'll paste a few ready-made commands into the Mac Terminal — this is the method GitHub itself recommends, and it's just copy-and-paste.

1. Sign up at https://github.com/signup (free).
2. Click the **+** in the top-right corner → **New repository**.
3. Give it any name (for example `smile-website`), choose **Private**, and click **Create repository**.
4. On the next page, find the address that looks like **`https://github.com/.../....git`** and **copy it** — you'll paste it in below.
5. Open the **Terminal** app (press ⌘+Space, type "Terminal", hit Return).
6. Type `cd ` (the letters c, d, and a space), then **drag the project folder from Finder onto the Terminal window** — it fills in the path. Press Return.
7. Copy the block below into Terminal and press Return. **Before running, replace the `https://github.com/YOUR-NAME/YOUR-REPO.git` line with the address you copied in step 4:**

   ```bash
   git init
   git add .
   git commit -m "Initial website upload"
   git branch -M main
   git remote add origin https://github.com/YOUR-NAME/YOUR-REPO.git
   git push -u origin main
   ```

   - The first time, GitHub will ask you to **sign in** (a browser window opens, or it asks for a password/token). Complete that and it continues.
   - When it finishes, refresh your GitHub repository page in the browser — you'll see the code (the `src` folder, `package.json`, and so on).

   > ℹ️ You **won't** see folders called `node_modules`, `.next`, or `venv`, and you won't see `.env`. That's correct — they're left out on purpose. Vercel rebuilds them automatically, and your secret keys go straight into Vercel (next step), not GitHub.

### 5b. Connect Vercel and go live

1. Sign up at https://vercel.com/signup (choose the free **Hobby** plan). When asked, sign up **with your GitHub account** — this links the two automatically.
2. Click **Add New… → Project**.
3. Find your repository in the list and click **Import**. (If Vercel asks for permission to access your GitHub, click **Install / Authorize**.)
4. Before clicking Deploy, open the **Environment Variables** section and add each row from the table below — the **Name** on the left, your **value** on the right. Add all of them.
5. Click **Deploy** and wait for the build to finish.

   When it's done, Vercel shows a **Visit** button with your live link. Open it — the form, photo upload, smile check, and `/admin` login should all work.

---

## Environment variables — the full list

These are the values you collected in Steps 1–3. Add every one of them in Vercel (Step 5b).

| Name | What it is | Where it comes from |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase → Settings → API (Step 1) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase secret key (full DB access) | Supabase → Settings → API (Step 1) |
| `GEMINI_API_KEY` | Google Gemini key for the smile check | Google AI Studio (Step 2) |
| `ADMIN_USERNAME` | Login name for the `/admin` page | Provided by developer (Step 3) |
| `ADMIN_PASSWORD` | Login password for the `/admin` page | Provided by developer (Step 3) |
| `ADMIN_COOKIE_SECRET` | Random secret that keeps admin logins secure | Provided by developer (Step 3) |
| `CHALLENGE_SECRET` | Random secret that protects the form from bots | Provided by developer (Step 3) |

> ⚠️ Keep `SUPABASE_SERVICE_ROLE_KEY` and the two secrets private. Never post them publicly or share them in screenshots — anyone with the service_role key has full access to your database.

---

## Connecting a custom domain (optional)

In the Vercel project: **Settings → Domains → Add**, type your domain, and follow Vercel's instructions to point it (it shows the exact DNS records to add at your domain registrar).

---

## Making changes later

Whenever you want to publish an update to the code, open the **Terminal**, go into the project folder (`cd ` then drag the folder in, as in Step 5a), and run:

```bash
git add .
git commit -m "Update"
git push
```

Vercel notices the change on GitHub and **automatically rebuilds and publishes** the new version. You can watch it under **Deployments** in your Vercel project.

---

## Quick troubleshooting

- **The smile check fails** → check `GEMINI_API_KEY` is correct in Vercel, then go to **Deployments → Redeploy**.
- **Submitting the form errors** → confirm the Supabase `submissions` table and the public `smile-photos` bucket exist (Step 1), and that the two Supabase variables are set correctly.
- **Can't log into `/admin`** → confirm `ADMIN_USERNAME` / `ADMIN_PASSWORD` are set in Vercel, then **Deployments → Redeploy**.
- **Changed a variable but nothing changed** → environment variables only apply after a fresh deploy: go to **Deployments → Redeploy** in your Vercel project.
