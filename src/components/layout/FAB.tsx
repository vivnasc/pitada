"use client";

interface FABProps {
  onClick: () => void;
  label?: string;
  icon?: React.ReactNode;
}

export default function FAB({ onClick, label = "Adicionar", icon }: FABProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="fixed bottom-[88px] right-5 z-30 w-14 h-14 bg-charcoal text-white rounded-2xl shadow-lg hover:shadow-xl hover:bg-charcoal-light active:scale-90 transition-all flex items-center justify-center"
    >
      {icon || (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      )}
    </button>
  );
}
