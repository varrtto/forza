export interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: string;
  requirements: {
    minLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  const requirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  // Calculate score based on requirements met
  let score = 0;
  if (requirements.minLength) score++;
  if (requirements.hasUpperCase) score++;
  if (requirements.hasLowerCase) score++;
  if (requirements.hasNumber) score++;
  if (requirements.hasSpecialChar) score++;

  // Bonus points for longer passwords
  if (password.length >= 12) score = Math.min(score + 1, 5);
  
  // Normalize to 0-4 scale
  score = Math.min(Math.floor(score * 0.8), 4);

  let label = "";
  let color = "";

  if (score === 0) {
    label = "Muy débil";
    color = "bg-red-500";
  } else if (score === 1) {
    label = "Débil";
    color = "bg-orange-500";
  } else if (score === 2) {
    label = "Aceptable";
    color = "bg-yellow-500";
  } else if (score === 3) {
    label = "Fuerte";
    color = "bg-lime-500";
  } else {
    label = "Muy fuerte";
    color = "bg-green-500";
  }

  return {
    score,
    label,
    color,
    requirements,
  };
}

export function isPasswordValid(password: string): boolean {
  const strength = calculatePasswordStrength(password);
  return (
    strength.requirements.minLength &&
    strength.requirements.hasUpperCase &&
    strength.requirements.hasLowerCase &&
    strength.requirements.hasNumber
  );
}
