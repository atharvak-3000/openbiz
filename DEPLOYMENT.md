# 🚀 Deployment Guide - Railway

This guide will help you deploy the Openbiz assignment to Railway, a free hosting platform.

## 📋 Prerequisites

1. **GitHub Account** - Your code is already on GitHub
2. **Railway Account** - Sign up at [railway.app](https://railway.app)

## 🚀 Deploy to Railway

### Method 1: Deploy from GitHub (Recommended)

1. **Go to Railway Dashboard**
   - Visit [railway.app](https://railway.app)
   - Sign in with your GitHub account

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository: `atharvak-3000/openbiz`

3. **Configure Deployment**
   - Railway will automatically detect the Node.js project
   - The `railway.json` and `nixpacks.toml` files will configure the deployment
   - Click "Deploy"

4. **Set Environment Variables** (if needed)
   - Go to your project settings
   - Add any environment variables if required

### Method 2: Deploy Backend and Frontend Separately

#### Backend Deployment
1. Create a new Railway project
2. Connect to your GitHub repo
3. Set the root directory to `backend`
4. Deploy

#### Frontend Deployment
1. Create another Railway project
2. Connect to your GitHub repo
3. Set the root directory to `frontend`
4. Deploy

## 🔧 Configuration Files

### railway.json
- Configures Railway deployment settings
- Sets health check endpoint
- Defines restart policies

### nixpacks.toml
- Configures build process
- Installs dependencies
- Builds frontend
- Starts backend server

### package.json (Root)
- Defines project scripts
- Sets Node.js version requirements
- Manages concurrent development

## 🌐 Access Your Deployed App

After deployment, Railway will provide:
- **Backend URL**: `https://your-project-name.up.railway.app`
- **Frontend URL**: `https://your-frontend-project.up.railway.app`

## 🔄 Update Deployment

To update your deployed app:
1. Make changes to your code
2. Commit and push to GitHub
3. Railway will automatically redeploy

## 💰 Free Tier Limits

Railway's free tier includes:
- **$5 credit** per month
- **Automatic deployments** from GitHub
- **Custom domains** support
- **SSL certificates** included

## 🐛 Troubleshooting

### Common Issues:
1. **Build Failures**: Check the build logs in Railway dashboard
2. **Port Issues**: Railway automatically assigns ports
3. **Environment Variables**: Ensure all required env vars are set

### Logs:
- View deployment logs in Railway dashboard
- Check application logs for runtime errors

## 🔗 Alternative Platforms

If Railway doesn't work, consider:
- **Vercel** - Great for frontend deployment
- **Netlify** - Excellent for static sites
- **Heroku** - Classic choice (limited free tier)
- **Fly.io** - Good for full-stack apps

## 📞 Support

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **GitHub Issues**: Report issues in your repository
- **Community**: Railway Discord server
