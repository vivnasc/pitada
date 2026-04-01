"use client";

import { useState, useMemo } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import Header from "@/components/layout/Header";
import Badge from "@/components/ui/Badge";
import { SAMPLE_RECIPES } from "@/lib/sample-recipes";
import { Recipe } from "@/lib/types";
import { getAllergenBadges } from "@/lib/allergens";

interface CollectionDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  iconBg: string;
  filter: (recipe: Recipe, favorites: Set<string>) => boolean;
}

const COLLECTIONS: CollectionDef[] = [
  {
    id: "rapido",
    name: "Dia-a-dia rápido",
    description: "Receitas prontas em 30 minutos para semanas atarefadas",
    icon: "⚡",
    gradient: "from-amber-500 to-orange-400",
    iconBg: "bg-amber-100 text-amber-700",
    filter: (r) => r.prep_time_min <= 30,
  },
  {
    id: "favoritas",
    name: "Favoritas da família",
    description: "As receitas mais amadas e repetidas da casa",
    icon: "❤️",
    gradient: "from-rose-500 to-pink-400",
    iconBg: "bg-rose-100 text-rose-600",
    filter: (r, favorites) => r.is_favorite || favorites.has(r.id),
  },
  {
    id: "domingo",
    name: "Almoço de domingo",
    description: "Pratos reconfortantes para cozinhar sem pressa",
    icon: "🍲",
    gradient: "from-sky-500 to-blue-400",
    iconBg: "bg-sky-100 text-sky-700",
    filter: (r) => r.category === "Prato principal" && r.prep_time_min > 30,
  },
  {
    id: "festa",
    name: "Festa e ocasiões",
    description: "Para aniversários, feriados e jantares especiais",
    icon: "🎉",
    gradient: "from-violet-500 to-purple-400",
    iconBg: "bg-violet-100 text-violet-700",
    filter: (r) =>
      r.servings >= 6 ||
      r.category === "Sobremesa" ||
      r.tags.some((t) =>
        ["Festa", "Especial", "Ocasião"].some((k) =>
          t.toLowerCase().includes(k.toLowerCase())
        )
      ),
  },
  {
    id: "lancheiras",
    name: "Lancheiras escolares",
    description: "Seguras para a escola — sem ovos para a Ticy",
    icon: "🎒",
    gradient: "from-emerald-500 to-teal-400",
    iconBg: "bg-emerald-100 text-emerald-700",
    filter: (r) => r.category === "Lancheira" || (r.is_ticy_safe && r.prep_time_min <= 30 && r.category !== "Sopa"),
  },
  {
    id: "sem-alergenos",
    name: "Sem alérgenos",
    description: "Seguras para todos — sem leite, trigo nem ovos",
    icon: "🛡️",
    gradient: "from-olive to-emerald-600",
    iconBg: "bg-green-100 text-green-700",
    filter: (r) => r.is_vivianne_safe && r.is_ticy_safe,
  },
];

export default function CollectionsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    SAMPLE_RECIPES.forEach((r) => {
      if (r.is_favorite) initial.add(r.id);
    });
    return initial;
  });

  const collectionRecipes = useMemo(() => {
    const map: Record<string, Recipe[]> = {};
    COLLECTIONS.forEach((col) => {
      map[col.id] = SAMPLE_RECIPES.filter((r) => col.filter(r, favorites));
    });
    return map;
  }, [favorites]);

  const toggleFavorite = (recipeId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(recipeId)) {
        next.delete(recipeId);
      } else {
        next.add(recipeId);
      }
      return next;
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <PageWrapper>
      <Header title="Coleções" showBack />

      <div className="px-5 pt-6 pb-4">
        <h2 className="font-display text-2xl text-charcoal leading-tight">
          Coleções de receitas
        </h2>
        <p className="text-muted text-sm mt-1">
          Receitas organizadas por ocasião e necessidade
        </p>
      </div>

      <div className="px-5 space-y-4 pb-8">
        {COLLECTIONS.map((col) => {
          const recipes = collectionRecipes[col.id] || [];
          const isExpanded = expandedId === col.id;
          const preview = recipes.slice(0, 3);

          return (
            <div
              key={col.id}
              className="rounded-card border border-surface-tertiary shadow-card overflow-hidden bg-surface transition-all"
            >
              {/* Header */}
              <button
                onClick={() => toggleExpand(col.id)}
                className="w-full text-left focus:outline-none"
              >
                <div
                  className={`bg-gradient-to-r ${col.gradient} px-5 py-4 relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/5" />
                  <div className="relative flex items-start gap-3.5">
                    <span
                      className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm ${col.iconBg}`}
                    >
                      {col.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-lg text-white leading-snug">
                        {col.name}
                      </h3>
                      <p className="text-white/80 text-xs mt-0.5 leading-relaxed">
                        {col.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2">
                      <span className="bg-white/25 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                        {recipes.length}
                      </span>
                      <svg
                        className={`w-5 h-5 text-white/80 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Preview (collapsed) */}
                {!isExpanded && preview.length > 0 && (
                  <div className="px-5 py-3 border-t border-surface-tertiary">
                    <p className="text-xs text-muted truncate">
                      {preview.map((r) => r.name).join(" · ")}
                      {recipes.length > 3 && (
                        <span className="text-muted-light">
                          {" "}
                          +{recipes.length - 3} mais
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </button>

              {/* Expanded recipe list */}
              {isExpanded && (
                <div className="border-t border-surface-tertiary">
                  {recipes.length === 0 ? (
                    <div className="px-5 py-6 text-center">
                      <p className="text-muted text-sm">
                        Nenhuma receita nesta coleção ainda.
                      </p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-surface-tertiary">
                      {recipes.map((recipe) => {
                        const badges = getAllergenBadges(recipe.ingredients);
                        const isFav = favorites.has(recipe.id);

                        return (
                          <li
                            key={recipe.id}
                            className="px-5 py-3.5 flex items-start gap-3 hover:bg-surface-secondary/50 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-charcoal truncate">
                                  {recipe.name}
                                </p>
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-muted">
                                  {recipe.prep_time_min} min
                                </span>
                                <span className="text-xs text-muted-light">
                                  ·
                                </span>
                                <span className="text-xs text-muted">
                                  {recipe.servings} porções
                                </span>
                                <span className="text-xs text-muted-light">
                                  ·
                                </span>
                                <span className="text-xs text-muted">
                                  {recipe.category}
                                </span>
                              </div>
                              {badges.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {badges.map((b, i) => (
                                    <Badge key={i} color={b.color}>
                                      {b.label}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              {recipe.is_vivianne_safe &&
                                recipe.is_ticy_safe && (
                                  <div className="mt-2">
                                    <Badge color="green">
                                      Segura para todos
                                    </Badge>
                                  </div>
                                )}
                            </div>

                            {/* Favorite toggle */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(recipe.id);
                              }}
                              className="flex-shrink-0 p-1.5 rounded-lg hover:bg-surface-secondary active:scale-95 transition-all"
                              aria-label={
                                isFav
                                  ? "Remover dos favoritos"
                                  : "Adicionar aos favoritos"
                              }
                            >
                              <svg
                                className={`w-5 h-5 transition-colors ${
                                  isFav
                                    ? "text-terracotta fill-terracotta"
                                    : "text-muted-light fill-none"
                                }`}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                              </svg>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </PageWrapper>
  );
}
