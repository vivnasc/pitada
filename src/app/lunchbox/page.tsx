"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import { SAMPLE_RECIPES } from "@/lib/sample-recipes";
import { DAYS_OF_WEEK } from "@/lib/constants";

const SCHOOL_DAYS = DAYS_OF_WEEK.slice(0, 5);

type TrackKey = "lowcarb" | "school";

interface SlotId {
  day: string;
  track: TrackKey;
}

type PlannerState = Record<string, Record<TrackKey, string | null>>;

const TRACKS: { key: TrackKey; label: string; sublabel: string; badge: string; badgeColor: "green" | "blue" }[] = [
  {
    key: "lowcarb",
    label: "Lancheira Low Carb",
    sublabel: "Vivianne",
    badge: "Sem leite/trigo",
    badgeColor: "green",
  },
  {
    key: "school",
    label: "Lancheira Escolar",
    sublabel: "Ticy + Breno",
    badge: "Sem ovos",
    badgeColor: "blue",
  },
];

function buildInitialState(): PlannerState {
  const state: PlannerState = {};
  for (const day of SCHOOL_DAYS) {
    state[day] = { lowcarb: null, school: null };
  }
  return state;
}

export default function LunchboxPage() {
  const [planner, setPlanner] = useState<PlannerState>(buildInitialState);
  const [activeSlot, setActiveSlot] = useState<SlotId | null>(null);
  const [clearConfirm, setClearConfirm] = useState(false);

  const vivianneRecipes = SAMPLE_RECIPES.filter((r) => r.is_vivianne_safe);
  const ticyRecipes = SAMPLE_RECIPES.filter((r) => r.is_ticy_safe);

  function getRecipesForTrack(track: TrackKey) {
    return track === "lowcarb" ? vivianneRecipes : ticyRecipes;
  }

  function getRecipeName(id: string | null) {
    if (!id) return null;
    return SAMPLE_RECIPES.find((r) => r.id === id)?.name ?? null;
  }

  function handleSlotTap(day: string, track: TrackKey) {
    setActiveSlot({ day, track });
  }

  function handleSelectRecipe(recipeId: string) {
    if (!activeSlot) return;
    setPlanner((prev) => ({
      ...prev,
      [activeSlot.day]: {
        ...prev[activeSlot.day],
        [activeSlot.track]: recipeId,
      },
    }));
    setActiveSlot(null);
  }

  function handleClearSlot(day: string, track: TrackKey, e: React.MouseEvent) {
    e.stopPropagation();
    setPlanner((prev) => ({
      ...prev,
      [day]: { ...prev[day], [track]: null },
    }));
  }

  function handleClearAll() {
    setPlanner(buildInitialState());
    setClearConfirm(false);
  }

  const filledSlots = SCHOOL_DAYS.reduce((count, day) => {
    return count + (planner[day].lowcarb ? 1 : 0) + (planner[day].school ? 1 : 0);
  }, 0);
  const totalSlots = SCHOOL_DAYS.length * 2; // 5 days × 2 tracks = 10

  const activeTrackRecipes = activeSlot ? getRecipesForTrack(activeSlot.track) : [];
  const activeTrackInfo = activeSlot ? TRACKS.find((t) => t.key === activeSlot.track) : null;

  return (
    <>
      <Header
        title="Lancheiras"
        showBack
        rightAction={
          <Button variant="ghost" size="sm" onClick={() => setClearConfirm(true)}>
            Limpar
          </Button>
        }
      />

      <PageWrapper>
        <div className="px-4 pt-4 pb-6 space-y-6">

          {/* Legend */}
          <div className="flex flex-wrap gap-2">
            {TRACKS.map((track) => (
              <div key={track.key} className="flex items-center gap-1.5">
                <Badge color={track.badgeColor}>{track.badge}</Badge>
                <span className="text-xs text-muted">{track.sublabel}</span>
              </div>
            ))}
          </div>

          {/* Day cards */}
          {SCHOOL_DAYS.map((day) => (
            <div key={day} className="space-y-2">
              <h2 className="text-sm font-semibold text-charcoal uppercase tracking-wide">{day}</h2>
              <div className="space-y-2">
                {TRACKS.map((track) => {
                  const recipeId = planner[day][track.key];
                  const recipeName = getRecipeName(recipeId);
                  return (
                    <Card
                      key={track.key}
                      onClick={() => handleSlotTap(day, track.key)}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                            {track.label}
                          </span>
                          <Badge color={track.badgeColor}>{track.badge}</Badge>
                        </div>
                        {recipeName ? (
                          <p className="text-sm font-body text-charcoal truncate">{recipeName}</p>
                        ) : (
                          <p className="text-sm font-body text-muted-light italic">+ Adicionar</p>
                        )}
                      </div>
                      {recipeName && (
                        <button
                          onClick={(e) => handleClearSlot(day, track.key, e)}
                          className="shrink-0 p-1 text-muted hover:text-rose transition-colors"
                          aria-label="Remover receita"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Summary */}
          <Card className="mt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-charcoal">Slots preenchidos</p>
                <p className="text-xs text-muted mt-0.5">5 dias, 2 lancheiras por dia</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-semibold text-terracotta">{filledSlots}</span>
                <span className="text-sm text-muted font-body"> de {totalSlots}</span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-3 h-2 rounded-full bg-surface-tertiary overflow-hidden">
              <div
                className="h-full rounded-full bg-terracotta transition-all duration-300"
                style={{ width: `${(filledSlots / totalSlots) * 100}%` }}
              />
            </div>
          </Card>

        </div>
      </PageWrapper>

      {/* Recipe picker modal */}
      <Modal
        open={activeSlot !== null}
        onClose={() => setActiveSlot(null)}
        title={
          activeSlot
            ? `${activeSlot.day} — ${activeTrackInfo?.label}`
            : "Escolher receita"
        }
      >
        {activeTrackRecipes.length === 0 ? (
          <EmptyState
            emoji="📋"
            title="Sem receitas disponíveis"
            description="Nenhuma receita marcada como segura para esta lancheira."
          />
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-muted mb-3">
              {activeTrackInfo?.sublabel} &middot; {activeTrackRecipes.length} receitas disponíveis
            </p>
            {activeTrackRecipes.map((recipe) => {
              const isSelected =
                activeSlot ? planner[activeSlot.day][activeSlot.track] === recipe.id : false;
              return (
                <button
                  key={recipe.id}
                  onClick={() => handleSelectRecipe(recipe.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                    isSelected
                      ? "border-terracotta bg-terracotta/5 text-terracotta"
                      : "border-surface-tertiary bg-white text-charcoal hover:border-terracotta/40 hover:bg-surface-secondary"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-body font-medium truncate">{recipe.name}</p>
                      {recipe.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {recipe.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} color="gray">{tag}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <svg className="w-5 h-5 shrink-0 text-terracotta mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </Modal>

      {/* Clear all confirmation modal */}
      <Modal
        open={clearConfirm}
        onClose={() => setClearConfirm(false)}
        title="Limpar plano"
      >
        <p className="text-sm text-muted mb-6">
          Tens a certeza que queres remover todas as receitas do plano semanal?
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setClearConfirm(false)}>
            Cancelar
          </Button>
          <Button variant="danger" className="flex-1" onClick={handleClearAll}>
            Limpar tudo
          </Button>
        </div>
      </Modal>
    </>
  );
}
