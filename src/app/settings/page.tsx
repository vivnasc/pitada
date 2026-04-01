"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import PoweredByFooter from "@/components/layout/PoweredByFooter";

type Theme = "Claro" | "Escuro" | "Sistema";

interface ToggleSwitchProps {
  on: boolean;
  onToggle: () => void;
  label: string;
  description?: string;
}

function ToggleSwitch({ on, onToggle, label, description }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-body font-medium text-charcoal">{label}</p>
        {description && (
          <p className="text-xs text-stone mt-0.5">{description}</p>
        )}
      </div>
      <button
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={onToggle}
        className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 ${
          on ? "bg-terracotta" : "bg-stone-light"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
            on ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

const THEMES: Theme[] = ["Claro", "Escuro", "Sistema"];

export default function SettingsPage() {
  // Notifications
  const [alertasValidade, setAlertasValidade] = useState(true);
  const [lembreteMenu, setLembreteMenu] = useState(true);
  const [stockBaixo, setStockBaixo] = useState(true);

  // Appearance
  const [theme, setTheme] = useState<Theme>("Sistema");

  return (
    <PageWrapper>
      <Header title="Definicoes" showBack />

      <div className="px-4 pt-5 pb-6 space-y-7">
        {/* Notificacoes */}
        <section>
          <p className="text-xs font-body font-semibold uppercase tracking-wide text-stone mb-2 px-1">
            Notificacoes
          </p>
          <Card className="divide-y divide-cream-dark">
            <ToggleSwitch
              on={alertasValidade}
              onToggle={() => setAlertasValidade((v) => !v)}
              label="Alertas de validade"
              description="Aviso quando um produto estiver proximo do prazo"
            />
            <ToggleSwitch
              on={lembreteMenu}
              onToggle={() => setLembreteMenu((v) => !v)}
              label="Lembrete de menu"
              description="Sugestoes diarias de refeicoes"
            />
            <ToggleSwitch
              on={stockBaixo}
              onToggle={() => setStockBaixo((v) => !v)}
              label="Stock baixo"
              description="Notificacao quando o stock estiver a acabar"
            />
          </Card>
        </section>

        {/* Aparencia */}
        <section>
          <p className="text-xs font-body font-semibold uppercase tracking-wide text-stone mb-2 px-1">
            Aparencia
          </p>
          <Card>
            <p className="text-sm font-body font-medium text-charcoal mb-3">Tema</p>
            <div className="flex gap-2">
              {THEMES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-body font-medium border transition-all duration-150 active:scale-95 ${
                    theme === t
                      ? "bg-terracotta text-white border-terracotta shadow-sm"
                      : "bg-cream text-stone border-cream-dark hover:border-stone-light hover:text-charcoal"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </Card>
        </section>

        {/* Dados */}
        <section>
          <p className="text-xs font-body font-semibold uppercase tracking-wide text-stone mb-2 px-1">
            Dados
          </p>
          <Card className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body font-medium text-charcoal">Exportar dados</p>
                <p className="text-xs text-stone mt-0.5">Transferir todos os seus dados em JSON</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => alert("Exportar dados — em breve!")}
              >
                Exportar
              </Button>
            </div>
            <div className="border-t border-cream-dark pt-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-body font-medium text-charcoal">Limpar cache</p>
                <p className="text-xs text-stone mt-0.5">Remove dados temporarios da aplicacao</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => alert("Cache limpo!")}
              >
                Limpar
              </Button>
            </div>
          </Card>
        </section>

        {/* Conta */}
        <section>
          <p className="text-xs font-body font-semibold uppercase tracking-wide text-stone mb-2 px-1">
            Conta
          </p>
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-stone font-body">Email</p>
                <p className="text-sm font-body font-medium text-charcoal mt-0.5">
                  vivianne@email.com
                </p>
              </div>
              <Badge color="green">Ativo</Badge>
            </div>
            <div className="border-t border-cream-dark pt-4">
              <Button
                variant="danger"
                size="md"
                className="w-full"
                onClick={() => alert("Sessao terminada.")}
              >
                Sair
              </Button>
            </div>
          </Card>
        </section>

        {/* Sobre */}
        <section>
          <p className="text-xs font-body font-semibold uppercase tracking-wide text-stone mb-2 px-1">
            Sobre
          </p>
          <Card className="divide-y divide-cream-dark">
            <div className="flex items-center justify-between py-3">
              <p className="text-sm font-body text-charcoal">Versao da aplicacao</p>
              <Badge color="gray">v1.0.0</Badge>
            </div>
            <div className="py-3">
              <a
                href="/termos"
                className="block text-sm font-body text-terracotta hover:text-terracotta-dark transition-colors"
              >
                Termos de uso
              </a>
            </div>
            <div className="py-3">
              <a
                href="/privacidade"
                className="block text-sm font-body text-terracotta hover:text-terracotta-dark transition-colors"
              >
                Politica de privacidade
              </a>
            </div>
          </Card>
        </section>
      </div>

      <PoweredByFooter className="pb-4" />
    </PageWrapper>
  );
}
