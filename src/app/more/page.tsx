"use client";
import Link from "next/link";
import Header from "@/components/layout/Header";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/ui/Card";
import PoweredByFooter from "@/components/layout/PoweredByFooter";

function ChevronRight() {
  return (
    <svg
      className="w-5 h-5 text-muted-light flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}

interface MenuItem {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

function MenuIcon({ d }: { d: string }) {
  return (
    <svg className="w-5 h-5 text-charcoal-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

const MENU_ITEMS: MenuItem[] = [
  {
    title: "Favoritas",
    description: "As receitas que a familia mais gosta",
    href: "/recipes",
    icon: <MenuIcon d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
  },
  {
    title: "Notas",
    description: "Notas da semana, feedback de receitas",
    href: "/notes",
    icon: <MenuIcon d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,
  },
  {
    title: "Familia",
    description: "Perfis alimentares e restricoes",
    href: "/family",
    icon: <MenuIcon d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
  },
  {
    title: "Congelador",
    description: "Controlo de porcoes congeladas",
    href: "/freezer",
    icon: <MenuIcon d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
  },
  {
    title: "Lancheiras",
    description: "Planeamento de lancheiras da semana",
    href: "/lunchbox",
    icon: <MenuIcon d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
  },
  {
    title: "Definicoes",
    description: "Preferencias e configuracoes",
    href: "/settings",
    icon: <MenuIcon d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
  },
];

export default function MorePage() {
  return (
    <PageWrapper>
      <Header title="Mais" />

      <div className="px-4 py-4 space-y-2 animate-fade-in">
        {MENU_ITEMS.map((item) => (
          <Link key={item.title} href={item.href} className="block">
            <Card className="hover:shadow-md active:scale-[0.98] transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface-tertiary flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-charcoal text-sm">
                    {item.title}
                  </span>
                  <p className="text-xs text-muted mt-0.5 truncate">
                    {item.description}
                  </p>
                </div>
                <ChevronRight />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <PoweredByFooter className="mt-4 mb-2" />
    </PageWrapper>
  );
}
