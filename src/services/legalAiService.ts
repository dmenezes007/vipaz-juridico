import { supabase } from '../lib/supabase';

export type LegalAiField =
 | 'executive_summary' | 'claim_summary' | 'controversy_delimitation'
 | 'appeal_effect_suspensive' | 'appeal_mistaken_premise' | 'appeal_fumus'
 | 'appeal_periculum' | 'appeal_countersecurity' | 'appeal_final_requests';

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Não foi possível ler o PDF selecionado.'));
    reader.onload = () => {
      const result = String(reader.result || '');
      resolve(result.includes(',') ? result.split(',')[1] : result);
    };
    reader.readAsDataURL(file);
  });
}

export const legalAiService={
 async generate(field:LegalAiField,context:Record<string,unknown>,sourcePdf:File):Promise<string>{
   const {data:{session}}=await supabase.auth.getSession();
   if(!session?.access_token) throw new Error('Sessão expirada. Entre novamente para usar a assistência por IA.');
   if(!sourcePdf) throw new Error('Anexe os autos processuais em PDF antes de gerar conteúdo com IA.');
   const pdf_base64=await fileToBase64(sourcePdf);
   const response=await fetch('/api/ai/legal-field',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${session.access_token}`},body:JSON.stringify({
     field,context,
     source_pdf:{name:sourcePdf.name,mime_type:sourcePdf.type||'application/pdf',base64:pdf_base64}
   })});
   const body=await response.json().catch(()=>({}));
   if(!response.ok) throw new Error(body?.error||'Falha na geração assistida.');
   return String(body.content||'');
 }
};