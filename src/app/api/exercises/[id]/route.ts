import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const exerciseId = resolvedParams.id;

    // First verify that the exercise belongs to the current user
    const { data: exercise, error: fetchError } = await supabaseAdmin
      .from("user_exercises")
      .select("id, user_id")
      .eq("id", exerciseId)
      .eq("user_id", session.user.id)
      .single();

    if (fetchError || !exercise) {
      return NextResponse.json(
        { error: "Exercise not found or access denied" },
        { status: 404 }
      );
    }

    // Delete the exercise
    const { error: deleteError } = await supabaseAdmin
      .from("user_exercises")
      .delete()
      .eq("id", exerciseId)
      .eq("user_id", session.user.id);

    if (deleteError) {
      console.error("Exercise deletion error:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete exercise" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Exercise deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Exercise deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

