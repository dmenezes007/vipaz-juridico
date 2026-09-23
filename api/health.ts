import type { Request, Response } from 'express';

export default function handler(req: Request, res: Response) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Método não permitido.' });
  }
  return res.status(200).json({
    status: 'ok',
    service: 'VIPAZ Jurídico API',
    version: '1.1.0',
    timestamp: new Date().toISOString(),
  });
}
