import { calculatePasswordStrength } from "@/utils/passwordStrength";
import { Check, X } from "lucide-react";
import { useMemo } from "react";

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps) {
  const strength = useMemo(
    () => calculatePasswordStrength(password),
    [password]
  );

  const progressPercentage = (strength.score / 4) * 100;

  return (
    <div
      className={`mt-4 w-full overflow-hidden transition-all duration-300 ${
        password ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="h-1 overflow-hidden bg-ink/15">
        <div
          className="h-full bg-tape transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="mt-3 space-y-1.5 text-sm">
        <RequirementItem
          met={strength.requirements.minLength}
          text="Mínimo 8 caracteres"
        />
        <RequirementItem
          met={strength.requirements.hasUpperCase}
          text="Una letra mayúscula"
        />
        <RequirementItem
          met={strength.requirements.hasLowerCase}
          text="Una letra minúscula"
        />
        <RequirementItem
          met={strength.requirements.hasNumber}
          text="Un número"
        />
        <RequirementItem
          met={strength.requirements.hasSpecialChar}
          text="Un carácter especial (!@#$%^&*...)"
        />
      </div>
    </div>
  );
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <Check className="h-4 w-4 text-tape" />
      ) : (
        <X className="h-4 w-4 text-ink/30" />
      )}
      <span className={met ? "text-ink" : "text-ink/50"}>{text}</span>
    </div>
  );
}
