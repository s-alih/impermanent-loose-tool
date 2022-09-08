import { Router } from 'express';

import position from './routes/position';

const route = Router();

export default (app: Router) => {
  app.use('/', route);

  // --------------- start of position route ----------------- //
  position(app);
};
