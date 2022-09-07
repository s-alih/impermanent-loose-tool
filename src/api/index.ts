import { Router, Request, Response, NextFunction } from 'express';

import position from './routes/position';

const route = Router();

export default (app: Router) => {
  app.use('/', route);

  position(app);
};
