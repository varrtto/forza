import { supabaseAdmin } from "@/lib/supabase";
import { isPasswordValid } from "@/utils/passwordStrength";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (!isPasswordValid(password)) {
      return NextResponse.json(
        { error: "La contraseña no cumple con los requisitos mínimos" },
        { status: 400 }
      );
    }

    // Find user with valid token
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("id, email, reset_token_expires")
      .eq("reset_token", token)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Token inválido o expirado" },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (new Date(user.reset_token_expires) < new Date()) {
      return NextResponse.json(
        { error: "Token expirado. Solicita un nuevo enlace de recuperación" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        password: hashedPassword,
        reset_token: null,
        reset_token_expires: null,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating password:", updateError);
      return NextResponse.json(
        { error: "Error al actualizar la contraseña" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Contraseña actualizada exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
