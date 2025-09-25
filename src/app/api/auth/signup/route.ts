import { supabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .insert({
        email,
        password: hashedPassword,
        name,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Signup error:", error);
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
