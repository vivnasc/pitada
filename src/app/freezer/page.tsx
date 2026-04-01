"use client";
import { useState, useMemo, FormEvent } from "react";
import Header from "@/components/layout/Header";
import PageWrapper from "@/components/layout/PageWrapper";
import FAB from "@/components/layout/FAB";
import SearchBar from "@/components/ui/SearchBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import { StockItem } from "@/lib/types";
import { STOCK_CATEGORIES } from "@/lib/constants";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const todayStr = new Date().toISOString().split("T")[0];

function daysAgo(dateStr: string | null): number | null {
  if (!dateStr) return null;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
}

function frozenLabel(dateStr: string | null): string {
  const days = daysAgo(dateStr);
  if (days == null) return "Data desconhecida";
  if (days === 0) return "Congelado hoje";
  if (days === 1) return "Congelado há 1 dia";
  return `Congelado há ${days} dias`;
}

function daysAgoFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

let nextId = 200;

// ---------------------------------------------------------------------------
// Sample data — freezer items only
// ---------------------------------------------------------------------------
const SAMPLE_FREEZER_ITEMS: StockItem[] = [
  {
    id: "f1",
    household_id: "h1",
    name: "Frango desfiado",
    category: "Proteínas",
    location: "freezer",
    quantity: 4,
    unit: "porção",
    min_threshold: null,
    expiry_date: null,
    frozen_at: daysAgoFromNow(14),
    portions_total: 6,
    portions_remaining: 4,
    source: "Cozinha",
    updated_at: new Date().toISOString(),
  },
  {
    id: "f2",
    household_id: "h1",
    name: "Molho bolonhesa",
    category: "Congelados",
    location: "freezer",
    quantity: 3,
    unit: "porção",
    min_threshold: null,
    expiry_date: null,
    frozen_at: daysAgoFromNow(7),
    portions_total: 3,
    portions_remaining: 3,
    source: "Cozinha",
    updated_at: new Date().toISOString(),
  },
  {
    id: "f3",
    household_id: "h1",
    name: "Caldo de galinha",
    category: "Congelados",
    location: "freezer",
    quantity: 2,
    unit: "porção",
    min_threshold: null,
    expiry_date: null,
    frozen_at: daysAgoFromNow(21),
    portions_total: 4,
    portions_remaining: 2,
    source: "Cozinha",
    updated_at: new Date().toISOString(),
  },
  {
    id: "f4",
    household_id: "h1",
    name: "Camarao",
    category: "Proteínas",
    location: "freezer",
    quantity: 1,
    unit: "pacote",
    min_threshold: null,
    expiry_date: null,
    frozen_at: daysAgoFromNow(5),
    portions_total: null,
    portions_remaining: null,
    source: "Komatipoort",
    updated_at: new Date().toISOString(),
  },
  {
    id: "f5",
    household_id: "h1",
    name: "Feijao cozido",
    category: "Cereais/Grãos",
    location: "freezer",
    quantity: 2,
    unit: "porção",
    min_threshold: null,
    expiry_date: null,
    frozen_at: daysAgoFromNow(10),
    portions_total: 2,
    portions_remaining: 2,
    source: "Cozinha",
    updated_at: new Date().toISOString(),
  },
  {
    id: "f6",
    household_id: "h1",
    name: "Pao de forma",
    category: "Cereais/Grãos",
    location: "freezer",
    quantity: 1,
    unit: "pacote",
    min_threshold: null,
    expiry_date: null,
    frozen_at: daysAgoFromNow(3),
    portions_total: null,
    portions_remaining: null,
    source: "Supermercado",
    updated_at: new Date().toISOString(),
  },
  {
    id: "f7",
    household_id: "h1",
    name: "Espinafres",
    category: "Vegetais",
    location: "freezer",
    quantity: 1,
    unit: "porção",
    min_threshold: null,
    expiry_date: null,
    frozen_at: daysAgoFromNow(30),
    portions_total: 4,
    portions_remaining: 1,
    source: "Mercado",
    updated_at: new Date().toISOString(),
  },
  {
    id: "f8",
    household_id: "h1",
    name: "Arroz cozido",
    category: "Cereais/Grãos",
    location: "freezer",
    quantity: 0,
    unit: "porção",
    min_threshold: null,
    expiry_date: null,
    frozen_at: daysAgoFromNow(8),
    portions_total: 3,
    portions_remaining: 0,
    source: "Cozinha",
    updated_at: new Date().toISOString(),
  },
];

