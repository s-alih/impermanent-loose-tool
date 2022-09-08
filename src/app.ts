import 'reflect-metadata'; // We need this in order to use @Decorators

import express from 'express';
import indexRouter from './api/index';

async function startServer() {
  // ------------------------ load app ------------------------ //
  const app = express();

  // ---------------- routes ----------------------//
  indexRouter(app);

  // ------------ listening ---------------//
  app.listen(8000, () => {
    console.log(`
        ################################################
      🛡️ Server listening on port: 8000 🛡️
      ################################################
    `);
  });
}

startServer();
