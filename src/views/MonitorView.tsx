import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileOutput,
  Filter,
  Landmark,
  Link2,
  ListFilter,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';
import { Organization } from '../types';

interface MonitorViewProps {
  organization: Organization;
  onNavigate: (path: string) => void;
}

type MonitorStatus = 'Novo' | 'Em análise' | 'Revisado' | 'Preparado';
type MonitorSource = 'DJEN' | 'PJe' | 'CNPJ' | 'Interno';

interface MonitorEvent {
  id: string;
  date: string;
  time: string;
  source: MonitorSource;
  process: string;
  entity: string;
  event: string;
  classification: string;
  relevance: 'Alta' | 'Média' | 'Baixa';
  action: string;
  deadline?: string;
  recommendedPiece?: string;
  confidence: number;
  status: MonitorStatus;
  linkedMatter: boolean;
  cnpj?: string;
}

const DEMO_EVENTS: MonitorEvent[] = [
  {
    id: 'MON-24091',
    date: '26/09/2026',
    time: '04:42',
    source: 'DJEN',
    process: '1002172-68.2026.8.13.0188',
    entity: 'Luis Flavio Silva Camara',
    event: 'Publicação de decisão',
    classification: 'Decisão · tutela',
    relevance: 'Alta',
    action: 'Analisar decisão e registrar providência',
    deadline: '02/10/2026',
    recommendedPiece: 'Manifestação',
    confidence: 96,
    status: 'Novo',
    linkedMatter: true,
  },
  {
    id: 'MON-24087',
    date: '26/09/2026',
    time: '03:58',
    source: 'PJe',
    process: '4023313-68.2026.8.26.0564',
    entity: 'CASAL ALONSO CORRETORA DE SEGUROS LTDA',
    event: 'Intimação',
    classification: 'Intimação · prazo',
    relevance: 'Alta',
    action: 'Preparar resposta à intimação',
    deadline: '01/10/2026',
    recommendedPiece: 'Manifestação',
    confidence: 93,
    status: 'Em análise',
    linkedMatter: true,
    cnpj: '08.483.550/0001-00',
  },
  {
    id: 'MON-24072',
    date: '25/09/2026',
    time: '18:21',
    source: 'CNPJ',
    process: '—',
    entity: 'LMK Sistemas Ltda.',
    event: 'Alteração cadastral identificada',
    classification: 'Entidade · cadastro',
    relevance: 'Média',
    action: 'Conferir impacto nos casos vinculados',
    recommendedPiece: 'Nota interna',
    confidence: 88,
    status: 'Revisado',
    linkedMatter: true,
    cnpj: '10.284.731/0001-44',
  },
  {
    id: 'MON-24061',
    date: '25/09/2026',
    time: '16:09',
    source: 'DJEN',
    process: '3001903-61.2026.8.19.0209',
    entity: 'Lucio de Souza Almeida',
    event: 'Publicação de movimentação',
    classification: 'Movimentação processual',
    relevance: 'Média',
    action: 'Verificar existência de nova decisão',
    recommendedPiece: '—',
    confidence: 82,
    status: 'Novo',
    linkedMatter: true,
  },
  {
    id: 'MON-24043',
    date: '25/09/2026',
    time: '11:34',
    source: 'Interno',
    process: '—',
    entity: 'Carteira empresarial',
    event: 'Regra de monitoramento acionada',
    classification: 'Regra · revisão',
    relevance: 'Baixa',
    action: 'Revisar correspondência e encerrar alerta',
    recommendedPiece: '—',
    confidence: 91,
    status: 'Preparado',
    linkedMatter: false,
  },
];

const SOURCE_OPTIONS = ['Todas', 'DJEN', 'PJe', 'CNPJ', 'Interno'] as const;
const STATUS_OPTIONS = ['Todos', 'Novo', 'Em análise', 'Revisado', 'Preparado'] as const;
const RELEVANCE_OPTIONS = ['Todas', 'Alta', 'Média', 'Baixa'] as const;

const relevanceClass: Record<MonitorEvent['relevance'], string> = {
  Alta: 'border-rose-500/20 bg-rose-500/[.06] text-rose-300',
  Média: 'border-amber-500/20 bg-amber-500/[.06] text-amber-300',
  Baixa: 'border-white/10 bg-white/[.03] text-white/45',
};

const statusClass: Record<MonitorStatus, string> = {
  Novo: 'border-cyan-300/20 bg-cyan-300/[.06] text-cyan-300',
  'Em análise': 'border-amber-500/20 bg-amber-500/[.06] text-amber-300',
  Revisado: 'border-emerald-500/20 bg-emerald-500/[.06] text-emerald-300',
  Preparado: 'border-violet-500/20 bg-violet-500/[.06] text-violet-300',
};

