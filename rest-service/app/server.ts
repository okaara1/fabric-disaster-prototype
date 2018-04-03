import express from 'express';

import { WelcomeController, RecordController } from './controllers';

const app: express.Application = express();
const port: number = Number(process.env.PORT) || 3000;

app.use('/welcome', WelcomeController);
app.use('/record', RecordController);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});
