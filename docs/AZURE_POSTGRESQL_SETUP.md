# Azure PostgreSQL Setup Guide for Savebucks

## Prerequisites
- Azure account with student credits ($100)
- Azure CLI installed (optional but helpful)

---

## STEP 1: Create PostgreSQL Server in Azure Portal

### 1.1 Navigate to Azure Portal
1. Go to https://portal.azure.com
2. Sign in with your student account

### 1.2 Create the Database Server
1. Click **"+ Create a resource"** (top left)
2. Search for **"Azure Database for PostgreSQL"**
3. Click **Create**
4. Select **"Flexible Server"** → Click **Create**

### 1.3 Configure Basic Settings

**Project Details:**
| Field | Value |
|-------|-------|
| Subscription | Azure for Students |
| Resource group | Click "Create new" → Name: `savebucks-rg` → OK |

**Server Details:**
| Field | Value |
|-------|-------|
| Server name | `savebucks-db-yourname` (must be globally unique, add random chars if needed) |
| Region | **East US** (or closest to you) |
| PostgreSQL version | **16** |
| Workload type | **Development** (cheapest option) |

### 1.4 Configure Compute + Storage
1. Click **"Configure server"**
2. Select:
   - **Compute tier:** Burstable
   - **Compute size:** Standard_B1ms (1 vCore, 2GB RAM) - ~$12/month
   - **Storage:** 32 GB (minimum, included)
3. Click **Save**

### 1.5 Set Administrator Account
| Field | Value |
|-------|-------|
| Admin username | `savebucks_admin` |
| Password | Create a strong password (16+ chars, mix of letters, numbers, symbols) |
| Confirm password | Same password |

⚠️ **SAVE THIS PASSWORD SECURELY** - you'll need it!

### 1.6 Configure Networking
1. Select **"Public access (allowed IP addresses)"**
2. Check ✅ **"Allow public access from any Azure service within Azure to this server"**
3. Click **"+ Add current client IP address"** (to allow your computer)
4. Leave other settings default

### 1.7 Review + Create
1. Click **"Review + create"**
2. Review the configuration
3. Click **"Create"**
4. Wait 5-10 minutes for deployment

---

## STEP 2: Create the Database

### 2.1 Go to Your Server
1. Once deployed, click **"Go to resource"**
2. In the left menu, click **"Databases"**
3. Click **"+ Add"**
4. Name: `savebucks`
5. Click **OK**

### 2.2 Get Connection Information
1. In left menu, click **"Overview"**
2. Note your **Server name** (e.g., `savebucks-db-yourname.postgres.database.azure.com`)
3. Note your **Admin username** (e.g., `savebucks_admin`)

---

## STEP 3: Connect and Run Migration

### Option A: Using Azure Cloud Shell (Easiest)

1. In Azure Portal, click the **Cloud Shell** icon (top right, looks like `>_`)
2. Select **Bash**
3. Run:

```bash
# Connect to PostgreSQL
psql "host=savebucks-db-yourname.postgres.database.azure.com port=5432 dbname=savebucks user=savebucks_admin sslmode=require"
```

4. Enter your password when prompted

### Option B: Using Local psql

1. Install PostgreSQL client tools
2. Run from your terminal:

```bash
psql "host=savebucks-db-yourname.postgres.database.azure.com port=5432 dbname=savebucks user=savebucks_admin sslmode=require"
```

### 3.1 Create Application User (Security Best Practice)

Once connected, run these SQL commands:

```sql
-- Create a separate user for the application (least privilege principle)
CREATE USER savebucks_app WITH PASSWORD 'YourSecureAppPassword123!';

-- Grant necessary permissions
GRANT CONNECT ON DATABASE savebucks TO savebucks_app;
GRANT USAGE ON SCHEMA public TO savebucks_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO savebucks_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO savebucks_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO savebucks_app;

-- Exit
\q
```

---

## STEP 4: Run Database Schema

### 4.1 Upload and Run Migration

From your local machine (in the Savebucks project folder):

```bash
# Windows PowerShell
$env:PGPASSWORD = "YourAdminPassword"
psql -h savebucks-db-yourname.postgres.database.azure.com -U savebucks_admin -d savebucks -f supabase/sql/features/070_restaurant_pivot.sql
```

Or manually:
1. Open the file `supabase/sql/features/070_restaurant_pivot.sql`
2. Copy the contents
3. Paste into the psql prompt or Azure Query Editor

---

## STEP 5: Update Your Application

### 5.1 Update apps/api/.env

```env
# Database Configuration
PORT=4000
DATABASE_URL=postgresql://savebucks_app:YourSecureAppPassword123!@savebucks-db-yourname.postgres.database.azure.com:5432/savebucks?sslmode=require

# Keep Supabase for Authentication only (optional - we can replace later)
SUPABASE_URL=https://ixkhkzjhelyumdplutbz.supabase.co
SUPABASE_ANON_KEY=your-existing-key
SUPABASE_SERVICE_ROLE=your-existing-key
```

### 5.2 Add .env to .gitignore

Make sure your `.gitignore` includes:
```
.env
.env.local
.env.*.local
```

---

## STEP 6: Security Hardening

### 6.1 Firewall Rules (Azure Portal → Your Server → Networking)

Only allow specific IPs:
1. Your development machine IP
2. Your production server IP (when you deploy)
3. Azure services (if using Azure for hosting)

### 6.2 Enable Connection Encryption
Azure enforces SSL by default - ✅ already enabled

### 6.3 Enable Audit Logging
1. Go to Server → Server parameters
2. Search `log_statement`
3. Set to `all` (for development) or `ddl` (for production)

### 6.4 Set Up Alerts
1. Go to Server → Alerts
2. Create alerts for:
   - High CPU usage (>80%)
   - High storage usage (>80%)
   - Connection failures

---

## Connection String Reference

```
postgresql://[USER]:[PASSWORD]@[SERVER].postgres.database.azure.com:5432/[DATABASE]?sslmode=require
```

**Your connection string will look like:**
```
postgresql://savebucks_app:YourSecureAppPassword123!@savebucks-db-yourname.postgres.database.azure.com:5432/savebucks?sslmode=require
```

---

## Cost Summary

| Resource | Monthly Cost |
|----------|-------------|
| Flexible Server B1ms | ~$12.41 |
| Storage 32GB | Included |
| Backup (7 days) | Included |
| **Total** | ~$12/month |

**$100 credits ÷ $12/month = ~8 months of free usage!**

---

## Troubleshooting

### "Connection refused"
- Check firewall rules include your IP
- Verify server is running (Portal → Overview → Status)

### "SSL required"
- Add `?sslmode=require` to connection string

### "Authentication failed"
- Double-check username format: `username` (not `username@servername`)
- Verify password is correct

### "Database does not exist"
- Create the database first (Step 2)

---

## Next Steps After Setup

1. ✅ Create Azure PostgreSQL Server
2. ✅ Create database and app user
3. ✅ Run migration scripts
4. ✅ Update .env files
5. 🔄 Test connection locally
6. 🔄 Update API to use pg instead of Supabase client
