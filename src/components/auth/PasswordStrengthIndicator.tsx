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
    <div className={`space-y-3 mt-4 w-[90%] overflow-hidden transition-all duration-300 
      ${password ? "opacity-100 max-h-96" : "opacity-0 max-h-0"}`}>
      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strength.color}`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-1.5 text-xs">
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
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <X className="h-4 w-4 text-gray-400" />
      )}
      <span className={met ? "text-green-600" : "text-muted-foreground"}>
        {text}
      </span>
    </div>
  );
}
