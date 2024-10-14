import express from 'express';
import mongoose from 'mongoose';
import { DATABASE_URL } from './env.js';
import groupRoutes from './routes/groupRoutes.js';

const app = express();
app.use(express.json());

app.use('/api/groups', groupRoutes);

app.get('/hello', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

mongoose.connect(DATABASE_URL).then(() => console.log('Connected to MongoDB'));