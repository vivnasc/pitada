type BadgeColor = "red" | "orange" | "green" | "blue" | "gray";

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  className?: string;
}

const colorClasses: Record<BadgeColor, string> = {
  red: "bg-rose-subtle text-rose border-rose/15",
  orange: "bg-amber-50 text-amber-700 border-amber-200/60",
  green: "bg-olive-subtle text-olive border-olive/15",
  blue: "bg-blue-50 text-blue-600 border-blue-200/60",
  gray: "bg-surface-secondary text-muted border-surface-tertiary",
};

export default function Badge({ children, color = "gray", className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${colorClasses[color]} ${className}`}>
      {children}
    </span>
  );
}
