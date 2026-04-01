interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-card border border-cream-dark/80 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${onClick ? "cursor-pointer hover:shadow-md active:scale-[0.98] transition-all" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
