import type { Request, Response } from 'express';
import { handleLegalAiField } from '../../src/server/legalAiHandler.js';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido.' });
  }
  return handleLegalAiField(req, res);
}
