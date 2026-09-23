import type { Request, Response } from 'express';
import { handleGenerateDocx } from '../src/server/generateDocxHandler';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Método não permitido.' });
  }
  return handleGenerateDocx(req, res);
}
