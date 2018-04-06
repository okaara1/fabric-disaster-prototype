import express from 'express';
import log4js from 'log4js';
import morgan from 'morgan';

import App from './app';

const port = Number(process.env.PORT) || 3000;

/** Start the service */
App.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});


