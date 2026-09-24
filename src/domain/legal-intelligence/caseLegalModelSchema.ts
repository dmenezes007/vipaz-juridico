import { z } from 'zod';

export const SourceLocatorSchema = z.object({
  documentId: z.string().min(1),
  documentName: z.string().optional(),
  page: z.number().int().positive().optional(),
  event: z.string().optional(),
  excerpt: z.string().max(1200).optional(),
});

const evidenceStatus = z.enum(['alleged', 'proven', 'disputed', 'unknown']);
const confidence = z.enum(['high', 'medium', 'low']);

const sourcedString = z.object({
  value: z.string(),
  status: evidenceStatus,
  confidence,
  sources: z.array(SourceLocatorSchema),
});

const sourcedBoolean = z.object({
  value: z.boolean(),
  status: evidenceStatus,
  confidence,
  sources: z.array(SourceLocatorSchema),
});

const sourcedNumber = z.object({
  value: z.number(),
  status: evidenceStatus,
  confidence,
  sources: z.array(SourceLocatorSchema),
});

/**
 * Output contract exposed to the LLM. Provenance metadata that belongs to the
 * execution itself (timestamp/version/document list) is attached server-side.
 */
export const CaseAnalystOutputSchema = z.object({
  identification: z.object({
    processNumber: sourcedString,
    court: sourcedString.optional(),
    parties: z.array(z.object({
      name: z.string(),
      role: z.enum(['plaintiff', 'defendant', 'third_party', 'unknown']),
      nature: z.enum(['person', 'company', 'unknown']).optional(),
    })),
  }),
  proceduralState: z.object({
    injunction: z.enum(['not_requested', 'requested_not_decided', 'granted', 'denied']),
    injunctionComplianceProven: z.boolean(),
    injunctionSources: z.array(SourceLocatorSchema),
  }),
  contract: z.object({
    type: z.enum(['individual', 'collective_business', 'collective_membership', 'unknown']),
    executionDate: sourcedString.optional(),
    adaptedToLaw9656: sourcedBoolean.optional(),
    product: sourcedString.optional(),
    beneficiaryCount: sourcedNumber.optional(),
  }),
  claims: z.array(z.object({
    id: z.string(),
    description: z.string(),
    category: z.string().optional(),
    amount: z.string().optional(),
    sources: z.array(SourceLocatorSchema),
  })),
  facts: z.array(z.object({
    id: z.string(),
    statement: z.string(),
    status: evidenceStatus,
    confidence,
    sources: z.array(SourceLocatorSchema),
    tags: z.array(z.string()).optional(),
  })),
  evidence: z.array(z.object({
    id: z.string(),
    kind: z.enum(['petition', 'decision', 'contract', 'invoice', 'expert_report', 'medical', 'other']),
    description: z.string(),
    sources: z.array(SourceLocatorSchema),
  })),
  legalIssues: z.array(z.object({
    id: z.string(),
    description: z.string(),
    tags: z.array(z.string()).optional(),
    sources: z.array(SourceLocatorSchema),
  })),
  uncertainties: z.array(z.string()),
});

export type CaseAnalystStructuredOutput = z.infer<typeof CaseAnalystOutputSchema>;
