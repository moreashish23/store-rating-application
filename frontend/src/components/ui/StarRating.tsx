import { useState } from "react";
import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  value?: number | null;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

const sizeMap = { sm: "text-base", md: "text-xl", lg: "text-2xl" };

const StarRating = ({
  value,
  onChange,
  readonly = false,
  size = "md",
  showValue = true,
}: StarRatingProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? value ?? 0;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(null)}
          className={`
            ${sizeMap[size]} transition-all duration-100 focus:outline-none
            ${!readonly ? "cursor-pointer hover:scale-110 active:scale-95" : "cursor-default"}
          `}
          aria-label={`Rate ${star} stars`}
        >
          <FaStar
            className={star <= display ? "text-amber-400" : "text-slate-200"}
          />
        </button>
      ))}
      {showValue && value != null && (
        <span className="ml-1.5 text-sm font-semibold text-slate-600">
          {typeof value === "number" ? value.toFixed(1) : ""}
        </span>
      )}
    </div>
  );
};

export default StarRating;