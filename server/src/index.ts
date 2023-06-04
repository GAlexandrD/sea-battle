import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import { startWSS } from './ws-server.js';
import { sequelize } from './db.js';
import router from './router/router.js';
import { assosiate } from './models/assosiate.js';
import cors from 'cors';
dotenv.config();

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
