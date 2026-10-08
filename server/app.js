import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import {errorHandler} from './middlewares/error.middleware.js';
import productRoutes from './routes/products.router.js';
import shiurimRoutes from './routes/shiurim.router.js';
import rabbiRoutes from './routes/rabbi.router.js';
import blessRoutes from './routes/bless.router.js';
import { scheduleBlessingsEmail } from './services/blessingEmailService.js';

const app = express();

// Connect to the database
connectDB();

// Schedule the blessings email task
scheduleBlessingsEmail();

app.use(cors({ origin: 'http://127.0.0.1:5500' }));

app.use(express.json()); // can get body


app.get('/', (req, res) => {
  res.send('Server of sinagogue is running!');
});

app.use('/products',productRoutes);
app.use('/shiurim', shiurimRoutes);
app.use('/rabbis', rabbiRoutes);
app.use('/blessings', blessRoutes);

app.use(errorHandler);

app.listen(env.PORT, () => {
  // When the server starts up for the first time, it arrives here.
    console.log(`Server is running on http://localhost:${env.PORT} `);
});

