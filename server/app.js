import express from 'express';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import {errorHandler} from './middlewares/error.middleware.js';
import productRoutes from './routes/products.router.js';

const app = express();

// התחברות לדטהבייס
connectDB();

app.use(express.json()); // מאפשר לקבל באדי - אוביקט


app.get('/', (req, res) => {
  res.send('Server of sinagogue is running!');
});

app.use('/products',productRoutes);


app.use(errorHandler);

app.listen(env.PORT, () => {
  // When the server starts up for the first time, it arrives here.
    console.log(`Server is running on http://localhost:${env.PORT} `);
});
