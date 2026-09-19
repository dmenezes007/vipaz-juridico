import React from 'react';
import { X, Building2, Check, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { authService, ORGANIZATIONS } from '../services/authService';
import { Organization } from '../types';

interface TenantSwitcherModalProps {
  currentOrg: Organization;
  onSelectOrg: (slug: string) => void;
  onClose: () => void;
}

export const TenantSwitcherModal: React.FC<TenantSwitcherModalProps> = ({
  currentOrg,
  onSelectOrg,
  onClose,
}) => {
  const availableMemberships = authService.getAvailableOrganizations();
  const allKnownTenants = Object.values(ORGANIZATIONS);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0D1526] border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B1120]">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-slate-100">
              Ambientes Organizacionais (Tenants)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-400">
            O VIPAZ Jurídico valida a associação organizacional em nível de banco de dados via Row Level Security (RLS). Apenas tenants aos quais seu usuário está vinculado podem ser acessados:
          </p>

          <div className="space-y-3">
            {availableMemberships.map(({ organization: tenant, role }) => {
              const isSelected = tenant.id === currentOrg.id;
              return (
                <div
                  key={tenant.id}
                  onClick={() => {
                    onSelectOrg(tenant.slug);
                    onClose();
                  }}
                  className={`cursor-pointer p-4 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/50 ring-1 ring-cyan-500/30'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-200">
                        {tenant.name}
                      </span>
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 font-medium">
                          <Check className="w-3 h-3" /> Atual
                        </span>
                      )}
                      <span className="text-[10px] uppercase font-mono-tech px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        {role}
                      </span>
                    </div>
                    {tenant.tagline && <p className="text-xs text-slate-400">{tenant.tagline}</p>}
                    <div className="flex items-center gap-2 pt-1 text-[11px] font-mono-tech text-slate-500">
                      <span>slug: /app/{tenant.slug}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-emerald-400/80">
                        <ShieldCheck className="w-3 h-3" /> RLS Autorizado
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
                </div>
              );
            })}

            {/* Other known tenants not assigned to this user */}
            {allKnownTenants
              .filter((t) => !availableMemberships.some((m) => m.organization.slug === t.slug))
              .map((tenant) => (
                <div
                  key={tenant.id}
                  className="p-3.5 rounded-xl border border-slate-800/60 bg-slate-900/20 opacity-60 flex items-center justify-between"
                  title="Acesso não autorizado para seu usuário neste tenant"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-400">{tenant.name}</span>
                      <span className="inline-flex items-center gap-1 text-[9px] text-slate-500 bg-slate-800/80 px-1.5 py-0.5 rounded">
                        <Lock className="w-2.5 h-2.5" /> Não vinculado
                      </span>
                    </div>
                    <span className="text-[10px] font-mono-tech text-slate-600">
                      /app/{tenant.slug}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-900/60 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
