# 🚀 LeaseLens Free Deployment Guide

Deploy your LeaseLens MVP completely free using Render (backend) and Vercel (frontend).

## Prerequisites

1. **Groq API Key** - Get free from [console.groq.com](https://console.groq.com/)
2. **GitHub Account** - To connect your repos
3. Push your code to GitHub (two repos or one monorepo)

---

## Step 1: Deploy Backend on Render (Free)

### 1.1 Push Backend to GitHub

```bash
cd backend
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/leaselens-backend.git
git push -u origin main
```

### 1.2 Deploy on Render

1. Go to [render.com](https://render.com/) and sign up (free)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo (leaselens-backend)
4. Configure:
   - **Name**: `leaselens-api`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free`

5. Add Environment Variables:
   - Click **"Environment"** → **"Add Environment Variable"**
   - `GROQ_API_KEY` = your Groq API key
   - `ALLOWED_ORIGINS` = `https://leaselens.vercel.app` (update after frontend deploy)
   - `DEMO_MODE` = `false`

6. Click **"Create Web Service"**

7. Wait for deployment (takes 2-5 minutes)

8. Note your backend URL: `https://leaselens-api.onrender.com`

> ⚠️ **Note**: Free tier sleeps after 15 min inactivity. First request may take 30-60 seconds.

---

## Step 2: Deploy Frontend on Vercel (Free)

### 2.1 Push Frontend to GitHub

```bash
cd frontend
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/leaselens-frontend.git
git push -u origin main
```

### 2.2 Deploy on Vercel

1. Go to [vercel.com](https://vercel.com/) and sign up with GitHub (free)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repo (leaselens-frontend)
4. Configure:
   - **Framework Preset**: `Next.js` (auto-detected)
   - **Root Directory**: `./` (leave as is)
   
5. Add Environment Variable:
   - Click **"Environment Variables"**
   - `NEXT_PUBLIC_API_URL` = `https://leaselens-api.onrender.com` (your Render URL)

6. Click **"Deploy"**

7. Wait for deployment (takes 1-2 minutes)

8. Your app is live at: `https://leaselens.vercel.app` (or similar)

---

## Step 3: Update CORS on Render

1. Go back to Render dashboard
2. Click on your `leaselens-api` service
3. Go to **"Environment"**
4. Update `ALLOWED_ORIGINS` to your Vercel URL:
   ```
   https://leaselens.vercel.app,https://your-custom-domain.com
   ```
5. The service will auto-redeploy

---

## 🎉 Done!

Your LeaseLens is now live at your Vercel URL!

---

## Free Tier Limits

| Service | Limits |
|---------|--------|
| **Render** | 750 hours/month, sleeps after 15 min inactivity |
| **Vercel** | 100GB bandwidth, unlimited deploys |
| **Groq** | 30 req/min, 14,400 req/day |

---

## Custom Domain (Optional)

### Vercel (Frontend)
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS as instructed

### Render (Backend)
1. Go to Service Settings → Custom Domains
2. Add your API subdomain (e.g., api.yourdomain.com)

---

## Troubleshooting

### Backend returns 503
- Free tier is sleeping. First request wakes it up (wait 30-60 sec)

### CORS errors
- Check `ALLOWED_ORIGINS` includes your frontend URL exactly

### "Failed to fetch" errors
- Ensure `NEXT_PUBLIC_API_URL` has no trailing slash
- Check backend is running on Render dashboard

---

## Alternative Free Platforms

| Platform | Backend | Frontend |
|----------|---------|----------|
| Railway | ✅ (limited) | ✅ |
| Fly.io | ✅ | ✅ |
| Cloudflare Pages | ❌ | ✅ |
| Netlify | ❌ | ✅ |
| Koyeb | ✅ | ❌ |
