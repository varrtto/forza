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

    const { name, age, gender, height, weight, email, phone } =
      await request.json();

    // Validate required fields
    if (!name || !age || !gender || !height || !weight) {
      return NextResponse.json(
        { error: "Name, age, gender, height, and weight are required" },
        { status: 400 }
      );
    }

    // Check if student email already exists for this user (only if email is provided)
    if (email && email.trim() !== "") {
      const { data: existingStudent } = await supabaseAdmin
        .from("students")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("email", email)
        .single();

      if (existingStudent) {
        return NextResponse.json(
          { error: "Student with this email already exists" },
          { status: 400 }
        );
      }
    }

    // Create student
    const { data: student, error } = await supabaseAdmin
      .from("students")
      .insert({
        user_id: session.user.id,
        name,
        age: Number(age),
        gender,
        height: Number(height),
        weight: Number(weight),
        email,
        phone,
      })
      .select()
      .single();

    if (error) {
      console.error("Student creation error:", error);
      return NextResponse.json(
        { error: "Failed to create student" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Student created successfully", student },
      { status: 201 }
    );
  } catch (error) {
    console.error("Student creation error:", error);
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

    // Get all students for the current user
    const { data: students, error } = await supabaseAdmin
      .from("students")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Students fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch students" },
        { status: 500 }
      );
    }

    return NextResponse.json({ students }, { status: 200 });
  } catch (error) {
    console.error("Students fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
