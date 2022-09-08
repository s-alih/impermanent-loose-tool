import { Router, Request, Response, NextFunction } from 'express';

import { celebrate, Joi } from 'celebrate';

import Position from '../../utils/positionsHealpers';
import { Container } from 'typedi';

const route = Router();

export default (app: Router) => {
  app.use('/user/position', route);

  route.get(
    '/impeloss',
    // celebrate({
    //   body: Joi.object({
    //     address: Joi.string().required(),
    //   }),
    // }),

    async (req: Request, res: Response, next: NextFunction) => {
      let postions = Container.get(Position);
      console.log(req.query.address);
      await postions.compute(req.query.address);
      try {
        return res.status(201).json({ message: 'success' });
      } catch (e) {
        console.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );
};
