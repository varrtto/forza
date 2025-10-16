# EmailJS Setup Guide for Password Reset

## Steps to Configure EmailJS

### 1. Create an EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email

### 2. Add Email Service
1. Go to **Email Services** in the dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. **Copy the Service ID** (you'll need this later)

### 3. Create Email Template
1. Go to **Email Templates** in the dashboard
2. Click **Create New Template**
3. Use this template:

```
Subject: Recupera tu contraseña de Forza

Hola {{to_name}},

Recibimos una solicitud para restablecer tu contraseña en Forza.

Haz clic en el siguiente enlace para crear una nueva contraseña:

{{reset_link}}

Este enlace expirará en 1 hora.

Si no solicitaste este cambio, puedes ignorar este email.

Saludos,
El equipo de Forza
```

4. **Important Template Variables** (use these exact names):
   - `to_name` - User's name
   - `to_email` - User's email
   - `reset_link` - Password reset URL
   - `from_name` - "Forza"

5. **Copy the Template ID**

### 4. Get Public Key
1. Go to **Account** → **General**
2. Find your **Public Key**
3. Copy it

### 5. Update Environment Variables

Add these to your `.env.local` file:

```bash
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here

# Your app URL (for reset links)
NEXTAUTH_URL=http://localhost:3000  # Update for production
```

### 6. Run Database Migration

Run the password reset migration to add required fields:

```bash
# Connect to your Supabase database and run:
psql -h your-supabase-host -U postgres -d postgres -f password-reset-migration.sql
```

Or run it directly in the Supabase SQL editor.

### 7. Test the Flow

1. Go to `/auth/signin`
2. Click "¿Olvidaste tu contraseña?"
3. Enter your email
4. Check your email for the reset link
5. Click the link and reset your password

## Troubleshooting

### Emails not sending?
- Verify your EmailJS service is properly configured
- Check the EmailJS dashboard for error logs
- Make sure all environment variables are set correctly
- Restart your Next.js dev server after adding env vars

### Token expired errors?
- Reset tokens expire after 1 hour
- Request a new reset link if yours expired

### Invalid token?
- Tokens can only be used once
- Make sure you're clicking the most recent reset link

## EmailJS Free Tier Limits
- 200 emails/month free
- Consider upgrading if you need more for production

## Production Considerations
1. Update `NEXTAUTH_URL` to your production domain
2. Consider using a custom domain email with EmailJS
3. Monitor EmailJS usage in their dashboard
4. Add proper error logging and monitoring
