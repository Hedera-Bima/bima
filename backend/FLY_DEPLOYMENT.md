# Deploy BIMA Backend to Fly.io

This guide will help you deploy your SQLite3-based backend to Fly.io with persistent storage.

## Prerequisites

1. **Install Fly CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login to Fly.io:**
   ```bash
   fly auth login
   ```

3. **Create a Fly.io account** (if you don't have one) at https://fly.io/

## Step-by-Step Deployment

### 1. Initialize Fly App

```bash
cd backend
fly launch --no-deploy
```

When prompted:
- **App name**: Choose a unique name (e.g., `bima-backend-yourname`)
- **Region**: Choose closest to your users (e.g., `iad` for US East)
- **PostgreSQL**: No (we're using SQLite)
- **Redis**: No

This will create a `fly.toml` file (already provided).

### 2. Create Persistent Volumes

SQLite needs persistent storage. Create two volumes:

```bash
# Volume for database
fly volumes create bima_data --region iad --size 1

# Volume for uploaded files
fly volumes create bima_uploads --region iad --size 3
```

**Note**: Replace `iad` with your chosen region if different.

### 3. Set Environment Variables (Optional)

If you're using OpenAI:

```bash
fly secrets set OPENAI_API_KEY="your-api-key-here"
fly secrets set OPENAI_MODEL="gpt-3.5-turbo"
```

### 4. Deploy Your App

```bash
fly deploy
```

This will:
- Build your Docker image
- Deploy to Fly.io
- Mount persistent volumes
- Start your application

### 5. Check Deployment Status

```bash
# View app status
fly status

# View logs
fly logs

# Open your app in browser
fly open
```

Your API will be available at:
```
https://your-app-name.fly.dev/api/health
```

## Important Notes

### Persistent Storage

Your `fly.toml` is configured with two persistent volumes:
- `/app/data` - SQLite database storage
- `/app/uploads` - Image and document uploads

**Data persists across deployments and restarts!**

### Scaling Considerations

**Single Instance Only**: SQLite works best with a single instance. The current configuration uses:
- `min_machines_running = 0` - Auto-stop when idle (saves money)
- `auto_start_machines = true` - Auto-start on requests

If you need multiple instances, consider migrating to PostgreSQL.

### Free Tier

Fly.io free tier includes:
- Up to 3 shared-cpu-1x VMs with 256MB RAM
- 3GB persistent volume storage
- 160GB outbound data transfer

Your app should stay within free tier for hackathon/demo purposes!

## Useful Commands

```bash
# View app status
fly status

# View real-time logs
fly logs

# SSH into your app
fly ssh console

# Check volume status
fly volumes list

# Scale memory (if needed)
fly scale memory 512

# Restart app
fly apps restart bima-backend

# Destroy app (careful!)
fly apps destroy bima-backend
```

## Troubleshooting

### Database Not Persisting

Make sure volumes are created and mounted:
```bash
fly volumes list
```

### Build Errors

If you get build errors with `better-sqlite3`:
```bash
# Rebuild with --no-cache
fly deploy --no-cache
```

### App Not Starting

Check logs:
```bash
fly logs
```

Common issues:
- Missing volumes (create them first)
- Port mismatch (should be 5000)
- Build dependencies missing (Dockerfile includes them)

### Volume Full

Check volume usage:
```bash
fly ssh console
df -h
```

Extend volume size:
```bash
fly volumes extend <volume-id> --size 5
```

## Updating Your App

After making code changes:

```bash
# Deploy updates
fly deploy

# View deployment status
fly status
```

## Frontend Configuration

Update your frontend to use the Fly.io URL:

```typescript
// In your frontend API configuration
const API_URL = 'https://your-app-name.fly.dev/api';
```

## Cost Optimization

To minimize costs:
- Use `auto_stop_machines = true` (already configured)
- Keep volumes small (1GB for data, 3GB for uploads)
- Monitor usage: https://fly.io/dashboard

## Next Steps

1. Deploy your backend to Fly.io
2. Test all endpoints
3. Update frontend API URL
4. Deploy frontend (Vercel/Netlify recommended)
5. Present to judges! 🎉

## Support

- Fly.io Docs: https://fly.io/docs/
- Community Forum: https://community.fly.io/
- Discord: https://fly.io/discord
