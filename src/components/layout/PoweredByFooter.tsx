export default function PoweredByFooter({ className = "" }: { className?: string }) {
  return (
    <footer className={`text-center py-4 ${className}`}>
      <p className="text-xs text-muted">
        Powered by{" "}
        <a
          href="https://seteecos.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-terracotta hover:text-terracotta-dark transition-colors"
        >
          Sete Ecos
        </a>
      </p>
      <p className="text-[10px] text-muted-light mt-1">
        <a href="mailto:suporte@seteecos.com" className="hover:text-charcoal transition-colors">
          suporte@seteecos.com
        </a>
      </p>
    </footer>
  );
}
