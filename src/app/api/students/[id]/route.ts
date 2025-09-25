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
    const studentId = resolvedParams.id;

    // Get student data with routines
    const { data: student, error } = await supabaseAdmin
      .from("students")
      .select(
        `
        *,
        routines (
          id,
          name,
          routine_data,
          created_at,
          updated_at
        )
      `
      )
      .eq("id", studentId)
      .eq("user_id", session.user.id)
      .single();

    if (error || !student) {
      return NextResponse.json(
        { error: "Student not found or access denied" },
        { status: 404 }
      );
    }

    // Sort routines by creation date (newest first)
    if (student.routines) {
      student.routines.sort(
        (a: { created_at: string }, b: { created_at: string }) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    return NextResponse.json({ student }, { status: 200 });
  } catch (error) {
    console.error("Student fetch error:", error);
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
    const studentId = resolvedParams.id;

    // Verify that the student belongs to the current user
    const { data: student, error: studentError } = await supabaseAdmin
      .from("students")
      .select("id")
      .eq("id", studentId)
      .eq("user_id", session.user.id)
      .single();

    if (studentError || !student) {
      return NextResponse.json(
        { error: "Student not found or access denied" },
        { status: 404 }
      );
    }

    // Delete the student (this will cascade delete routines due to foreign key)
    const { error } = await supabaseAdmin
      .from("students")
      .delete()
      .eq("id", studentId);

    if (error) {
      console.error("Student deletion error:", error);
      return NextResponse.json(
        { error: "Failed to delete student" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Student deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Student deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
