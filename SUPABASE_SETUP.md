# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `forza-gym`
   - Database Password: (generate a strong password)
   - Region: Choose closest to your users
6. Click "Create new project"

## 2. Get Your Project Credentials

Once your project is created:

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`)

## 3. Set Up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `supabase-schema.sql` from this project
3. Paste and run the SQL to create the necessary tables

## 4. Configure Environment Variables

Update your `.env.local` file with your actual Supabase credentials:

```bash
# Replace with your actual Supabase project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co

# Replace with your actual anon key
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Replace with your actual service role key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Keep these as they are
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-here

# Replace with your actual database URL
DATABASE_URL=postgresql://postgres:[your-password]@db.[your-project-ref].supabase.co:5432/postgres
```

## 5. Generate NextAuth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output and use it as your `NEXTAUTH_SECRET`.

## 6. Test the Setup

1. Restart your development server:

   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/auth/signup`
3. Create a test account
4. Try logging in at `http://localhost:3000/auth/signin`

## Troubleshooting

### Common Issues:

1. **"Invalid supabaseUrl" error**: Make sure your `NEXT_PUBLIC_SUPABASE_URL` is a valid HTTPS URL
2. **Database connection errors**: Verify your `DATABASE_URL` is correct
3. **Authentication errors**: Check that your service role key has the correct permissions

### Security Notes:

- Never commit your `.env.local` file to version control
- The `service_role` key has elevated permissions - keep it secure
- Use Row Level Security (RLS) policies for data protection
