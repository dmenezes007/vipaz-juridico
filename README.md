# VIPAZ Jurídico — SaaS LegalTech B2B

> **Automação e Inteligência Artificial para produção jurídica de alta performance.**

O **VIPAZ Jurídico** é uma plataforma concebida para bancas de advocacia e procuradorias públicas que combina automação, inteligência artificial generativa, engenharia de contexto e modelos jurídicos homologados para transformar documentos processuais e informações fáticas em peças forenses prontas para revisão profissional.

---

## 1. Estrutura do Projeto

```
├── .env.example                     # Declaração de variáveis de ambiente
├── index.html                       # Entrypoint HTML com meta tags e tipografia editorial
├── metadata.json                    # Metadados da aplicação AI Studio
├── package.json                     # Scripts e dependências
├── tsconfig.json                    # Configuração TypeScript
├── vite.config.ts                   # Configuração Vite com Tailwind CSS
├── supabase/
│   └── schema.sql                   # DDL PostgreSQL completo com Row Level Security (RLS)
├── src/
│   ├── main.tsx                     # Ponto de montagem React
│   ├── App.tsx                      # Roteamento central e proteção de rotas multi-tenant
│   ├── index.css                    # Folha global de estilos com Tailwind CSS e fontes
│   ├── types/
│   │   └── index.ts                 # Interfaces e tipos para organizações, jobs, peças e etapas
│   ├── services/
│   │   ├── aiAdapter.ts             # Interface desacoplada (Adapter Pattern) para provedores de IA
│   │   ├── authService.ts           # Gerenciamento de sessão, perfis e multi-tenant (CAW / Invicta)
│   │   └── generationService.ts     # Orquestração do pipeline de 10 etapas, jobs e downloads
│   ├── components/
│   │   ├── AppShell.tsx             # Shell com sidebar, topbar e modal de alternância de tenant
│   │   ├── Sidebar.tsx              # Barra de navegação editorial com identificador de organização
│   │   ├── Topbar.tsx               # Barra superior com status de isolamento RLS e perfil
│   │   ├── StatusBadge.tsx          # Tag semântica de status (concluído, processando, pendente)
│   │   ├── TenantBadge.tsx          # Indicador do cliente corporativo ativo
│   │   ├── SubjectMultiSelect.tsx   # Componente profissional multi-select de matérias jurídicas
│   │   ├── PdfUploader.tsx          # Upload drag-and-drop de PDF com validação e metadados
│   │   ├── GenerationTimeline.tsx   # Visualização das 10 etapas metodológicas do processo
│   │   ├── DocumentViewerModal.tsx  # Leitor forense da peça gerada (com abas, cópia e impressão)
│   │   └── TenantSwitcherModal.tsx  # Modal de troca rápida de tenant para avaliação
│   └── views/
│       ├── LandingPage.tsx          # Página pública editorial e institucional
│       ├── LoginPage.tsx            # Login minimalista com perfis de demonstração
│       ├── DashboardView.tsx        # Visão Geral do tenant com métricas e demandas recentes
│       ├── NovaPecaView.tsx         # Formulário de criação de peça com modelo homologado
│       ├── GeracaoView.tsx          # Tela de processamento em tempo real (10 etapas) e conclusão
│       └── DocumentosView.tsx       # Acervo e histórico com busca, filtros e download
```

---

## 2. Decisões Arquiteturais

1. **Arquitetura Multi-Tenant com Isolamento por Organização**:
   - Cada tabela relacional referencia `organization_id`.
   - O schema PostgreSQL em `supabase/schema.sql` implementa políticas de **Row Level Security (RLS)** através da função `user_belongs_to_org(org_id UUID)`.
   - O primeiro cliente configurado é **CAW Advogados Associados** (`/app/caw`). O segundo cliente pré-configurado é **Invicta Gestão Pública** (`/app/invicta`).
2. **Camada de Inteligência Artificial Desacoplada (Adapter Pattern)**:
   - A interface `AIOrchestratorAdapter` define os contratos de extração contextual, delimitação de controvérsia, seleção de teses e auditoria de consistência sem prender a aplicação a um modelo ou provedor proprietário.
3. **Pipeline Metodológico Real em 10 Etapas**:
   - A produção jurídica segue uma sequência forense estrita:
     1. Processo recebido
     2. Documentos identificados
     3. Contexto processual estruturado
     4. Controvérsia delimitada
     5. Modelo jurídico aplicado
     6. Teses em elaboração
     7. Peça em redação
     8. Consistência em revisão
     9. Documento em formatação
     10. Concluído
4. **Armazenamento Seguro de Documentos (Storage)**:
   - Os arquivos PDF de autos processuais não são despachados de forma insegura; são mantidos em buckets privados com acesso por signed URLs temporárias.
5. **Experiência Visual Anti-Slop**:
   - Grid editorial sóbrio, navy escuro (`#070C18`), tipografia de precisão com fontes serifadas forenses (`Newsreader`), monoespacadas para metadados (`JetBrains Mono`) e modernas para interface (`Plus Jakarta Sans`).

---

## 3. Variáveis de Ambiente Necessárias

Crie um arquivo `.env` baseado no `.env.example`:

```env
# Supabase Configuration
VITE_SUPABASE_URL="https://seu-projeto.supabase.co"
VITE_SUPABASE_ANON_KEY="sua-chave-publica-anon"

# Google Gemini API Key (Opcional se executado com AI Studio)
GEMINI_API_KEY="sua-chave-aqui"
```

*Nota: Na ausência das variáveis de Supabase, o sistema ativa automaticamente um mecanismo de persistência e simulação em memória/localStorage de alta fidelidade para visualização e testes sem quebras.*

---

## 4. O que está Real vs. O que utiliza Mocks

| Funcionalidade | Status no MVP | Descrição |
|---|---|---|
| **Interface e Roteamento** | **100% Real** | Navegação integral `/`, `/login`, `/app/caw`, `/app/caw/nova-peca`, `/app/caw/geracoes/:id`, `/app/caw/documentos` |
| **Multi-Tenant (CAW / Invicta)** | **100% Real** | Alternância dinâmica de tenant com isolamento de contexto |
| **Validação de Formulários** | **100% Real** | Checagem de CNJ, matérias, campos obrigatórios e PDF |
| **Download DOCX / PDF** | **100% Real** | Geração e download de arquivos locais baseados no conteúdo estruturado |
| **Visualizador Forense** | **100% Real** | Modal de leitura integral por seções, com cópia e impressão |
| **Schema & RLS Supabase** | **100% Real** | Arquivo `supabase/schema.sql` pronto para execução |
| **Motor de Inferência LLM** | **Mock / Adapter** | Mock estruturado de alta fidelidade (Saúde Suplementar / Contestação CAW), desacoplado pelo `MockLegalAIAdapter` |
| **OCR de PDF em Massa** | **Mock / Contrato** | Simula extração de peças com telemetria realista |

---

## 5. TODOs para Implantação em Produção

1. Conectar as credenciais reais do projeto Supabase (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`) e executar `supabase/schema.sql` no SQL Editor.
2. Integrar a biblioteca `@supabase/supabase-js` diretamente nas chamadas do `authService` e `generationService`.
3. Criar os buckets privados de storage: `source-documents` e `generated-documents`.
4. Implementar o serviço de orquestração de IA (ex: Cloud Function / Lambda / Worker) que implementa a interface `AIOrchestratorAdapter`.
5. Integrar biblioteca de compilação DOCX nativa (como `docx`) e renderizador PDF server-side.
