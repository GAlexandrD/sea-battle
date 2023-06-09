import { config } from 'dotenv';
import express, { Express, Request, Response } from 'express';
import { startWSS } from './ws-server';
import { sequelize } from './db';
import router from './router/router';
import { assosiate } from './models/assosiate';
import cors from 'cors';
config();

assosiate();

startWSS();
const app: Express = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use(express.json());
app.use('/', router);

const port = process.env.PORT_HTTP;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, async () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
