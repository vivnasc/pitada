"use client";

import { useState, useMemo, FormEvent } from "react";
import Header from "@/components/layout/Header";
import PageWrapper from "@/components/layout/PageWrapper";
import FAB from "@/components/layout/FAB";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import SearchBar from "@/components/ui/SearchBar";
import { Note, NoteType } from "@/lib/types";

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------
const SAMPLE_RECIPE_NAMES: Record<string, string> = {
  "r1": "Frango ao Curry",
  "r2": "Sopa de Legumes",
  "r3": "Massa com Atum",
};

const SAMPLE_NOTES: Note[] = [
  {
    id: "n1",
    household_id: "h1",
    author_id: "a1",
    content: "Lembrar de comprar mais azeite extra virgem e verificar se ainda há stock de arroz basmati para a semana.",
    type: "general",
    linked_date: null,
    linked_recipe_id: null,
    linked_member_id: null,
    created_at: "2026-03-31T09:15:00Z",
  },
  {
    id: "n2",
    household_id: "h1",
    author_id: "a1",
    content: "Segunda-feira correu bem — jantámos todos juntos. O Cris comeu tudo sem reclamar!",
    type: "day_note",
    linked_date: "2026-03-31",
    linked_recipe_id: null,
    linked_member_id: null,
    created_at: "2026-03-31T20:45:00Z",
  },
  {
    id: "n3",
    household_id: "h1",
    author_id: "a1",
    content: "Ficou muito bom mas da próxima vez reduzir o picante a meio. A Vivianne achou demasiado forte. Juntar leite de coco no final para suavizar.",
    type: "recipe_feedback",
    linked_date: null,
    linked_recipe_id: "r1",
    linked_member_id: null,
    created_at: "2026-03-30T19:00:00Z",
  },
  {
    id: "n4",
    household_id: "h1",
    author_id: "a1",
    content: "A Ticy prefere a sopa sem cenoura — substituir por abobrinha. Também evitar louro pois diz que fica amargo.",
    type: "preference",
    linked_date: null,
    linked_recipe_id: "r2",
    linked_member_id: "m2",
    created_at: "2026-03-29T12:00:00Z",
  },
  {
    id: "n5",
    household_id: "h1",
    author_id: "a1",
    content: "Domingo foi dia de preparar refeições para a semana. Fiz 3 doses de frango, 2 sopas e a massa ficou para congelar.",
    type: "day_note",
    linked_date: "2026-03-29",
    linked_recipe_id: null,
    linked_member_id: null,
    created_at: "2026-03-29T17:30:00Z",
  },
  {
    id: "n6",
    household_id: "h1",
    author_id: "a1",
    content: "A massa com atum agrada a todos — manter no menu rotativo. Adicionar milho para variar.",
    type: "recipe_feedback",
    linked_date: null,
    linked_recipe_id: "r3",
    linked_member_id: null,
    created_at: "2026-03-28T20:00:00Z",
  },
];

// ---------------------------------------------------------------------------
// Filter config
// ---------------------------------------------------------------------------
type FilterKey = "all" | NoteType;

interface FilterPill {
  key: FilterKey;
  label: string;
}

const FILTER_PILLS: FilterPill[] = [
  { key: "all", label: "Todas" },
  { key: "general", label: "Geral" },
  { key: "day_note", label: "Dia" },
  { key: "recipe_feedback", label: "Receitas" },
  { key: "preference", label: "Preferencias" },
];

// ---------------------------------------------------------------------------
// Badge config per NoteType
// ---------------------------------------------------------------------------
type BadgeColor = "gray" | "blue" | "orange" | "green" | "red";

const TYPE_CONFIG: Record<NoteType, { label: string; color: BadgeColor }> = {
  general: { label: "Geral", color: "gray" },
  day_note: { label: "Dia", color: "blue" },
  recipe_feedback: { label: "Receita", color: "orange" },
  preference: { label: "Preferencia", color: "green" },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" });
}

function truncate(text: string, maxLength = 120): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

let nextId = 100;

// ---------------------------------------------------------------------------
// Form state
// ---------------------------------------------------------------------------
interface NoteFormState {
  content: string;
  type: NoteType;
  linked_date: string;
  linked_recipe_id: string;
}

