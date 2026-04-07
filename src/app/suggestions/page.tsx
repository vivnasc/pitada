"use client";

import { useState, useMemo } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { SAMPLE_RECIPES } from "@/lib/sample-recipes";
import { getAllergenBadges } from "@/lib/allergens";
import { Recipe } from "@/lib/types";

type FilterTab = "rapido" | "com_o_que_tens" | "seguro";

function ClockIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M12 7v5l3 3" />
    </svg>
  );
}

function FridgeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="4" y1="10" x2="20" y2="10" />
      <line x1="9" y1="6" x2="9" y2="8" />
      <line x1="9" y1="13" x2="9" y2="16" />
    </svg>
  );
}

function ShieldIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
      <path strokeLinecap="round" d="M9 12l2 2 4-4" />
    </svg>
  );
}

function SparklesIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  );
}

function ChefHatIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.047 6.75 6.75 0 0112 2.25a6.75 6.75 0 015.362 2.964z" />
    </svg>
  );
}

function getDailyRecipe(recipes: Recipe[]): Recipe | null {
  const safeRecipes = recipes.filter((r) => r.is_vivianne_safe && r.is_ticy_safe);
  if (safeRecipes.length === 0) return null;
  // Use the day of year as seed for a stable "random" pick per day
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return safeRecipes[dayOfYear % safeRecipes.length];
}

function SafetyIndicators({ recipe }: { recipe: Recipe }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${
          recipe.is_vivianne_safe
            ? "bg-olive-subtle text-olive"
            : "bg-rose-subtle text-rose"
        }`}
      >
        {recipe.is_vivianne_safe ? "V" : "V"}
        <span className={`w-1.5 h-1.5 rounded-full ${recipe.is_vivianne_safe ? "bg-olive" : "bg-rose"}`} />
      </span>
      <span
        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${
          recipe.is_ticy_safe
            ? "bg-olive-subtle text-olive"
            : "bg-rose-subtle text-rose"
        }`}
      >
        {recipe.is_ticy_safe ? "T" : "T"}
        <span className={`w-1.5 h-1.5 rounded-full ${recipe.is_ticy_safe ? "bg-olive" : "bg-rose"}`} />
      </span>
    </div>
  );
}