// ---------------------------------------------------------------------------
// Portions progress bar
// ---------------------------------------------------------------------------
function PortionsBar({
  remaining,
  total,
}: {
  remaining: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((remaining / total) * 100) : 0;
  const barColor =
    remaining === 0
      ? "bg-rose/40"
      : remaining === 1
      ? "bg-amber-400"
      : "bg-olive";

  return (
    <div className="mt-2.5">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-muted">
          {remaining}/{total} porções
        </span>
        <span className="text-xs text-muted">{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-surface-tertiary overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Frozen item card
// ---------------------------------------------------------------------------
function FreezerCard({
  item,
  onUsePortion,
}: {
  item: StockItem;
  onUsePortion: (id: string) => void;
}) {
  const hasPortions =
    item.portions_total != null && item.portions_remaining != null;
  const isEmpty = hasPortions && item.portions_remaining === 0;
  const isLow = hasPortions && item.portions_remaining === 1 && !isEmpty;

  return (
    <Card
      className={
        isEmpty
          ? "border-rose/40 opacity-75"
          : isLow
          ? "border-amber-300/60"
          : ""
      }
    >
      {/* Top row: name + badges */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold font-semibold text-charcoal text-[15px] leading-tight truncate">
            {item.name}
          </h3>
          <p className="text-xs text-muted mt-0.5">{item.category}</p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          {isEmpty && <Badge color="red">Esgotado</Badge>}
          {isLow && <Badge color="orange">Ultima porcao</Badge>}
          {!hasPortions && (
            <span className="text-xs font-semibold text-charcoal">
              {item.quantity} {item.unit}
            </span>
          )}
        </div>
      </div>

      {/* Frozen date */}
      <p className="text-xs text-muted mt-1.5">{frozenLabel(item.frozen_at)}</p>

      {/* Portions progress */}
      {hasPortions && (
        <PortionsBar
          remaining={item.portions_remaining!}
          total={item.portions_total!}
        />
      )}

      {/* Source + use portion button */}
      <div className="flex items-center justify-between mt-3 gap-2">
        {item.source ? (
          <span className="text-xs text-muted/70 truncate">{item.source}</span>
        ) : (
          <span />
        )}
        {hasPortions && !isEmpty && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onUsePortion(item.id)}
          >
            Usar porcao
          </Button>
        )}
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Add form
// ---------------------------------------------------------------------------
interface FreezerFormState {
  name: string;
  category: string;
  portions_total: string;
  frozen_at: string;
  source: string;
  is_packet: boolean;
}

const emptyForm: FreezerFormState = {
  name: "",
  category: "Congelados",
  portions_total: "",
  frozen_at: todayStr,
  source: "",
  is_packet: false,
};

function FreezerForm({
  onSubmit,
  onCancel,
  loading,
}: {
  onSubmit: (data: FreezerFormState) => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  const [form, setForm] = useState<FreezerFormState>(emptyForm);

  const set = <K extends keyof FreezerFormState>(
    key: K,
    val: FreezerFormState[K]
  ) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nome"
        value={form.name}
        onChange={(e) => set("name", e.target.value)}
        placeholder="Ex: Frango desfiado"
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-charcoal">
            Categoria
          </label>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="h-10 rounded-xl border border-surface-tertiary bg-white px-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-terracotta/40"
          >
            {STOCK_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Data de congelamento"
          type="date"
          value={form.frozen_at}
          onChange={(e) => set("frozen_at", e.target.value)}
        />
      </div>

      {/* Packet vs portions toggle */}
      <div className="flex items-center gap-3 py-1">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={!form.is_packet}
            onChange={(e) => set("is_packet", !e.target.checked)}
          />
          <div className="w-10 h-5 bg-surface-tertiary rounded-full peer peer-checked:bg-terracotta transition-colors" />
          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
        </label>
        <span className="text-sm text-charcoal">
          {form.is_packet ? "Pacote inteiro (sem porcoes)" : "Rastrear porcoes"}
        </span>
      </div>

      {!form.is_packet && (
        <Input
          label="Total de porcoes"
          type="number"
          min="1"
          step="1"
          value={form.portions_total}
          onChange={(e) => set("portions_total", e.target.value)}
          placeholder="Ex: 6"
        />
      )}

      <Input
        label="Origem"
        value={form.source}
        onChange={(e) => set("source", e.target.value)}
        placeholder="Ex: Cozinha, Komatipoort"
      />

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button type="submit" loading={loading} className="flex-1">
          Congelar
        </Button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function FreezerPage() {
  const [items, setItems] = useState<StockItem[]>(SAMPLE_FREEZER_ITEMS);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  // Only freezer items (enforced here even if sample data is already filtered)
  const freezerItems = useMemo(
    () => items.filter((i) => i.location === "freezer"),
    [items]
  );

  // Summary stats
  const totalPortions = useMemo(
    () =>
      freezerItems.reduce(
        (sum, i) => sum + (i.portions_remaining ?? 0),
        0
      ),
    [freezerItems]
  );

  // Search + category filter
  const filtered = useMemo(() => {
    let result = freezerItems;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((i) => i.name.toLowerCase().includes(q));
    }
    if (filterCategory) {
      result = result.filter((i) => i.category === filterCategory);
    }
    return result;
  }, [freezerItems, search, filterCategory]);

  // Grouped by category, sorted alphabetically
  const grouped = useMemo(() => {
    const map = new Map<string, StockItem[]>();
    filtered.forEach((item) => {
      const list = map.get(item.category) || [];
      list.push(item);
      map.set(item.category, list);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  // Distinct categories present in freezer
  const presentCategories = useMemo(
    () => Array.from(new Set(freezerItems.map((i) => i.category))).sort(),
    [freezerItems]
  );

  // Use portion handler
  const handleUsePortion = (id: string) => {
    // TODO: Supabase update
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && i.portions_remaining != null && i.portions_remaining > 0
          ? {
              ...i,
              portions_remaining: i.portions_remaining - 1,
              quantity: Math.max(0, i.quantity - 1),
              updated_at: new Date().toISOString(),
            }
          : i
      )
    );
  };

  // Add handler
  const handleAdd = (form: FreezerFormState) => {
    setSaving(true);
    const portions = form.is_packet
      ? null
      : form.portions_total
      ? parseInt(form.portions_total, 10)
      : null;

    const newItem: StockItem = {
      id: String(nextId++),
      household_id: "h1",
      name: form.name.trim(),
      category: form.category,
      location: "freezer",
      quantity: portions ?? 1,
      unit: portions != null ? "porção" : "pacote",
      min_threshold: null,
      expiry_date: null,
      frozen_at: form.frozen_at || todayStr,
      portions_total: portions,
      portions_remaining: portions,
      source: form.source.trim() || null,
      updated_at: new Date().toISOString(),
    };

    // TODO: Supabase insert
    setItems((prev) => [...prev, newItem]);
    setSaving(false);
    setShowAdd(false);
  };

  const lowCount = freezerItems.filter(
    (i) => i.portions_remaining != null && i.portions_remaining <= 1
  ).length;

  return (
    <PageWrapper>
      <Header
        title="Congelador"
        rightAction={
          <div className="flex items-center gap-2 text-sm">
            {lowCount > 0 && (
              <Badge color="orange">
                {lowCount} {lowCount === 1 ? "baixo" : "baixos"}
              </Badge>
            )}
            <span className="text-muted">{freezerItems.length} itens</span>
          </div>
        }
      />

      {/* Summary bar */}
      <div className="mx-4 mt-3 mb-1 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-charcoal/[0.04] border border-charcoal/[0.06] px-4 py-3 text-center">
          <p className="text-2xl font-semibold font-bold text-charcoal">
            {freezerItems.length}
          </p>
          <p className="text-xs text-muted mt-0.5">itens congelados</p>
        </div>
        <div className="rounded-2xl bg-charcoal/[0.04] border border-charcoal/[0.06] px-4 py-3 text-center">
          <p className="text-2xl font-semibold font-bold text-charcoal">
            {totalPortions}
          </p>
          <p className="text-xs text-muted mt-0.5">porcoes restantes</p>
        </div>
      </div>

      <div className="px-4 py-3 space-y-3">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
          placeholder="Pesquisar congelador..."
        />

        {/* Category filter pills */}
        {presentCategories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
            <button
              type="button"
              onClick={() => setFilterCategory("")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0 ${
                !filterCategory
                  ? "bg-terracotta text-white"
                  : "bg-surface-tertiary text-charcoal"
              }`}
            >
              Todos
            </button>
            {presentCategories.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() =>
                  setFilterCategory(filterCategory === cat ? "" : cat)
                }
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0 ${
                  filterCategory === cat
                    ? "bg-terracotta text-white"
                    : "bg-surface-tertiary text-charcoal"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Item list */}
      <div className="px-4 space-y-4 pb-24 animate-fade-in">
        {filtered.length === 0 ? (
          <EmptyState
            emoji="—"
            title="Congelador vazio"
            description={
              search || filterCategory
                ? "Nenhum item encontrado com esses filtros."
                : "Adiciona o primeiro item ao congelador."
            }
            action={
              !search && !filterCategory ? (
                <Button size="sm" onClick={() => setShowAdd(true)}>
                  Adicionar item
                </Button>
              ) : undefined
            }
          />
        ) : (
          grouped.map(([category, catItems]) => (
            <section key={category}>
              <h3 className="text-xs font-bold text-muted uppercase tracking-wide mb-2">
                {category}{" "}
                <span className="font-normal text-muted/60">
                  ({catItems.length})
                </span>
              </h3>
              <div className="space-y-2">
                {catItems.map((item) => (
                  <FreezerCard
                    key={item.id}
                    item={item}
                    onUsePortion={handleUsePortion}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      <FAB onClick={() => setShowAdd(true)} label="Adicionar ao congelador" />

      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Novo item no congelador"
      >
        <FreezerForm
          onSubmit={handleAdd}
          onCancel={() => setShowAdd(false)}
          loading={saving}
        />
      </Modal>
    </PageWrapper>
  );
}
