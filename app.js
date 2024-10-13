import express from 'express';
import mongoose from 'mongoose';
import { DATABASE_URL } from './env.js';

const app = express();

app.get('/hello', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

mongoose.connect(DATABASE_URL).then(() => console.log('Connected to MongoDB'));