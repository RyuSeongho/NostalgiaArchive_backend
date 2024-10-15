import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import groupRoutes from './routes/groupRoutes.js';
import cors from 'cors'
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/groups', groupRoutes);

app.get('/hello', (req, res) => {
  res.send('Hello World!');
});

app.use(errorHandler);

mongoose.connect(process.env.DATABASE_URL).then(() => console.log('Connected to MongoDB'));


app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port 3000');
});