"use client";

import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { MENU_SLOTS } from "@/lib/constants";
import { SAMPLE_RECIPES as sampleRecipes } from "@/lib/sample-recipes";
import { getAllergenBadges } from "@/lib/allergens";

const MONTHS = [
  "Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const WEEKDAYS = [
  "Domingo", "Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado",
];

function formatDate(date: Date): string {
  const day = WEEKDAYS[date.getDay()];
  const num = date.getDate();
  const month = MONTHS[date.getMonth()];
  return `${day}, ${num} de ${month}`;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 19) return "Boa tarde";
  return "Boa noite";
}

function getExpiringItems() {
  const today = new Date();
  const items = [
    { name: "Iogurte natural", daysFromToday: 1 },
    { name: "Peito de frango", daysFromToday: 2 },
    { name: "Espinafre", daysFromToday: -1 },
  ];
  return items.map((item) => {
    const expiry = new Date(today);
    expiry.setDate(expiry.getDate() + item.daysFromToday);
    return { name: item.name, daysLeft: item.daysFromToday };
  });
}

const CATEGORY_COLORS: Record<string, string> = {
  "Prato principal": "bg-terracotta",
  "Acompanhamento": "bg-olive",
  "Sopa": "bg-amber-600",
  "Lancheira": "bg-blue-500",
};

export default function HomePage() {
  const today = new Date();
  const quickRecipes = sampleRecipes.slice(0, 5);
  const expiringItems = getExpiringItems();

  return (
    <PageWrapper>
      <div className="animate-fade-in">
        {/* Hero greeting */}
        <div className="px-5 pt-8 pb-6 bg-gradient-to-b from-surface-secondary to-surface">
          <p className="text-sm font-medium text-muted mb-1">{formatDate(today)}</p>
          <h1 className="text-[28px] font-display text-charcoal leading-tight tracking-tight">
            {getGreeting()}, Vivianne
          </h1>
        </div>

        {/* Quick Stats - big, tappable */}
        <div className="px-5 -mt-1 mb-6">
          <div className="grid grid-cols-3 gap-3">
            <Link href="/recipes">
              <div className="bg-terracotta-subtle border border-terracotta/10 rounded-xl p-4 text-center hover:shadow-card transition-all active:scale-[0.97]">
                <p className="text-3xl font-bold text-terracotta">{sampleRecipes.length}</p>
                <p className="text-xs font-medium text-terracotta/70 mt-1">receitas</p>
              </div>
            </Link>
            <Link href="/stock">
              <div className="bg-surface-secondary border border-surface-tertiary rounded-xl p-4 text-center hover:shadow-card transition-all active:scale-[0.97]">
                <p className="text-3xl font-bold text-charcoal">24</p>
                <p className="text-xs font-medium text-muted mt-1">em stock</p>
              </div>
            </Link>
            <Link href="/shopping">
              <div className="bg-surface-secondary border border-surface-tertiary rounded-xl p-4 text-center hover:shadow-card transition-all active:scale-[0.97]">
                <p className="text-3xl font-bold text-charcoal">5</p>
                <p className="text-xs font-medium text-muted mt-1">por comprar</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Expiring Soon - urgent, top visibility */}
        {expiringItems.length > 0 && (
          <div className="px-5 mb-6">
            <div className="bg-rose-subtle border border-rose/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-charcoal">A expirar</h2>
                <Link href="/stock" className="text-xs text-terracotta font-medium">Ver stock</Link>
              </div>
              <div className="space-y-2">
                {expiringItems.map((item, i) => {
                  const isExpired = item.daysLeft <= 0;
                  return (
                    <div key={i} className="flex items-center justify-between">
                      <span className={`text-sm ${isExpired ? "text-rose font-medium" : "text-charcoal"}`}>
                        {item.name}
                      </span>
                      <Badge color={isExpired ? "red" : "orange"}>
                        {isExpired ? "Expirado" : `${item.daysLeft}d`}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Today's Menu */}
        <section className="px-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-charcoal">Hoje</h2>
            <Link href="/menu" className="text-sm text-terracotta font-medium">
              Ver menu
            </Link>
          </div>
          <Card>
            <div className="divide-y divide-surface-tertiary">
              {MENU_SLOTS.map((slot) => (
                <Link
                  key={slot.value}
                  href="/menu"
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0 group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-charcoal group-hover:text-terracotta transition-colors">
                      {slot.label}
                    </p>
                    <p className="text-xs text-muted-light">{slot.sublabel}</p>
                  </div>
                  <span className="text-xs text-muted-light group-hover:text-terracotta transition-colors">
                    Planear
                  </span>
                </Link>
              ))}
            </div>
          </Card>
        </section>

        {/* Quick Recipes */}
        <section className="mb-6">
          <div className="flex items-center justify-between px-5 mb-3">
            <h2 className="text-base font-semibold text-charcoal">Receitas</h2>
            <Link href="/recipes" className="text-sm text-terracotta font-medium">
              Ver todas
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-2">
            {quickRecipes.map((recipe) => {
              const badges = getAllergenBadges(recipe.ingredients);
              const bgColor = CATEGORY_COLORS[recipe.category] || "bg-muted";
              return (
                <Link
                  key={recipe.id}
                  href={`/recipes/${recipe.id}`}
                  className="shrink-0 w-[160px]"
                >
                  <div className="bg-surface border border-surface-tertiary rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all active:scale-[0.97]">
                    <div className={`w-full h-24 ${bgColor} flex items-center justify-center`}>
                      <span className="text-3xl font-semibold text-white/70">
                        {recipe.name.charAt(0)}
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-charcoal line-clamp-2 leading-snug mb-1.5">
                        {recipe.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted">{recipe.prep_time_min} min</span>
                        {badges.length > 0 && (
                          <Badge color={badges[0].color}>
                            {badges[0].allergens.join("/")}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Quick Links */}
        <section className="px-5 mb-6">
          <div className="grid grid-cols-2 gap-3">
            <Link href="/freezer">
              <div className="border border-surface-tertiary rounded-xl p-4 hover:shadow-card transition-all active:scale-[0.97] bg-surface">
                <svg className="w-5 h-5 text-muted mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-sm font-medium text-charcoal">Congelador</p>
                <p className="text-xs text-muted mt-0.5">6 itens congelados</p>
              </div>
            </Link>
            <Link href="/lunchbox">
              <div className="border border-surface-tertiary rounded-xl p-4 hover:shadow-card transition-all active:scale-[0.97] bg-surface">
                <svg className="w-5 h-5 text-muted mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <p className="text-sm font-medium text-charcoal">Lancheiras</p>
                <p className="text-xs text-muted mt-0.5">Planear semana</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
