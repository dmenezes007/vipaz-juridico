import type { Request, Response } from 'express';
import { handleCaseAnalysis } from '../src/server/caseAnalysisHandler.js';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido.' });
  }
  return handleCaseAnalysis(req, res);
}
