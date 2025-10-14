# Avatar Image Upload Feature

This upgrade replaces the URL-based avatar system with actual file uploads to Supabase Storage. Users can now upload images directly instead of providing URLs.

## Setup Instructions

### 1. Create Supabase Storage Bucket

Run this SQL in your Supabase SQL Editor to create the storage bucket and set up security policies:

```sql
-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies to allow authenticated users to upload their own avatars
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

Or simply run the file:

```bash
# Available in: create-avatar-bucket.sql
```

### 2. Configure Supabase Storage (Optional)

In your Supabase Dashboard, go to **Storage** → **Policies** to verify the policies were created correctly.

You can also set up:

- **File size limits** in Storage settings
- **Allowed MIME types** (already enforced in the API)
- **Image transformations** for thumbnails

## Features

### File Upload

- **Supported formats**: JPEG, JPG, PNG, GIF, WebP
- **Max file size**: 5MB
- **Automatic validation**: Client and server-side validation
- **User isolation**: Each user can only access their own images

### Image Management

- **Upload**: Click "Subir Imagen" button to select and upload
- **Preview**: Live preview of uploaded avatar
- **Delete**: Remove avatar with trash icon button
- **Replace**: Upload new image to replace existing one

### Storage Structure

Images are stored in Supabase Storage with this structure:

```
avatars/
  └── {user_id}/
      └── avatar-{timestamp}.{ext}
```

This ensures:

- User isolation (each user has their own folder)
- Unique filenames (timestamp-based)
- Easy cleanup (delete user folder when user is deleted)

## Technical Implementation

### API Endpoints

#### POST /api/user/avatar

Uploads an avatar image for the authenticated user.

**Request**: multipart/form-data with `file` field

**Response**:

```json
{
  "message": "Avatar uploaded successfully",
  "avatar_url": "https://...supabase.co/storage/v1/object/public/avatars/..."
}
```

**Validation**:

- File type: image/jpeg, image/jpg, image/png, image/gif, image/webp
- File size: Maximum 5MB
- Authentication required

#### DELETE /api/user/avatar

Deletes the current user's avatar.

**Response**:

```json
{
  "message": "Avatar deleted successfully"
}
```

### Files Modified/Created

1. **API Routes**

   - `src/app/api/user/avatar/route.ts` - New endpoint for image upload/delete

2. **Profile Page**

   - `src/app/profile/page.tsx` - Updated with file upload UI

3. **Storage Setup**
   - `create-avatar-bucket.sql` - Bucket and policy creation

### Security Features

1. **Authentication**: Only authenticated users can upload/delete
2. **Authorization**: Users can only access their own avatars
3. **Validation**:
   - File type validation (client + server)
   - File size validation (5MB max)
4. **Storage Policies**: Row-level security in Supabase Storage
5. **Folder Isolation**: Each user's images stored in separate folder

## User Experience

### Upload Flow

1. User clicks "Subir Imagen" button
2. File picker opens (filtered to image types only)
3. User selects image
4. Image is validated (type, size)
5. Upload progress (button shows "Subiendo...")
6. Success message displayed
7. Avatar preview updates immediately
8. Session refreshes to show new avatar everywhere

### Delete Flow

1. User clicks trash icon (🗑️) next to avatar
2. Confirmation happens
3. Image deleted from storage
4. Database updated
5. Avatar preview resets to default icon
6. Session refreshes

## Benefits Over URL-Based System

✅ **Better Security**: Images stored in controlled environment
✅ **No External Dependencies**: No broken links from external hosts
✅ **Consistent Performance**: Supabase CDN for fast loading
✅ **Better UX**: Direct upload instead of finding URLs
✅ **Storage Management**: Can set quotas and limits
✅ **Image Processing**: Can add transformations/thumbnails later
✅ **Privacy**: User controls their own images

## Future Enhancements

Potential improvements:

- Image cropping before upload
- Multiple image sizes (thumbnail, full-size)
- Drag-and-drop upload
- Progress bar for large uploads
- Image compression
- Avatar gallery/templates

## Troubleshooting

### Images Not Uploading

- Check Supabase Storage bucket exists
- Verify storage policies are correctly set
- Check file size is under 5MB
- Ensure file type is supported

### Images Not Displaying

- Check the `avatar_url` in the users table
- Verify storage bucket is set to public
- Check the public URL is correctly formed

### Permission Errors

- Verify the user is authenticated
- Check storage policies allow the operation
- Ensure the file path follows the pattern: `{user_id}/avatar-*.{ext}`

## Migration from URL System

If you have existing users with avatar URLs:

1. Old URLs will continue to work
2. When they upload a new image, it replaces the URL
3. Old external images won't be automatically migrated
4. Users can re-upload their avatars manually
