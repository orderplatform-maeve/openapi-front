import { NextApiRequest, NextApiResponse } from 'next';
import { getListener } from '@/api/main';

export default (req: NextApiRequest, res: NextApiResponse) =>
  new Promise((resolve) => {
    getListener().then((listener) => {
      listener?.(req, res);
      res.on('finish', resolve);
    });
  });
