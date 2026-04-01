"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import FAB from "@/components/layout/FAB";
import { HouseholdMember, UserRole, DietaryProfile } from "@/lib/types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  cook: "Cozinheira",
  buyer: "Comprador",
  member: "Membro",
};

const ROLE_COLORS: Record<UserRole, "blue" | "orange" | "green" | "gray"> = {
  admin: "blue",
  cook: "orange",
  buyer: "green",
  member: "gray",
};

const ALLERGY_OPTIONS = [
  { key: "leite", label: "Leite" },
  { key: "trigo", label: "Trigo" },
  { key: "ovos", label: "Ovos" },
  { key: "amendoim", label: "Amendoim" },
  { key: "frutos secos", label: "Frutos Secos" },
  { key: "peixe", label: "Peixe" },
  { key: "marisco", label: "Marisco" },
  { key: "soja", label: "Soja" },
];

const ALLERGY_COLOR: Record<string, "red" | "orange"> = {
  leite: "red",
  trigo: "red",
  ovos: "orange",
};

const DIET_OPTIONS = [
  { value: "", label: "Normal" },
  { value: "low_carb", label: "Low Carb" },
  { value: "adapted", label: "Adaptado" },
];

const DIET_LABELS: Record<string, string> = {
  low_carb: "Low Carb",
  adapted: "Adaptado",
};

const ROLE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "admin", label: "Admin" },
  { value: "cook", label: "Cozinheira" },
  { value: "buyer", label: "Comprador" },
  { value: "member", label: "Membro" },
];

// ---------------------------------------------------------------------------
// Initial sample data
// ---------------------------------------------------------------------------

const INITIAL_MEMBERS: HouseholdMember[] = [
  {
    id: "1",
    household_id: "hh1",
    name: "Vivianne",
    role: "admin",
    dietary_profile: {
      allergies: ["leite", "trigo"],
      diet: "low_carb",
      preferences: null,
    },
    eats_with_family: true,
    lunch_at: null,
    is_child: false,
    age: null,
    auth_user_id: "auth1",
  },
  {
    id: "2",
    household_id: "hh1",
    name: "Ticy",
    role: "member",
    dietary_profile: {
      allergies: ["ovos"],
      diet: null,
      preferences: null,
    },
    eats_with_family: true,
    lunch_at: "escola",
    is_child: true,
    age: 10,
    auth_user_id: null,
  },
  {
    id: "3",
    household_id: "hh1",
    name: "Breno",
    role: "member",
    dietary_profile: {
      allergies: [],
      diet: null,
      preferences: null,
    },
    eats_with_family: true,
    lunch_at: "escola",
    is_child: true,
    age: 7,
    auth_user_id: null,
  },
  {
    id: "4",
    household_id: "hh1",
    name: "Cris",
    role: "member",
    dietary_profile: {
      allergies: [],
      diet: null,
      preferences: null,
    },
    eats_with_family: true,
    lunch_at: "creche",
    is_child: true,
    age: 3,
    auth_user_id: null,
  },
];

// ---------------------------------------------------------------------------
// Form state shape
// ---------------------------------------------------------------------------

interface MemberForm {
  name: string;
  role: UserRole;
  allergies: string[];
  diet: string;
  preferences: string;
  is_child: boolean;
  age: string;
  lunch_at: string;
  eats_with_family: boolean;
}

const EMPTY_FORM: MemberForm = {
  name: "",
  role: "member",
  allergies: [],
  diet: "",
  preferences: "",
  is_child: false,
  age: "",
  lunch_at: "",
  eats_with_family: true,
};

