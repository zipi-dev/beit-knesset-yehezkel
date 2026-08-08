import express from 'express';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';


const app = express();

// התחברות לדטהבייס
connectDB();

app.use(express.json()); // מאפשר לקבל באדי - אוביקט


app.get('/', (req, res) => {
  res.send('Server of sinagogue is running!');
});

app.listen(env.PORT, () => {
    // כשהשרת עולה בפעם הראשונה מגיע לכאן
    console.log(`Server is running on http://localhost:${env.PORT} `);
});
