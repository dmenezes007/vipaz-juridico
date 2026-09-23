import { supabase } from '../lib/supabase';

export type AgravoAiField =
 | 'executive_summary' | 'claim_summary' | 'controversy_delimitation'
 | 'appeal_effect_suspensive' | 'appeal_mistaken_premise' | 'appeal_fumus'
 | 'appeal_periculum' | 'appeal_countersecurity' | 'appeal_final_requests';

export const agravoAiService={
 async generate(field:AgravoAiField,context:Record<string,unknown>):Promise<string>{
   const {data:{session}}=await supabase.auth.getSession();
   if(!session?.access_token) throw new Error('Sessão expirada. Entre novamente para usar a assistência por IA.');
   const response=await fetch('/api/ai/agravo-field',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${session.access_token}`},body:JSON.stringify({field,context})});
   const body=await response.json().catch(()=>({}));
   if(!response.ok) throw new Error(body?.error||'Falha na geração assistida.');
   return String(body.content||'');
 }
};
