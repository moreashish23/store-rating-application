type Color = "blue" | "green" | "red" | "yellow" | "gray" | "purple" | "indigo";

interface BadgeProps {
  label: string;
  color?: Color;
  dot?: boolean;
}

const colorMap: Record<Color, string> = {
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  red: "bg-red-50 text-red-700 ring-red-200",
  yellow: "bg-amber-50 text-amber-700 ring-amber-200",
  gray: "bg-slate-100 text-slate-600 ring-slate-200",
  purple: "bg-purple-50 text-purple-700 ring-purple-200",
  indigo: "bg-indigo-50 text-indigo-700 ring-indigo-200",
};

const dotColorMap: Record<Color, string> = {
  blue: "bg-blue-500",
  green: "bg-emerald-500",
  red: "bg-red-500",
  yellow: "bg-amber-500",
  gray: "bg-slate-400",
  purple: "bg-purple-500",
  indigo: "bg-indigo-500",
};

const roleColorMap: Record<string, Color> = {
  ADMIN: "red",
  USER: "blue",
  STORE_OWNER: "green",
};

const Badge = ({ label, color, dot = false }: BadgeProps) => {
  const resolved: Color = color || roleColorMap[label] || "gray";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${colorMap[resolved]}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColorMap[resolved]}`} />
      )}
      {label}
    </span>
  );
};

export default Badge;