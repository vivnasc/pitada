interface EmptyStateProps {
  emoji?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ emoji, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {emoji && <span className="text-4xl mb-3 opacity-40">{emoji}</span>}
      <h3 className="text-base font-semibold text-charcoal mb-1">{title}</h3>
      {description && <p className="text-sm text-muted mb-5 max-w-xs">{description}</p>}
      {action}
    </div>
  );
}
