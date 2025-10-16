import { sendPasswordResetEmail } from "@/lib/email";
import { supabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("id, email, name")
      .eq("email", email)
      .single();

    // Always return success to prevent email enumeration attacks
    if (userError || !user) {
      return NextResponse.json(
        { message: "Si el email existe, recibirás un enlace de recuperación" },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now

    // Save token to database
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        reset_token: resetToken,
        reset_token_expires: resetTokenExpires.toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating reset token:", updateError);
      return NextResponse.json(
        { error: "Error al procesar la solicitud" },
        { status: 500 }
      );
    }

    // Create reset link
    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;

    // Send email
    try {
      await sendPasswordResetEmail(user.email, resetLink, user.name);
    } catch (emailError) {
      console.error("Error sending reset email:", emailError);
      return NextResponse.json(
        { error: "Error al enviar el email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Si el email existe, recibirás un enlace de recuperación" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
