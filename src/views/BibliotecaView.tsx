import React from 'react';
import { BookOpen, FileCheck, CheckCircle2, ShieldCheck, Scale, Award } from 'lucide-react';
import { Organization } from '../types';

interface BibliotecaViewProps {
  organization: Organization;
  onNavigate: (path: string) => void;
}

export const BibliotecaView: React.FC<BibliotecaViewProps> = ({
  organization,
  onNavigate,
}) => {
  const models = [
    {
      id: 'mod-1',
      title: 'Contestação — Reajuste Coletivo PME (Até 29 Vidas)',
      template: 'CAW v2 Homologado (DOCX)',
      theses_count: 8,
      status: 'Homologado',
      last_review: '2026-09-20',
      description: 'Padrão processual consolidado com preliminares de legitimidade, impugnação ao valor da causa, prescrição trienal e aplicação da RN 565 da ANS.',
    },
    {
      id: 'mod-2',
      title: 'Recurso Inominado — Juizado Especial Cível',
      template: 'CAW JEC v1',
      theses_count: 5,
      status: 'Homologado',
      last_review: '2026-09-15',
      description: 'Estrutura recursal para Turmas Recursais contra decisões de tutela antecipada em reajustes econômicos.',
    },
    {
      id: 'mod-3',
      title: 'Contrarrazões de Apelação — Vara Cível',
      template: 'CAW Apelação v1',
      theses_count: 6,
      status: 'Em Homologação',
      last_review: '2026-09-12',
      description: 'Minuta de manutenção de sentença de improcedência com fulcro em perícia atuarial favorável.',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{organization.name}</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span>BIBLIOTECA JURÍDICA HOMOLOGADA</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Modelos & Teses Validadas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Acervo de peças e teses auditadas segundo o padrão de excelência da banca.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
          <Award className="w-4 h-4" />
          <span>Padrão CAW v2 Oficial</span>
        </div>
      </div>

      {/* Grid de Modelos Homologados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {models.map((m) => (
          <div
            key={m.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono-tech text-cyan-600 dark:text-cyan-400 font-semibold">
                  {m.template}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-medium">
                  {m.status}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {m.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {m.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                {m.theses_count} teses mapeadas
              </span>
              <button
                onClick={() => onNavigate(`/app/${organization.slug}/nova-peca`)}
                className="text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
              >
                Utilizar Modelo
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
