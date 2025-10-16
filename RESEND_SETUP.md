# Resend Setup Guide for Password Reset

## Quick Setup (5 minutes)

### 1. Create Resend Account
1. Go to [https://resend.com/](https://resend.com/)
2. Sign up with your email or GitHub
3. Verify your email

### 2. Get API Key
1. Go to **API Keys** in the Resend dashboard
2. Click **Create API Key**
3. Give it a name (e.g., "Forza Production")
4. Select permissions: **Sending access**
5. Click **Add**
6. **Copy the API key** (you won't see it again!)

### 3. Add to Environment Variables

Add this to your `.env.local` file:

```bash
# Resend Configuration for Password Reset
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxx

# Optional: Use your own domain email (after domain verification)
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

**Note:** If you don't set `RESEND_FROM_EMAIL`, it will use `onboarding@resend.dev` (which works for testing)

### 4. Restart Dev Server

```bash
# Stop the server (Ctrl+C)
npm run dev
```

### 5. Test It!

1. Go to `/auth/forgot-password`
2. Enter your email
3. Check your inbox for the password reset email

---

## Domain Setup (Optional - For Production)

To send from your own domain (e.g., `noreply@forza.com`):

### 1. Add Domain in Resend
1. Go to **Domains** in Resend dashboard
2. Click **Add Domain**
3. Enter your domain (e.g., `forza.com`)

### 2. Verify DNS Records
1. Resend will give you DNS records to add
2. Add these records to your domain DNS settings:
   - SPF record
   - DKIM records (2 records)
   - DMARC record (optional but recommended)

### 3. Wait for Verification
- Usually takes 15 minutes to a few hours
- Resend will email you when verified

### 4. Update Environment Variable
```bash
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

---

## Free Tier Limits

Resend free tier includes:
- ✅ **100 emails per day**
- ✅ **3,000 emails per month**
- ✅ Full API access
- ✅ Unlimited domains

This is more than enough for most applications!

---

## Troubleshooting

### Emails not arriving?
1. Check spam folder
2. Verify API key is correct
3. Check Resend dashboard for error logs
4. Make sure dev server was restarted after adding env vars

### "API key not configured" error?
- Make sure you added `RESEND_API_KEY` to `.env.local`
- Restart your dev server
- Double-check there are no typos in the env variable name

### Domain verification not working?
- DNS changes can take up to 48 hours to propagate
- Use `onboarding@resend.dev` for testing while you wait
- Verify DNS records with `dig` or DNS checker tools

---

## Why Resend?

✅ Built for Next.js/React applications  
✅ Modern API (better than SendGrid/Mailgun)  
✅ Generous free tier  
✅ Excellent documentation  
✅ Works perfectly with API routes  
✅ Better deliverability than EmailJS  
✅ No browser-only restrictions  

---

## Production Checklist

Before going to production:

- [ ] Verify your domain in Resend
- [ ] Use custom domain email (`RESEND_FROM_EMAIL`)
- [ ] Monitor usage in Resend dashboard
- [ ] Set up email open/click tracking (optional)
- [ ] Add error logging/monitoring
- [ ] Test with multiple email providers (Gmail, Outlook, etc.)
