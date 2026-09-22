import React, { useEffect, useState } from 'react';
import { ArrowRight, FilePlus2, Files, CheckCircle2, Clock3 } from 'lucide-react';
import { Organization, GenerationJob, GeneratedDocument } from '../types';
import { generationService } from '../services/generationService';
import { StatusBadge } from '../components/StatusBadge';
import { DocumentViewerModal } from '../components/DocumentViewerModal';

interface DashboardViewProps { organization: Organization; onNavigate: (path: string) => void; }

export const DashboardView: React.FC<DashboardViewProps> = ({ organization, onNavigate }) => {
  const [jobs,setJobs]=useState<GenerationJob[]>([]);
  const [selectedDoc,setSelectedDoc]=useState<GeneratedDocument|null>(null);
  useEffect(()=>{generationService.getJobsByOrganization(organization.id).then(setJobs);},[organization.id]);
  const completed=jobs.filter(j=>j.status==='completed').length;
  const processing=jobs.filter(j=>j.status==='processing').length;
  const openDoc=async(id:string)=>{const doc=await generationService.getDocumentByJobId(id);if(doc)setSelectedDoc(doc);};

  return <div className="space-y-10 animate-in fade-in duration-150">
    <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div><div className="vipaz-eyebrow mb-3">{organization.name}</div><h1 className="vipaz-page-title">Seu trabalho jurídico, organizado.</h1><p className="vipaz-page-description">Acompanhe casos recentes e inicie uma nova produção a partir do método validado da sua organização.</p></div>
      <button onClick={()=>onNavigate(`/app/${organization.slug}/nova-peca`)} className="vipaz-button-primary shrink-0"><FilePlus2 className="w-4 h-4"/>Nova peça</button>
    </section>

    <section className="grid sm:grid-cols-3 border-y vipaz-border-subtle">
      {[[jobs.length,'Produções','Registros no workspace',Files],[processing,'Em andamento','Produções em processamento',Clock3],[completed,'Concluídas','Documentos disponíveis',CheckCircle2]].map(([value,label,desc,Icon],i)=>{
        const I=Icon as React.ElementType; return <div key={label as string} className={`py-6 ${i?'sm:border-l sm:pl-7 vipaz-border-subtle':''}`}>
          <div className="flex items-center gap-2 text-[11px] vipaz-text-muted"><I className="w-4 h-4"/>{label as string}</div><div className="mt-3 text-3xl tracking-[-.04em] font-semibold">{value as number}</div><div className="mt-1 text-[10px] vipaz-text-subtle">{desc as string}</div>
        </div>;
      })}
    </section>

    <section>
      <div className="mb-5 flex items-end justify-between"><div><h2 className="text-[15px] font-semibold">Atividade recente</h2><p className="mt-1 text-[11px] vipaz-text-muted">Últimas produções registradas.</p></div><button onClick={()=>onNavigate(`/app/${organization.slug}/documentos`)} className="text-[11px] vipaz-text-muted hover:vipaz-text-brand flex items-center gap-1">Ver documentos <ArrowRight className="w-3 h-3"/></button></div>
      {jobs.length===0 ? <div className="vipaz-card p-10 text-center"><p className="text-[12px] vipaz-text-muted">Nenhuma produção registrada.</p><button onClick={()=>onNavigate(`/app/${organization.slug}/nova-peca`)} className="mt-4 text-[12px] font-semibold vipaz-text-brand">Criar primeira peça</button></div> :
      <div className="vipaz-card overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-left text-[11px]">
        <thead className="border-b vipaz-border-subtle vipaz-text-subtle"><tr><th className="px-5 py-3 font-medium">Processo</th><th className="px-5 py-3 font-medium">Peça</th><th className="px-5 py-3 font-medium">Parte representada</th><th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3"></th></tr></thead>
        <tbody>{jobs.slice(0,6).map(job=><tr key={job.id} className="border-b last:border-0 vipaz-border-subtle hover:bg-[var(--bg-surface-subtle)] transition">
          <td className="px-5 py-4"><div className="font-medium">{job.process_data?.process_number||job.process?.process_number||'—'}</div><div className="mt-1 text-[9px] vipaz-text-subtle">{job.process_data?.court||job.process?.court||''}</div></td>
          <td className="px-5 py-4 font-medium">{job.document_type}</td><td className="px-5 py-4 vipaz-text-secondary">{job.process_data?.represented_party||job.process?.represented_party||'—'}</td><td className="px-5 py-4"><StatusBadge status={job.status}/></td>
          <td className="px-5 py-4 text-right"><button onClick={()=>onNavigate(`/app/${organization.slug}/geracoes/${job.id}`)} className="vipaz-text-brand font-medium">Abrir</button>{job.status==='completed'&&<button onClick={()=>openDoc(job.id)} className="ml-4 vipaz-text-muted">Visualizar</button>}</td>
        </tr>)}</tbody>
      </table></div></div>}
    </section>
    {selectedDoc&&<DocumentViewerModal document={selectedDoc} onClose={()=>setSelectedDoc(null)}/>}
  </div>;
};