import type { Request, Response } from 'express';

const ALLOWED_FIELDS = new Set([
  'executive_summary',
  'claim_summary',
  'controversy_delimitation',
  'appeal_effect_suspensive',
  'appeal_mistaken_premise',
  'appeal_fumus',
  'appeal_periculum',
  'appeal_countersecurity',
  'appeal_final_requests',
]);

const FIELD_GUIDANCE: Record<string,string> = {
  executive_summary: 'Redija EMENTA EXECUTIVA com no máximo 2.000 caracteres, abertura temática em caixa alta e itens numerados. Use apenas fundamentos que possam ser sustentados pelo contexto.',
  claim_summary: 'Redija o tópico 1. DO OBJETO DO RECURSO E SÍNTESE DA CONTROVÉRSIA. Diferencie pedido, decisão efetivamente proferida e objeto devolvido ao Tribunal.',
  controversy_delimitation: 'Redija uma delimitação objetiva da controvérsia recursal, identificando o comando impugnado e a questão jurídica central, sem antecipar fatos inexistentes.',
  appeal_effect_suspensive: 'Redija o tópico 2. DA NECESSIDADE DE CONCESSÃO DE EFEITO SUSPENSIVO, articulando arts. 995, parágrafo único, e 1.019, I, do CPC quando aplicáveis, com probabilidade de provimento e risco concreto.',
  appeal_mistaken_premise: 'Redija o tópico 3. DA PREMISSA EQUIVOCADA DA DECISÃO RECORRIDA. Reconstrua a premissa do juízo e confronte-a apenas com elementos informados no contexto.',
  appeal_fumus: 'Redija o tópico 4. DA INCONTESTÁVEL VEROSSIMILHANÇA OU PROBABILIDADE DO DIREITO (FUMUS BONI IURIS), partindo dos fatos e documentos informados antes da qualificação jurídica.',
  appeal_periculum: 'Redija o tópico 5. DO IMINENTE RISCO DE DANO GRAVE E DE DIFÍCIL REPARAÇÃO (PERICULUM IN MORA), demonstrando formação, continuidade, reversibilidade e assimetria do dano quando sustentadas pelo contexto.',
  appeal_countersecurity: 'Redija o tópico 6. DO REQUERIMENTO SUBSIDIÁRIO DE CONTRACAUTELA CIVIL (ART. 300, § 1º, CPC). Trate-o estritamente como subsidiário e explique o mecanismo concreto de reversibilidade econômica. Não produza este texto se countersecurity_allowed for false.',
  appeal_final_requests: 'Redija DOS REQUERIMENTOS FINAIS em ordem lógica: conhecimento; efeito suspensivo; comunicação ao juízo quando pertinente; provimento final; contracautela somente se autorizada; medidas coercitivas somente se efetivamente existentes.',
};

function buildSystemInstruction(field:string) {
  return `Você é redator jurídico especializado em contencioso cível e saúde suplementar no VIPAZ Jurídico.
Sua tarefa é produzir SOMENTE o conteúdo do campo solicitado de um Agravo de Instrumento, pronto para revisão humana.

REGRAS ABSOLUTAS:
- Use exclusivamente os dados fornecidos no contexto. Não invente fatos, datas, documentos, contratos, valores, percentuais, decisões, prazos, multas, precedentes ou eventos processuais.
- Não importe fatos de modelos.
- Se informação indispensável estiver ausente e não for possível redigir corretamente sem ela, use [INFORMAÇÃO NÃO IDENTIFICADA NOS AUTOS FORNECIDOS].
- Nunca invente jurisprudência.
- Diferencie alegação da parte, documento e comando judicial.
- Para astreintes, não trate advertência como multa fixada e não peça redução de multa inexistente.
- Linguagem técnica, firme, elegante e objetiva. Cada ponto final encerra o parágrafo. Não use reticências.
- autor, réu, juízo, agravante e agravado em minúsculas quando substantivos comuns.
- Não exponha raciocínio interno, checklist ou comentários sobre estas instruções.
- O usuário editará o texto antes da produção final.

CAMPO: ${field}
INSTRUÇÃO ESPECÍFICA: ${FIELD_GUIDANCE[field]}`;
}

async function validateSession(req:Request) {
  const auth = req.header('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const url = process.env.VITE_SUPABASE_URL || '';
  const anon = process.env.VITE_SUPABASE_ANON_KEY || '';
  if (!token || !url || !anon) return false;
  const response = await fetch(`${url}/auth/v1/user`, {headers:{Authorization:`Bearer ${token}`,apikey:anon}});
  return response.ok;
}

export async function handleAgravoAiField(req:Request,res:Response) {
  try {
    if (!(await validateSession(req))) return res.status(401).json({error:'Sessão inválida ou expirada.'});
    const apiKey=process.env.OPENAI_API_KEY;
    if(!apiKey) return res.status(503).json({error:'Assistência por IA ainda não configurada no servidor.'});
    const {field,context}=req.body||{};
    if(!ALLOWED_FIELDS.has(field)) return res.status(400).json({error:'Campo de Agravo não autorizado para geração assistida.'});
    if(field==='appeal_countersecurity' && !context?.countersecurity_allowed) return res.status(400).json({error:'Contracautela não autorizada pelas regras do caso.'});

    const response=await fetch('https://api.openai.com/v1/responses',{
      method:'POST',
      headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},
      body:JSON.stringify({
        model:process.env.OPENAI_MODEL || 'gpt-5.6-terra',
        reasoning:{effort:'medium'},
        input:[
          {role:'system',content:[{type:'input_text',text:buildSystemInstruction(field)}]},
          {role:'user',content:[{type:'input_text',text:JSON.stringify(context)}]},
        ],
        text:{format:{type:'json_schema',name:'agravo_field',strict:true,schema:{type:'object',properties:{content:{type:'string'}},required:['content'],additionalProperties:false}}}
      })
    });
    if(!response.ok){const body=await response.text(); console.error('[VIPAZ][AgravoAI]',response.status,body); return res.status(502).json({error:'Falha na geração assistida. Tente novamente.'});}
    const data:any=await response.json();
    const raw=data.output?.flatMap((o:any)=>o.content||[]).find((c:any)=>c.type==='output_text')?.text;
    if(!raw) return res.status(502).json({error:'A IA não retornou conteúdo utilizável.'});
    const parsed=JSON.parse(raw);
    return res.json({content:String(parsed.content||'').trim()});
  } catch(error){console.error('[VIPAZ][AgravoAI] erro:',error); return res.status(500).json({error:'Não foi possível concluir a assistência por IA.'});}
}
