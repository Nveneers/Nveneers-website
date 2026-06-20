# Website Handoff Guide

This guide explains how to put this website live on **your own Vercel account** — no GitHub account is needed. Everything runs on accounts **you** create, so the site is fully yours.

Set aside about **30–45 minutes**. You do not need to be a programmer; just follow the steps in order.

---

## What you'll need (3 free accounts + Node.js)

| Account | What it's for | Sign up at |
| --- | --- | --- |
| **Vercel** | Hosts the live website | https://vercel.com/signup (use the free "Hobby" plan) |
| **Supabase** | Stores form submissions + uploaded photos | https://supabase.com (free plan) |
| **Google AI Studio** | Powers the smile-photo check (Gemini) | https://aistudio.google.com/app/apikey |

You'll also need **Node.js** installed on your computer (only to run one deploy command):
- Download the "LTS" version from https://nodejs.org and install it.

> 💡 You can create all three accounts with the same email. The website itself does not need a GitHub account.

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

## Step 3 — Choose your admin login + security secrets

The website has a private admin page (`/admin`) to view submissions. You pick the login, and you generate two random "secret" strings.

1. Decide on an **admin username** and a **strong admin password** (don't reuse the example `admin` / `admin135` — those were the old developer's).
2. Generate two random secrets. Open a terminal (on Windows, open **PowerShell**) and run this **twice** — copy each result:

   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

   - First result → use as `ADMIN_COOKIE_SECRET`
   - Second result → use as `CHALLENGE_SECRET`

You now have all the values for Step 5. Keep them handy.

---

## Step 4 — Remove the old secrets from the folder

Inside the project folder there may be a file named **`.env`** containing the previous developer's keys. **Delete that `.env` file** before deploying — you'll be supplying your own values in the next step, and you don't want the old ones going live.

---

## Step 5 — Put the website live on Vercel (no GitHub)

You'll upload the project folder straight to Vercel using a small command-line tool. This is the easy "upload the folder" path — no GitHub repository required.

1. Sign up at https://vercel.com/signup (choose the free **Hobby** plan).
2. Open a terminal (**PowerShell** on Windows) and install the Vercel tool:

   ```powershell
   npm install -g vercel
   ```

3. Move into the project folder. For example:

   ```powershell
   cd "path\to\the\Website\folder"
   ```

4. Run:

   ```powershell
   vercel
   ```

   - It will ask you to log in — choose **"Continue with Email"** (or whichever you used) and confirm via the link it sends.
   - When it asks "Set up and deploy?" press **Enter** (Yes).
   - For the remaining questions, just press **Enter** to accept the defaults.

   This uploads the whole folder to Vercel and builds the site. When it finishes, it prints a link — the site is live (but the features won't work yet until you add the keys below).

5. **Add your keys.** Go to https://vercel.com/dashboard, open the new project, then **Settings → Environment Variables**. Add each row from the table below (Name on the left, your value on the right). Set each one for **Production**.

6. After adding all variables, redeploy so they take effect:

   ```powershell
   vercel --prod
   ```

   Done — open the printed link. The form, photo upload, smile check, and `/admin` login should all work.

---

## Environment variables — the full list

These are the values you collected in Steps 1–3. Add every one of them in Vercel (Step 5.5).

| Name | What it is | Where it comes from |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase → Settings → API (Step 1) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase secret key (full DB access) | Supabase → Settings → API (Step 1) |
| `GEMINI_API_KEY` | Google Gemini key for the smile check | Google AI Studio (Step 2) |
| `ADMIN_USERNAME` | Login name for the `/admin` page | You choose (Step 3) |
| `ADMIN_PASSWORD` | Login password for the `/admin` page | You choose (Step 3) |
| `ADMIN_COOKIE_SECRET` | Random secret that keeps admin logins secure | Generated (Step 3) |
| `CHALLENGE_SECRET` | Random secret that protects the form from bots | Generated (Step 3) |

> ⚠️ Keep `SUPABASE_SERVICE_ROLE_KEY` and the two secrets private. Never post them publicly or share them in screenshots — anyone with the service_role key has full access to your database.

---

## Connecting a custom domain (optional)

In the Vercel project: **Settings → Domains → Add**, type your domain, and follow Vercel's instructions to point it (it shows the exact DNS records to add at your domain registrar).

---

## Making changes later

Whenever you want to publish an update to the code, just open the project folder in a terminal and run:

```powershell
vercel --prod
```

That uploads and publishes the latest version. No GitHub needed.

---

## Quick troubleshooting

- **The smile check fails** → check `GEMINI_API_KEY` is correct in Vercel, then run `vercel --prod` again.
- **Submitting the form errors** → confirm the Supabase `submissions` table and the public `smile-photos` bucket exist (Step 1), and that the two Supabase variables are set correctly.
- **Can't log into `/admin`** → confirm `ADMIN_USERNAME` / `ADMIN_PASSWORD` are set in Vercel and you redeployed with `vercel --prod`.
- **Changed a variable but nothing changed** → environment variables only apply after a fresh deploy: run `vercel --prod`.
