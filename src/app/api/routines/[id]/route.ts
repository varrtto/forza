import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
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
    const routineId = resolvedParams.id;

    // Get routine data with student information
    const { data: routine, error } = await supabaseAdmin
      .from("routines")
      .select(
        `
        *,
        students (
          id,
          name
        )
      `
      )
      .eq("id", routineId)
      .eq("user_id", session.user.id)
      .single();

    if (error || !routine) {
      return NextResponse.json(
        { error: "Routine not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({ routine }, { status: 200 });
  } catch (error) {
    console.error("Routine fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const routineId = resolvedParams.id;

    // Parse request body
    const body = await request.json();
    const { routineData } = body;

    if (!routineData) {
      return NextResponse.json(
        { error: "Routine data is required" },
        { status: 400 }
      );
    }

    // Verify that the routine belongs to the current user
    const { data: existingRoutine, error: routineError } = await supabaseAdmin
      .from("routines")
      .select("id, user_id, student_id")
      .eq("id", routineId)
      .eq("user_id", session.user.id)
      .single();

    if (routineError || !existingRoutine) {
      return NextResponse.json(
        { error: "Routine not found or access denied" },
        { status: 404 }
      );
    }

    // Update the routine
    const { data: updatedRoutine, error: updateError } = await supabaseAdmin
      .from("routines")
      .update({
        name: routineData.name,
        routine_data: routineData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", routineId)
      .select()
      .single();

    if (updateError) {
      console.error("Routine update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update routine" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { routine: updatedRoutine, message: "Routine updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Routine update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
    const routineId = resolvedParams.id;

    // Verify that the routine belongs to the current user
    const { data: routine, error: routineError } = await supabaseAdmin
      .from("routines")
      .select("id, user_id")
      .eq("id", routineId)
      .eq("user_id", session.user.id)
      .single();

    if (routineError || !routine) {
      return NextResponse.json(
        { error: "Routine not found or access denied" },
        { status: 404 }
      );
    }

    // Delete the routine
    const { error } = await supabaseAdmin
      .from("routines")
      .delete()
      .eq("id", routineId);

    if (error) {
      console.error("Routine deletion error:", error);
      return NextResponse.json(
        { error: "Failed to delete routine" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Routine deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Routine deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
