interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface rounded-card border border-surface-tertiary p-4 shadow-card ${onClick ? "cursor-pointer hover:shadow-card-hover active:scale-[0.98] transition-all" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