function memberToForm(m: HouseholdMember): MemberForm {
  return {
    name: m.name,
    role: m.role,
    allergies: [...m.dietary_profile.allergies],
    diet: m.dietary_profile.diet ?? "",
    preferences: m.dietary_profile.preferences ?? "",
    is_child: m.is_child,
    age: m.age !== null ? String(m.age) : "",
    lunch_at: m.lunch_at ?? "",
    eats_with_family: m.eats_with_family,
  };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function AllergyBadge({ allergy }: { allergy: string }) {
  const color = ALLERGY_COLOR[allergy] ?? "gray";
  return (
    <Badge color={color as "red" | "orange" | "gray"}>
      {allergy.charAt(0).toUpperCase() + allergy.slice(1)}
    </Badge>
  );
}

function MemberCard({
  member,
  onEdit,
}: {
  member: HouseholdMember;
  onEdit: (m: HouseholdMember) => void;
}) {
  const { name, role, dietary_profile, is_child, age, lunch_at } = member;

  return (
    <Card onClick={() => onEdit(member)}>
      <div className="flex items-start gap-3">
        {/* Avatar circle */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-stone-light/40 border border-cream-dark flex items-center justify-center">
          <span className="text-base font-display text-charcoal select-none">
            {name.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + role row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display text-charcoal text-base leading-tight truncate">
              {name}
            </span>
            <Badge color={ROLE_COLORS[role]}>{ROLE_LABELS[role]}</Badge>
            {is_child && age !== null && (
              <Badge color="gray">{age} anos</Badge>
            )}
            {is_child && age === null && (
              <Badge color="gray">Criança</Badge>
            )}
          </div>

          {/* Dietary info */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {dietary_profile.allergies.map((a) => (
              <AllergyBadge key={a} allergy={a} />
            ))}
            {dietary_profile.diet && (
              <Badge color="green">
                {DIET_LABELS[dietary_profile.diet] ?? dietary_profile.diet}
              </Badge>
            )}
          </div>

          {/* Lunch location */}
          {lunch_at && (
            <p className="mt-1.5 text-xs text-stone flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {lunch_at.charAt(0).toUpperCase() + lunch_at.slice(1)}
            </p>
          )}

          {/* Preferences */}
          {dietary_profile.preferences && (
            <p className="mt-1 text-xs text-stone italic truncate">
              {dietary_profile.preferences}
            </p>
          )}
        </div>

        {/* Chevron */}
        <svg
          className="w-4 h-4 text-stone-light flex-shrink-0 mt-0.5"
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
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function FamilyPage() {
  const [members, setMembers] = useState<HouseholdMember[]>(INITIAL_MEMBERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<HouseholdMember | null>(null);
  const [form, setForm] = useState<MemberForm>(EMPTY_FORM);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // ---- helpers ----

  function openAdd() {
    setEditingMember(null);
    setForm(EMPTY_FORM);
    setConfirmDelete(false);
    setModalOpen(true);
  }

  function openEdit(member: HouseholdMember) {
    setEditingMember(member);
    setForm(memberToForm(member));
    setConfirmDelete(false);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingMember(null);
    setConfirmDelete(false);
  }

  function toggleAllergy(key: string) {
    setForm((f) => ({
      ...f,
      allergies: f.allergies.includes(key)
        ? f.allergies.filter((a) => a !== key)
        : [...f.allergies, key],
    }));
  }

  function handleSave() {
    if (!form.name.trim()) return;

    const dietary: DietaryProfile = {
      allergies: form.allergies,
      diet: form.diet || null,
      preferences: form.preferences.trim() || null,
    };

    if (editingMember) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === editingMember.id
            ? {
                ...m,
                name: form.name.trim(),
                role: form.role,
                dietary_profile: dietary,
                is_child: form.is_child,
                age: form.is_child && form.age !== "" ? parseInt(form.age, 10) : null,
                lunch_at: form.lunch_at.trim() || null,
                eats_with_family: form.eats_with_family,
              }
            : m
        )
      );
    } else {
      const newMember: HouseholdMember = {
        id: String(Date.now()),
        household_id: "hh1",
        name: form.name.trim(),
        role: form.role,
        dietary_profile: dietary,
        eats_with_family: form.eats_with_family,
        lunch_at: form.lunch_at.trim() || null,
        is_child: form.is_child,
        age: form.is_child && form.age !== "" ? parseInt(form.age, 10) : null,
        auth_user_id: null,
      };
      setMembers((prev) => [...prev, newMember]);
    }

    closeModal();
  }

  function handleDelete() {
    if (!editingMember) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setMembers((prev) => prev.filter((m) => m.id !== editingMember.id));
    closeModal();
  }

  const isFormValid = form.name.trim().length > 0;

  // ---- render ----

  return (
    <>
      <Header title="Família" showBack />
      <PageWrapper>
        <div className="px-4 pt-4 pb-6 space-y-3">
          {/* Summary strip */}
          <div className="flex items-center gap-3 mb-1">
            <p className="text-sm text-stone font-body">
              {members.length}{" "}
              {members.length === 1 ? "membro" : "membros"} &middot;{" "}
              {members.filter((m) => m.is_child).length} crianças
            </p>
          </div>

          {members.length === 0 ? (
            <EmptyState
              emoji="👨‍👩‍👧‍👦"
              title="Nenhum membro ainda"
              description="Adiciona os membros do teu agregado familiar."
              action={
                <Button onClick={openAdd} variant="primary" size="md">
                  Adicionar membro
                </Button>
              }
            />
          ) : (
            members.map((m) => (
              <MemberCard key={m.id} member={m} onEdit={openEdit} />
            ))
          )}
        </div>
      </PageWrapper>

      <FAB onClick={openAdd} label="Adicionar membro" />

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingMember ? "Editar membro" : "Novo membro"}
      >
        <div className="space-y-4">
          {/* Name */}
          <Input
            label="Nome"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Nome do membro"
            autoFocus
          />

          {/* Role */}
          <Select
            label="Função"
            value={form.role}
            options={ROLE_OPTIONS}
            onChange={(e) =>
              setForm((f) => ({ ...f, role: e.target.value as UserRole }))
            }
          />

          {/* Allergies */}
          <div>
            <p className="block text-sm font-semibold text-charcoal mb-2">
              Alergias alimentares
            </p>
            <div className="flex flex-wrap gap-2">
              {ALLERGY_OPTIONS.map(({ key, label }) => {
                const active = form.allergies.includes(key);
                const activeColor =
                  key === "leite" || key === "trigo"
                    ? "bg-rose/10 border-rose/40 text-rose"
                    : key === "ovos"
                    ? "bg-amber-100 border-amber-300 text-amber-800"
                    : "bg-stone-light/30 border-stone-light text-charcoal";
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleAllergy(key)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all active:scale-95 ${
                      active
                        ? activeColor
                        : "bg-white border-cream-dark text-stone hover:border-stone-light"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Diet */}
          <Select
            label="Dieta"
            value={form.diet}
            options={DIET_OPTIONS}
            onChange={(e) => setForm((f) => ({ ...f, diet: e.target.value }))}
          />

          {/* Is child */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="checkbox"
              aria-checked={form.is_child}
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  is_child: !f.is_child,
                  age: !f.is_child ? f.age : "",
                  lunch_at: !f.is_child ? f.lunch_at : "",
                }))
              }
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                form.is_child
                  ? "bg-terracotta border-terracotta"
                  : "border-stone-light bg-white"
              }`}
            >
              {form.is_child && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
            <span className="text-sm text-charcoal font-body">É criança</span>
          </div>

          {/* Child fields */}
          {form.is_child && (
            <div className="grid grid-cols-2 gap-3 pl-1 border-l-2 border-cream-dark ml-2">
              <Input
                label="Idade"
                type="number"
                min={0}
                max={17}
                value={form.age}
                onChange={(e) =>
                  setForm((f) => ({ ...f, age: e.target.value }))
                }
                placeholder="ex: 7"
              />
              <Input
                label="Almoço em"
                value={form.lunch_at}
                onChange={(e) =>
                  setForm((f) => ({ ...f, lunch_at: e.target.value }))
                }
                placeholder="escola / creche"
              />
            </div>
          )}

          {/* Eats with family */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="checkbox"
              aria-checked={form.eats_with_family}
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  eats_with_family: !f.eats_with_family,
                }))
              }
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                form.eats_with_family
                  ? "bg-terracotta border-terracotta"
                  : "border-stone-light bg-white"
              }`}
            >
              {form.eats_with_family && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
            <span className="text-sm text-charcoal font-body">
              Come com a família
            </span>
          </div>

          {/* Preferences */}
          <Input
            label="Preferências / notas"
            value={form.preferences}
            onChange={(e) =>
              setForm((f) => ({ ...f, preferences: e.target.value }))
            }
            placeholder="ex: não gosta de cebola"
          />

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              disabled={!isFormValid}
              onClick={handleSave}
            >
              {editingMember ? "Guardar alterações" : "Adicionar membro"}
            </Button>

            {editingMember && (
              <Button
                variant={confirmDelete ? "danger" : "ghost"}
                size="md"
                className="w-full"
                onClick={handleDelete}
              >
                {confirmDelete ? "Confirmar remoção" : "Remover membro"}
              </Button>
            )}

            {confirmDelete && (
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-stone text-center py-1 hover:text-charcoal transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
