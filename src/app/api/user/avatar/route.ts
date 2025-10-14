import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// POST - Upload avatar image
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only images are allowed (JPEG, PNG, GIF, WebP)",
        },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${session.user.id}/avatar-${Date.now()}.${fileExt}`;

    // Convert File to ArrayBuffer then to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from("avatars")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from("avatars")
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    // Update user's avatar_url in database
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({ avatar_url: publicUrl })
      .eq("id", session.user.id);

    if (updateError) {
      console.error("Database update error:", updateError);
      // Try to delete the uploaded file since DB update failed
      await supabaseAdmin.storage.from("avatars").remove([fileName]);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Avatar uploaded successfully",
      avatar_url: publicUrl,
    });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete avatar image
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current avatar URL
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("avatar_url")
      .eq("id", session.user.id)
      .single();

    if (!user?.avatar_url) {
      return NextResponse.json(
        { error: "No avatar to delete" },
        { status: 400 }
      );
    }

    // Extract file path from URL
    // URL format: https://{project}.supabase.co/storage/v1/object/public/avatars/{userId}/avatar-{timestamp}.{ext}
    const urlParts = user.avatar_url.split("/avatars/");
    if (urlParts.length > 1) {
      const filePath = urlParts[1];

      // Delete from storage
      const { error: deleteError } = await supabaseAdmin.storage
        .from("avatars")
        .remove([filePath]);

      if (deleteError) {
        console.error("Storage delete error:", deleteError);
      }
    }

    // Remove avatar_url from database
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({ avatar_url: null })
      .eq("id", session.user.id);

    if (updateError) {
      console.error("Database update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Avatar deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting avatar:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
