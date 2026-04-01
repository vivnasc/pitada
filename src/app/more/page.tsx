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
    title: "O que cozinhar?",
    description: "Sugestões inteligentes para hoje",
    href: "/suggestions",
    icon: <MenuIcon d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
  },
  {
    title: "Coleções",
    description: "Receitas por ocasião e tema",
    href: "/collections",
    icon: <MenuIcon d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />,
  },
  {
    title: "Meal Prep",
    description: "Preparar a semana de uma vez",
    href: "/meal-prep",
    icon: <MenuIcon d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
  },
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
    icon: <MenuIcon d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />,
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
