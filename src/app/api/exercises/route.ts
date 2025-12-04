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

    const { muscleGroup, name } = await request.json();

    // Validate required fields
    if (!muscleGroup || !name) {
      return NextResponse.json(
        { error: "Muscle group and exercise name are required" },
        { status: 400 }
      );
    }

    // Check if exercise already exists for this user and muscle group
    const { data: existingExercise } = await supabaseAdmin
      .from("user_exercises")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("muscle_group", muscleGroup)
      .eq("name", name)
      .single();

    if (existingExercise) {
      return NextResponse.json(
        { error: "Exercise already exists for this muscle group" },
        { status: 400 }
      );
    }

    // Create exercise
    const { data: exercise, error } = await supabaseAdmin
      .from("user_exercises")
      .insert({
        user_id: session.user.id,
        muscle_group: muscleGroup,
        name: name,
      })
      .select()
      .single();

    if (error) {
      console.error("Exercise creation error:", error);
      return NextResponse.json(
        { error: "Failed to create exercise" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Exercise created successfully", exercise },
      { status: 201 }
    );
  } catch (error) {
    console.error("Exercise creation error:", error);
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

    // Get all exercises for the current user
    const { data: exercises, error } = await supabaseAdmin
      .from("user_exercises")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Exercises fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch exercises" },
        { status: 500 }
      );
    }

    return NextResponse.json({ exercises }, { status: 200 });
  } catch (error) {
    console.error("Exercises fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