const emptyForm: NoteFormState = {
  content: "",
  type: "general",
  linked_date: "",
  linked_recipe_id: "",
};

// ---------------------------------------------------------------------------
// Note form (add / edit)
// ---------------------------------------------------------------------------
interface NoteFormProps {
  initial: NoteFormState;
  isEdit: boolean;
  onSubmit: (data: NoteFormState) => void;
  onDelete?: () => void;
  onCancel: () => void;
}

function NoteForm({ initial, isEdit, onSubmit, onDelete, onCancel }: NoteFormProps) {
  const [form, setForm] = useState<NoteFormState>(initial);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const set = <K extends keyof NoteFormState>(key: K, val: NoteFormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.content.trim()) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type selector */}
      <div className="w-full">
        <label className="block text-sm font-semibold text-charcoal mb-1">Tipo</label>
        <div className="flex gap-2 flex-wrap">
          {(Object.keys(TYPE_CONFIG) as NoteType[]).map((t) => {
            const cfg = TYPE_CONFIG[t];
            const isActive = form.type === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => set("type", t)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                  isActive
                    ? "bg-terracotta text-white border-terracotta"
                    : "bg-cream-dark text-charcoal border-transparent"
                }`}
              >
                {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content textarea */}
      <div className="w-full">
        <label className="block text-sm font-semibold text-charcoal mb-1" htmlFor="note-content">
          Nota
        </label>
        <textarea
          id="note-content"
          value={form.content}
          onChange={(e) => set("content", e.target.value)}
          placeholder="Escreve a tua nota aqui..."
          rows={5}
          required
          className="w-full px-3 py-2.5 rounded-lg border border-cream-dark bg-white text-charcoal placeholder:text-stone-light focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-colors font-body text-sm resize-none"
        />
      </div>

      {/* Date picker — relevant for day notes */}
      {(form.type === "day_note" || form.linked_date) && (
        <Input
          label="Data (opcional)"
          type="date"
          value={form.linked_date}
          onChange={(e) => set("linked_date", e.target.value)}
        />
      )}

      {/* Recipe link — relevant for recipe_feedback */}
      {(form.type === "recipe_feedback" || form.linked_recipe_id) && (
        <div className="w-full">
          <label className="block text-sm font-semibold text-charcoal mb-1" htmlFor="note-recipe">
            Receita (opcional)
          </label>
          <select
            id="note-recipe"
            value={form.linked_recipe_id}
            onChange={(e) => set("linked_recipe_id", e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-cream-dark bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-colors font-body text-sm"
          >
            <option value="">Nenhuma</option>
            {Object.entries(SAMPLE_RECIPE_NAMES).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 pt-2">
        {isEdit && onDelete && !confirmDelete && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setConfirmDelete(true)}
            className="text-rose hover:bg-rose/10"
          >
            Eliminar
          </Button>
        )}
        {isEdit && confirmDelete && (
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={onDelete}
          >
            Confirmar
          </Button>
        )}
        <div className="flex gap-3 flex-1 justify-end">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {isEdit ? "Guardar" : "Adicionar"}
          </Button>
        </div>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(SAMPLE_NOTES);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // ---------------------------------------------------------------------------
  // Derived list
  // ---------------------------------------------------------------------------
  const filtered = useMemo(() => {
    let result = notes;

    if (activeFilter !== "all") {
      result = result.filter((n) => n.type === activeFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((n) => n.content.toLowerCase().includes(q));
    }

    // Most recent first
    return [...result].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [notes, activeFilter, search]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  function openAdd() {
    setEditingNote(null);
    setModalOpen(true);
  }

  function openEdit(note: Note) {
    setEditingNote(note);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingNote(null);
  }

  function handleAdd(data: NoteFormState) {
    const newNote: Note = {
      id: String(nextId++),
      household_id: "h1",
      author_id: "a1",
      content: data.content.trim(),
      type: data.type,
      linked_date: data.linked_date || null,
      linked_recipe_id: data.linked_recipe_id || null,
      linked_member_id: null,
      created_at: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
    closeModal();
  }

  function handleEdit(data: NoteFormState) {
    if (!editingNote) return;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === editingNote.id
          ? {
              ...n,
              content: data.content.trim(),
              type: data.type,
              linked_date: data.linked_date || null,
              linked_recipe_id: data.linked_recipe_id || null,
            }
          : n
      )
    );
    closeModal();
  }

  function handleDelete() {
    if (!editingNote) return;
    setNotes((prev) => prev.filter((n) => n.id !== editingNote.id));
    closeModal();
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  const noteCount = notes.length;

  return (
    <PageWrapper>
      <Header
        title="Notas"
        rightAction={
          <Badge color="gray">{noteCount}</Badge>
        }
      />

      {/* Search + filters */}
      <div className="px-4 py-3 space-y-3 border-b border-cream-dark">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
          placeholder="Pesquisar notas..."
        />

        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
          {FILTER_PILLS.map((pill) => {
            const isActive = activeFilter === pill.key;
            const count =
              pill.key === "all"
                ? notes.length
                : notes.filter((n) => n.type === pill.key).length;

            return (
              <button
                key={pill.key}
                type="button"
                onClick={() =>
                  setActiveFilter(isActive && pill.key !== "all" ? "all" : pill.key)
                }
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0 ${
                  isActive
                    ? "bg-terracotta text-white"
                    : "bg-cream-dark text-charcoal"
                }`}
              >
                {pill.label}
                {count > 0 && (
                  <span className={`ml-1 ${isActive ? "opacity-80" : "opacity-50"}`}>
                    ({count})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes list */}
      <div className="px-4 py-4 space-y-3 animate-fade-in">
        {filtered.length === 0 ? (
          <EmptyState
            emoji="📝"
            title="Nenhuma nota encontrada"
            description={
              search || activeFilter !== "all"
                ? "Tenta alterar os filtros ou a pesquisa."
                : "Adiciona a tua primeira nota."
            }
            action={
              !search && activeFilter === "all" ? (
                <Button size="sm" onClick={openAdd}>
                  Nova nota
                </Button>
              ) : undefined
            }
          />
        ) : (
          filtered.map((note) => {
            const cfg = TYPE_CONFIG[note.type];
            const linkedRecipeName = note.linked_recipe_id
              ? SAMPLE_RECIPE_NAMES[note.linked_recipe_id]
              : null;

            return (
              <Card key={note.id} onClick={() => openEdit(note)}>
                <div className="space-y-2">
                  {/* Top row: badge + date */}
                  <div className="flex items-center justify-between gap-2">
                    <Badge color={cfg.color}>{cfg.label}</Badge>
                    <span className="text-xs text-stone flex-shrink-0">
                      {formatDate(note.created_at)}
                    </span>
                  </div>

                  {/* Content */}
                  <p className="text-sm text-charcoal leading-relaxed">
                    {truncate(note.content)}
                  </p>

                  {/* Footer meta */}
                  {(linkedRecipeName || note.linked_date) && (
                    <div className="flex items-center gap-3 pt-0.5">
                      {linkedRecipeName && (
                        <div className="flex items-center gap-1 text-xs text-stone">
                          <svg
                            className="w-3 h-3 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                          <span className="truncate">{linkedRecipeName}</span>
                        </div>
                      )}
                      {note.linked_date && (
                        <div className="flex items-center gap-1 text-xs text-stone">
                          <svg
                            className="w-3 h-3 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>
                            {new Date(note.linked_date).toLocaleDateString("pt-PT", {
                              day: "2-digit",
                              month: "short",
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* FAB */}
      <FAB onClick={openAdd} label="Nova nota" />

      {/* Add / edit modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingNote ? "Editar nota" : "Nova nota"}
      >
        <NoteForm
          key={editingNote?.id ?? "new"}
          initial={
            editingNote
              ? {
                  content: editingNote.content,
                  type: editingNote.type,
                  linked_date: editingNote.linked_date ?? "",
                  linked_recipe_id: editingNote.linked_recipe_id ?? "",
                }
              : emptyForm
          }
          isEdit={!!editingNote}
          onSubmit={editingNote ? handleEdit : handleAdd}
          onDelete={editingNote ? handleDelete : undefined}
          onCancel={closeModal}
        />
      </Modal>
    </PageWrapper>
  );
}