export const MonitorView: React.FC<MonitorViewProps> = ({ organization, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState<(typeof SOURCE_OPTIONS)[number]>('Todas');
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>('Todos');
  const [relevance, setRelevance] = useState<(typeof RELEVANCE_OPTIONS)[number]>('Todas');
  const [showFilters, setShowFilters] = useState(true);
  const [selectedId, setSelectedId] = useState(DEMO_EVENTS[0].id);
  const [cnpjQuery, setCnpjQuery] = useState('');

  const filteredEvents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return DEMO_EVENTS.filter((item) => {
      const matchesQuery =
        !normalized ||
        [item.process, item.entity, item.event, item.classification, item.action, item.recommendedPiece]
          .join(' ')
          .toLowerCase()
          .includes(normalized);
      const matchesSource = source === 'Todas' || item.source === source;
      const matchesStatus = status === 'Todos' || item.status === status;
      const matchesRelevance = relevance === 'Todas' || item.relevance === relevance;
      return matchesQuery && matchesSource && matchesStatus && matchesRelevance;
    });
  }, [query, source, status, relevance]);

  const selected = DEMO_EVENTS.find((item) => item.id === selectedId) ?? filteredEvents[0] ?? DEMO_EVENTS[0];

  const clearFilters = () => {
    setQuery('');
    setSource('Todas');
    setStatus('Todos');
    setRelevance('Todas');
  };

  const activeFilterCount = [source !== 'Todas', status !== 'Todos', relevance !== 'Todas', Boolean(query)].filter(Boolean).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      <section className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div>
          <div className="vipaz-eyebrow mb-3"><Activity className="w-3.5 h-3.5" /> Monitoramento jurídico</div>
          <h1 className="vipaz-page-title">Encontre o que exige atenção antes que vire atraso.</h1>
          <p className="vipaz-page-description">
            Centralize sinais processuais, cadastrais e institucionais, relacione cada evento ao caso correspondente e transforme informação monitorada em providência jurídica orientada.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="vipaz-badge"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Última sincronização · 04:42</span>
          <button className="vipaz-button-secondary"><RefreshCw className="w-3.5 h-3.5" /> Atualizar</button>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 border-y vipaz-border-subtle">
        {[
          ['24', 'Sinais recebidos', 'últimas 24h', Activity],
          ['07', 'Exigem ação', 'prioridade alta', AlertCircle],
          ['03', 'Prazos próximos', 'até 5 dias', CalendarClock],
          ['12', 'Casos relacionados', 'Matter Matching', Link2],
        ].map(([value, label, detail, Icon]) => {
          const I = Icon as React.ElementType;
          return (
            <div key={label as string} className="py-5 pr-6 first:pl-0 pl-6 border-l first:border-l-0 vipaz-border-subtle">
              <div className="flex items-center gap-2 text-[10px] vipaz-text-muted"><I className="w-3.5 h-3.5" />{label as string}</div>
              <div className="mt-2 text-2xl tracking-[-.04em] font-semibold">{value as string}</div>
              <div className="mt-1 text-[9px] vipaz-text-subtle">{detail as string}</div>
            </div>
          );
        })}
      </section>

      <section className="vipaz-card overflow-hidden">
        <div className="p-4 sm:p-5 border-b vipaz-border-subtle">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 vipaz-text-subtle" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar processo, parte, evento, classificação ou providência..."
                className="vipaz-input pl-10"
              />
            </div>
            <button
              onClick={() => setShowFilters((value) => !value)}
              className={`vipaz-button-secondary ${showFilters ? 'bg-[var(--bg-surface-subtle)]' : ''}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
              {activeFilterCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[var(--primary-subtle)] px-1.5 text-[9px] vipaz-text-brand">{activeFilterCount}</span>}
            </button>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="px-3 text-[11px] vipaz-text-muted hover:vipaz-text-primary inline-flex items-center gap-1.5">
                <X className="w-3.5 h-3.5" /> Limpar
              </button>
            )}
          </div>

          {showFilters && (
            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                ['Fonte', source, setSource, SOURCE_OPTIONS],
                ['Status', status, setStatus, STATUS_OPTIONS],
                ['Relevância', relevance, setRelevance, RELEVANCE_OPTIONS],
              ].map(([label, value, setter, options]) => (
                <label key={label as string} className="block">
                  <span className="vipaz-field-label">{label as string}</span>
                  <span className="relative block">
                    <select
                      value={value as string}
                      onChange={(e) => (setter as React.Dispatch<React.SetStateAction<string>>)(e.target.value)}
                      className="vipaz-input appearance-none pr-9"
                    >
                      {(options as readonly string[]).map((option) => <option key={option}>{option}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 vipaz-text-subtle" />
                  </span>
                </label>
              ))}
              <label className="block">
                <span className="vipaz-field-label">Período</span>
                <span className="relative block">
                  <select className="vipaz-input appearance-none pr-9" defaultValue="Últimas 24 horas">
                    <option>Últimas 24 horas</option>
                    <option>Últimos 7 dias</option>
                    <option>Últimos 30 dias</option>
                    <option>Personalizado</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 vipaz-text-subtle" />
                </span>
              </label>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-left text-[11px]">
            <thead className="border-b vipaz-border-subtle vipaz-text-subtle">
              <tr>
                <th className="px-5 py-3 font-medium">Evento</th>
                <th className="px-4 py-3 font-medium">Origem</th>
                <th className="px-4 py-3 font-medium">Classificação</th>
                <th className="px-4 py-3 font-medium">Relevância</th>
                <th className="px-4 py-3 font-medium">Prazo</th>
                <th className="px-4 py-3 font-medium">Providência</th>
                <th className="px-4 py-3 font-medium">Peça sugerida</th>
                <th className="px-4 py-3 font-medium">Revisão</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`border-b last:border-0 vipaz-border-subtle cursor-pointer transition ${selected?.id === item.id ? 'bg-[var(--primary-subtle)]' : 'hover:bg-[var(--bg-surface-subtle)]'}`}
                >
                  <td className="px-5 py-4">
                    <div className="font-medium">{item.event}</div>
                    <div className="mt-1 text-[9px] vipaz-text-subtle">{item.process !== '—' ? item.process : item.entity}</div>
                  </td>
                  <td className="px-4 py-4"><span className="vipaz-badge">{item.source}</span></td>
                  <td className="px-4 py-4"><div className="font-medium">{item.classification}</div><div className="mt-1 text-[9px] vipaz-text-subtle">{item.date} · {item.time}</div></td>
                  <td className="px-4 py-4"><span className={`inline-flex rounded-full border px-2 py-1 text-[9px] ${relevanceClass[item.relevance]}`}>{item.relevance}</span></td>
                  <td className="px-4 py-4">
                    {item.deadline ? <span className="inline-flex items-center gap-1.5 text-amber-300"><Clock3 className="w-3 h-3" />{item.deadline}</span> : <span className="vipaz-text-subtle">—</span>}
                  </td>
                  <td className="px-4 py-4 max-w-[220px]"><span className="vipaz-text-secondary">{item.action}</span></td>
                  <td className="px-4 py-4"><span className="vipaz-text-primary font-medium">{item.recommendedPiece || '—'}</span></td>
                  <td className="px-4 py-4"><span className={`inline-flex rounded-full border px-2 py-1 text-[9px] ${statusClass[item.status]}`}>{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredEvents.length === 0 && (
            <div className="py-16 text-center">
              <ListFilter className="w-6 h-6 mx-auto vipaz-text-subtle" />
              <p className="mt-3 text-[12px] font-medium">Nenhum evento encontrado.</p>
              <button onClick={clearFilters} className="mt-2 text-[11px] vipaz-text-brand">Limpar filtros</button>
            </div>
          )}
        </div>
      </section>

      <section className="grid xl:grid-cols-[1.35fr_.65fr] gap-5">
        <div className="vipaz-card p-5 sm:p-6">
          <div className="flex items-start justify-between gap-5">
            <div>
              <div className="vipaz-eyebrow mb-2"><ShieldCheck className="w-3.5 h-3.5" /> Análise orientada</div>
              <h2 className="text-[16px] font-semibold">{selected.event}</h2>
              <p className="mt-1 text-[11px] vipaz-text-muted">{selected.entity}{selected.process !== '—' ? ` · ${selected.process}` : ''}</p>
            </div>
            <span className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] ${statusClass[selected.status]}`}>{selected.status}</span>
          </div>

          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            <div className="vipaz-surface-subtle rounded-xl p-4"><div className="text-[9px] vipaz-text-subtle uppercase tracking-wider">Confiança</div><div className="mt-2 text-xl font-semibold">{selected.confidence}%</div></div>
            <div className="vipaz-surface-subtle rounded-xl p-4"><div className="text-[9px] vipaz-text-subtle uppercase tracking-wider">Providência</div><div className="mt-2 text-[12px] font-medium">{selected.action}</div></div>
            <div className="vipaz-surface-subtle rounded-xl p-4"><div className="text-[9px] vipaz-text-subtle uppercase tracking-wider">Peça recomendada</div><div className="mt-2 text-[12px] font-medium">{selected.recommendedPiece || 'Nenhuma'}</div></div>
          </div>

          <div className="mt-5 rounded-xl border vipaz-border-subtle p-4">
            <div className="flex items-center gap-2 text-[10px] vipaz-text-muted"><Sparkles className="w-3.5 h-3.5 vipaz-text-brand" /> Racional operacional</div>
            <p className="mt-3 text-[12px] leading-6 vipaz-text-secondary">
              O Monitor relaciona a fonte ao caso, classifica o evento, identifica possível prazo e apresenta uma providência para revisão profissional. A recomendação não substitui a análise do advogado.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={() => onNavigate(`/app/${organization.slug}/casos`)} className="vipaz-button-secondary"><Link2 className="w-3.5 h-3.5" /> Abrir caso relacionado</button>
            <button disabled className="vipaz-button-primary opacity-60 cursor-not-allowed" title="A integração com o fluxo de produção será ativada em etapa futura."><FileOutput className="w-3.5 h-3.5" /> Preparar peça <span className="text-[8px] uppercase tracking-wider opacity-70">futuro</span></button>
          </div>
        </div>

        <div className="space-y-5">
          <div className="vipaz-card p-5">
            <div className="flex items-center gap-2"><Building2 className="w-4 h-4 vipaz-text-brand" /><h2 className="text-[14px] font-semibold">Identificação empresarial</h2></div>
            <p className="mt-2 text-[11px] leading-5 vipaz-text-muted">Consulta futura ao CNPJ para enriquecer o contexto do caso e permitir filtros por entidade, situação e atributos cadastrais.</p>
            <div className="mt-4 flex gap-2">
              <input
                value={cnpjQuery}
                onChange={(e) => setCnpjQuery(e.target.value)}
                placeholder="CNPJ · 14 dígitos"
                className="vipaz-input"
                inputMode="numeric"
              />
              <button disabled className="vipaz-button-secondary shrink-0 opacity-60 cursor-not-allowed" title="Integração futura com a API CNPJ"><Search className="w-3.5 h-3.5" /> Consultar</button>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {['Situação cadastral', 'Natureza jurídica', 'CNAE', 'UF', 'Porte', 'QSA'].map((item) => <span key={item} className="vipaz-badge">{item}</span>)}
            </div>
          </div>

          <div className="vipaz-card p-5">
            <div className="flex items-center gap-2"><Landmark className="w-4 h-4 vipaz-text-brand" /><h2 className="text-[14px] font-semibold">Fontes conectáveis</h2></div>
            <div className="mt-4 space-y-3">
              {[
                ['DJEN / PJe', 'Publicações e movimentações processuais'],
                ['CNPJ', 'Dados cadastrais e vínculos empresariais'],
                ['Matter', 'Contexto e documentos já conhecidos'],
                ['Outras fontes', 'APIs e bases autorizadas pela organização'],
              ].map(([title, detail]) => (
                <div key={title} className="flex items-start gap-3 border-b last:border-0 vipaz-border-subtle pb-3 last:pb-0">
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-emerald-400 shrink-0" />
                  <div><div className="text-[11px] font-medium">{title}</div><div className="mt-0.5 text-[9px] vipaz-text-subtle">{detail}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="vipaz-surface-subtle border vipaz-border-subtle rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-[10px] vipaz-text-brand uppercase tracking-[.14em] font-semibold"><Filter className="w-3.5 h-3.5" /> Arquitetura preparada para integração</div>
            <h2 className="mt-2 text-[15px] font-semibold">Da fonte ao documento, sem transformar o advogado em operador de dados.</h2>
            <p className="mt-2 max-w-3xl text-[11px] leading-5 vipaz-text-muted">O front-end já organiza os pontos de entrada para ingestão, normalização, deduplicação, correspondência com Matters, classificação, análise de prazo, revisão humana e encaminhamento à produção. As integrações de API serão conectadas a esta camada sem alterar a experiência de trabalho.</p>
          </div>
          <button onClick={() => onNavigate(`/app/${organization.slug}/casos`)} className="vipaz-button-secondary shrink-0">Ver casos <ArrowRight className="w-3.5 h-3.5" /></button>
        </div>
      </section>

      <div className="text-[9px] vipaz-text-subtle flex items-center gap-2">
        <AlertCircle className="w-3 h-3" />
        Interface em modo demonstrativo: os eventos exibidos acima representam a experiência futura do Monitor e não constituem dados de sincronização em produção.
      </div>
    </div>
  );
};
