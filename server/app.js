import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import {errorHandler} from './middlewares/error.middleware.js';
import shiurimRoutes from './routes/shiurim.router.js';
import rabbiRoutes from './routes/rabbi.router.js';
import blessRoutes from './routes/bless.router.js';
import userRoutes from './routes/user.router.js';
import { scheduleBlessingsEmail } from './services/blessingEmailService.js';
import eventRoutes from './routes/event.routes.js'; 
import opinionRoutes from './routes/opinion.routes.js';  
import scheduleRoutes from './routes/schedule.routes.js';
import zmanimRoutes from './routes/zmanim.routes.js'; 
  import { scheduleKeepAlive } from './services/keepAliveService.js';
const app = express();

// Connect to the database
connectDB();

// Schedule the blessings email task
scheduleBlessingsEmail();
// Schedule the keep-alive task
scheduleKeepAlive();

app.use(cors()); 
app.use(express.json()); // מאפשר לקבל באדי - אוביקט
app.use('/api/event', eventRoutes);
app.use('/api/opinion', opinionRoutes); 
app.use('/api/schedule', scheduleRoutes);
app.use('/api/zmanim', zmanimRoutes);
app.get('/', (req, res) => {
  res.send('Server of sinagogue is running!');
});

app.use('/shiurim', shiurimRoutes);
app.use('/rabbis', rabbiRoutes);
app.use('/blessings', blessRoutes);
app.use('/users', userRoutes);



app.use(errorHandler);

app.listen(env.PORT, () => {
  // When the server starts up for the first time, it arrives here.
    console.log(`Server is running on http://localhost:${env.PORT} `);
});

