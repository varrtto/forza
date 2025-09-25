import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { studentId, routineData } = await request.json();

    // Validate required fields
    if (!studentId || !routineData) {
      return NextResponse.json(
        { error: "Student ID and routine data are required" },
        { status: 400 }
      );
    }

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

    // Create routine
    const { data: routine, error } = await supabaseAdmin
      .from("routines")
      .insert({
        user_id: session.user.id,
        student_id: studentId,
        name: `Rutina de ${new Date().toLocaleDateString()}`,
        routine_data: routineData,
      })
      .select()
      .single();

    if (error) {
      console.error("Routine creation error:", error);
      return NextResponse.json(
        { error: "Failed to create routine" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Routine saved successfully", routine },
      { status: 201 }
    );
  } catch (error) {
    console.error("Routine creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all routines for the current user with student information
    const { data: routines, error } = await supabaseAdmin
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
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Routines fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch routines" },
        { status: 500 }
      );
    }

    return NextResponse.json({ routines }, { status: 200 });
  } catch (error) {
    console.error("Routines fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
