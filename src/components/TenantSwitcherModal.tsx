import React from 'react';
import { X, Building2, Check, ShieldCheck, ArrowRight } from 'lucide-react';
import { ORGANIZATIONS, authService } from '../services/authService';
import { Organization } from '../types';

interface TenantSwitcherModalProps {
  currentOrg: Organization;
  onSelectOrg: (slug: 'caw' | 'invicta') => void;
  onClose: () => void;
}

export const TenantSwitcherModal: React.FC<TenantSwitcherModalProps> = ({
  currentOrg,
  onSelectOrg,
  onClose,
}) => {
  const tenants = Object.values(ORGANIZATIONS);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0D1526] border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B1120]">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-slate-100">
              Alternar Organização (Tenant)
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
            O VIPAZ Jurídico opera em arquitetura multi-tenant com isolamento estrito de dados por <code className="text-cyan-300 font-mono-tech">organization_id</code>. Selecione o ambiente corporativo:
          </p>

          <div className="space-y-3">
            {tenants.map((tenant) => {
              const isSelected = tenant.id === currentOrg.id;
              return (
                <div
                  key={tenant.id}
                  onClick={() => {
                    onSelectOrg(tenant.slug as 'caw' | 'invicta');
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
                    </div>
                    <p className="text-xs text-slate-400">{tenant.tagline}</p>
                    <div className="flex items-center gap-2 pt-1 text-[11px] font-mono-tech text-slate-500">
                      <span>slug: /app/{tenant.slug}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-emerald-400/80">
                        <ShieldCheck className="w-3 h-3" /> RLS Ativo
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-900/60 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
