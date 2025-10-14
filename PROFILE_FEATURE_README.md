# User Profile Feature

This feature allows users to set their personal information including full name, gym name, and avatar image.

## Setup Instructions

### 1. Run Database Migration

Before using the profile feature, you need to add the new columns to your users table. Run the following SQL in your Supabase SQL Editor:

```sql
-- Add gym_name and avatar_url to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS gym_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
```

Alternatively, you can run the migration file:

```bash
# The SQL is available in: user-profile-migration.sql
```

### 2. Access the Profile Page

Once the migration is complete, users can access their profile settings by:

- **Desktop**: Click on the username in the top navigation bar, or click the Settings icon (⚙️)
- **Mobile**: Open the mobile menu and tap on "Mi Perfil"
- **Direct URL**: Navigate to `/profile`

## Features

### Profile Information

- **Full Name**: The user's complete name
- **Gym Name**: The name of the user's gym (optional) - appears on generated documents
- **Avatar URL**: URL to the user's profile image

### Avatar Display

- Shows a preview of the avatar image if a URL is provided
- Falls back to a user icon if no avatar is set
- Accepts any valid image URL

### Form Validation

- Full name is required
- Gym name is optional
- Avatar URL must be a valid URL (if provided)

## Technical Details

### Files Created/Modified

1. **Database Migration**

   - `user-profile-migration.sql` - Adds new columns to users table

2. **API Routes**

   - `src/app/api/user/profile/route.ts` - GET and PUT endpoints for profile management

3. **Pages**

   - `src/app/profile/page.tsx` - Profile settings page with form

4. **Navigation**

   - `src/features/Topbar/Topbar.tsx` - Added profile link and settings icon
   - `src/features/Topbar/MobileMenu/MobileMenu.tsx` - Added profile link to mobile menu

5. **Auth Configuration**
   - `src/lib/auth.ts` - Extended to include gym_name and avatar_url in session

### API Endpoints

#### GET /api/user/profile

Returns the current user's profile information.

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "gym_name": "Fitness Pro Gym",
    "avatar_url": "https://example.com/avatar.jpg"
  }
}
```

#### PUT /api/user/profile

Updates the current user's profile information.

**Request Body:**

```json
{
  "name": "John Doe",
  "gym_name": "Fitness Pro Gym",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

**Response:**

```json
{
  "message": "Profile updated successfully",
  "user": {
    /* updated user data */
  }
}
```

## Future Enhancements

Potential improvements for this feature:

- File upload for avatar images (store in Supabase Storage)
- Image cropping/resizing functionality
- Additional profile fields (phone, address, bio, etc.)
- Profile visibility settings
- Change password functionality

## Security

- All profile operations require authentication
- Users can only view and update their own profile
- Row-level security policies ensure data isolation
