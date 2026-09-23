import { supabase } from '../lib/supabase';

export type LegalAiField =
 | 'executive_summary' | 'claim_summary' | 'controversy_delimitation'
 | 'appeal_effect_suspensive' | 'appeal_mistaken_premise' | 'appeal_fumus'
 | 'appeal_periculum' | 'appeal_countersecurity' | 'appeal_final_requests';

function safeFilename(name: string): string {
  return (name || 'autos.pdf')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(-120);
}

export const legalAiService={
 async generate(
   field:LegalAiField,
   context:Record<string,unknown>,
   sourcePdf:File,
   organizationId:string
 ):Promise<string>{
   const {data:{session}}=await supabase.auth.getSession();
   if(!session?.access_token) throw new Error('Sessão expirada. Entre novamente para usar a assistência por IA.');
   if(!sourcePdf) throw new Error('Anexe os autos processuais em PDF antes de gerar conteúdo com IA.');
   if(!organizationId) throw new Error('Organização não identificada para armazenamento seguro dos autos.');

   // O PDF vai diretamente do navegador ao Storage privado. Isso evita o limite
   // de payload das Vercel Functions e mantém o backend como uma camada leve.
   const requestId = crypto.randomUUID();
   const storagePath = `${organizationId}/ai/${requestId}/${safeFilename(sourcePdf.name)}`;
   const { error: uploadError } = await supabase.storage
     .from('source-documents')
     .upload(storagePath, sourcePdf, {
       contentType: 'application/pdf',
       upsert: false,
     });
   if(uploadError) throw new Error(`Não foi possível armazenar os autos com segurança: ${uploadError.message}`);

   const { data: signedData, error: signedError } = await supabase.storage
     .from('source-documents')
     .createSignedUrl(storagePath, 600);
   if(signedError || !signedData?.signedUrl) {
     throw new Error('Não foi possível criar acesso temporário aos autos para a geração assistida.');
   }

   const response=await fetch('/api/ai/legal-field',{
     method:'POST',
     headers:{'Content-Type':'application/json',Authorization:`Bearer ${session.access_token}`},
     body:JSON.stringify({
       field,
       context,
       source_pdf:{
         name:sourcePdf.name,
         mime_type:sourcePdf.type||'application/pdf',
         signed_url:signedData.signedUrl,
         storage_path:storagePath,
       }
     })
   });
   const body=await response.json().catch(()=>({}));
   if(!response.ok) throw new Error(body?.error||'Falha na geração assistida.');
   return String(body.content||'');
 }
};