function RecipeCard({ recipe, featured = false }: { recipe: Recipe; featured?: boolean }) {
  const [cooked, setCooked] = useState(false);
  const badges = getAllergenBadges(recipe.ingredients);

  return (
    <Card className={`${featured ? "border-terracotta/20" : ""} group`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-base text-charcoal leading-snug truncate">
            {recipe.name}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-muted font-medium">{recipe.category}</span>
            <span className="w-1 h-1 rounded-full bg-surface-tertiary" />
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              <ClockIcon className="w-3.5 h-3.5" />
              {recipe.prep_time_min} min
            </span>
            {recipe.difficulty && (
              <>
                <span className="w-1 h-1 rounded-full bg-surface-tertiary" />
                <span className="text-xs text-muted">{recipe.difficulty}</span>
              </>
            )}
          </div>
        </div>
        <SafetyIndicators recipe={recipe} />
      </div>

      {badges.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {badges.map((b, i) => (
            <Badge key={i} color={b.color}>
              {b.label}
            </Badge>
          ))}
        </div>
      )}

      {badges.length === 0 && (
        <div className="mt-3">
          <Badge color="green">Seguro para todos</Badge>
        </div>
      )}

      {recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {recipe.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium text-muted-light bg-surface-secondary px-1.5 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
          {recipe.tags.length > 4 && (
            <span className="text-[10px] text-muted-light">+{recipe.tags.length - 4}</span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-surface-tertiary">
        <span className="text-[11px] text-muted-light">
          {recipe.times_used > 0
            ? `Cozinhado ${recipe.times_used}x`
            : "Ainda por experimentar"}
        </span>
        <Button
          size="sm"
          variant={cooked ? "secondary" : "primary"}
          onClick={() => setCooked(!cooked)}
          className={cooked ? "" : "bg-terracotta hover:bg-terracotta-dark text-white"}
        >
          {cooked ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Feito!
            </>
          ) : (
            <>
              <ChefHatIcon className="w-3.5 h-3.5" />
              Cozinhar
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}

export default function SuggestionsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("seguro");

  const dailyRecipe = useMemo(() => getDailyRecipe(SAMPLE_RECIPES), []);

  const filteredRecipes = useMemo(() => {
    switch (activeFilter) {
      case "rapido":
        return SAMPLE_RECIPES.filter((r) => r.prep_time_min <= 30);
      case "com_o_que_tens":
        // Simulate "in stock" — show recipes with fewer ingredients (simpler recipes)
        return [...SAMPLE_RECIPES].sort((a, b) => a.ingredients.length - b.ingredients.length);
      case "seguro":
        return SAMPLE_RECIPES.filter((r) => r.is_vivianne_safe && r.is_ticy_safe);
      default:
        return SAMPLE_RECIPES;
    }
  }, [activeFilter]);

  const filters: { key: FilterTab; label: string; icon: React.ReactNode; count: number }[] = [
    {
      key: "rapido",
      label: "Rapido",
      icon: <ClockIcon className="w-4 h-4" />,
      count: SAMPLE_RECIPES.filter((r) => r.prep_time_min <= 30).length,
    },
    {
      key: "com_o_que_tens",
      label: "Com o que tens",
      icon: <FridgeIcon className="w-4 h-4" />,
      count: SAMPLE_RECIPES.length,
    },
    {
      key: "seguro",
      label: "Seguro para todos",
      icon: <ShieldIcon className="w-4 h-4" />,
      count: SAMPLE_RECIPES.filter((r) => r.is_vivianne_safe && r.is_ticy_safe).length,
    },
  ];

  return (
    <PageWrapper>
      <Header title="O que cozinhar?" showBack />

      <div className="px-5 pt-5 pb-6 space-y-6">
        {/* Daily Suggestion Hero */}
        {dailyRecipe && (
          <section>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-terracotta via-terracotta-dark to-charcoal p-5 shadow-lg">
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-[0.07]">
                <svg className="w-full h-full" viewBox="0 0 400 200" fill="none">
                  <circle cx="350" cy="30" r="80" fill="white" />
                  <circle cx="380" cy="150" r="40" fill="white" />
                  <circle cx="50" cy="170" r="60" fill="white" />
                </svg>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <SparklesIcon className="w-4 h-4 text-terracotta-light" />
                  <span className="text-xs font-semibold text-terracotta-light uppercase tracking-wider">
                    Sugestao do dia
                  </span>
                </div>
                <h2 className="font-display text-xl text-white leading-snug mb-1.5">
                  {dailyRecipe.name}
                </h2>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm text-white/70">{dailyRecipe.category}</span>
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                  <span className="inline-flex items-center gap-1 text-sm text-white/70">
                    <ClockIcon className="w-3.5 h-3.5" />
                    {dailyRecipe.prep_time_min} min
                  </span>
                  {dailyRecipe.difficulty && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-white/30" />
                      <span className="text-sm text-white/70">{dailyRecipe.difficulty}</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/15 backdrop-blur-sm text-white px-2.5 py-1 rounded-full">
                    <ShieldIcon className="w-3.5 h-3.5" />
                    Seguro para todos
                  </span>
                  {dailyRecipe.is_favorite && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-white/15 backdrop-blur-sm text-white px-2.5 py-1 rounded-full">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                      </svg>
                      Favorito
                    </span>
                  )}
                </div>

                <Button
                  size="md"
                  className="bg-white text-terracotta hover:bg-white/90 font-semibold shadow-md"
                >
                  <ChefHatIcon className="w-4 h-4" />
                  Cozinhar hoje
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Filter Tabs */}
        <section>
          <div className="flex gap-2">
            {filters.map((f) => {
              const isActive = activeFilter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all duration-200 ${
                    isActive
                      ? "bg-terracotta-subtle border-terracotta/20 text-terracotta-dark shadow-sm"
                      : "bg-surface border-surface-tertiary text-muted hover:bg-surface-secondary hover:text-charcoal-light"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                      isActive
                        ? "bg-terracotta/10 text-terracotta"
                        : "bg-surface-secondary text-muted"
                    }`}
                  >
                    {f.icon}
                  </span>
                  <span className="text-[11px] font-semibold leading-tight text-center">
                    {f.label}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-terracotta/15 text-terracotta"
                        : "bg-surface-secondary text-muted-light"
                    }`}
                  >
                    {f.count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Results Header */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg text-charcoal">
              {activeFilter === "rapido" && "Receitas rapidas"}
              {activeFilter === "com_o_que_tens" && "Mais simples primeiro"}
              {activeFilter === "seguro" && "Seguro para a familia"}
            </h2>
            <span className="text-xs text-muted font-medium">
              {filteredRecipes.length} receita{filteredRecipes.length !== 1 ? "s" : ""}
            </span>
          </div>

          {filteredRecipes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-surface-secondary flex items-center justify-center mb-4">
                <ChefHatIcon className="w-7 h-7 text-muted" />
              </div>
              <p className="text-sm font-medium text-charcoal-light mb-1">
                Nenhuma receita encontrada
              </p>
              <p className="text-xs text-muted">
                Tenta outro filtro ou adiciona novas receitas.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </section>
      </div>
    </PageWrapper>
  );
}
