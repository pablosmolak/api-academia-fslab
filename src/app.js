import cors from 'cors';
import express from 'express';
import { prisma } from "./config/prismaClient.js";
import routes from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

routes(app);

export default app;