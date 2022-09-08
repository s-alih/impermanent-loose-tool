import { Router, Request, Response, NextFunction } from 'express';

import Position from '../../utils/positionsHealpers';
import { Container } from 'typedi';

const route = Router();

export default (app: Router) => {
  app.use('/user/position', route);

  // -------------- find impermenent loss ----------------------- //
  route.get('/impelosses', async (req: Request, res: Response, next: NextFunction) => {
    let postions = Container.get(Position);

    try {
      let result = await postions.compute(req.query.address);
      return res.status(201).json(result);
    } catch (e) {
      console.error('🔥 error: %o', e);
      return next(e);
    }
  });
};
