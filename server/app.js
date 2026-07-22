import express from 'express';



const app = express();


app.use(express.json()); // מאפשר לקבל באדי - אוביקט


app.get('/', (req, res) => {
  res.send('Server of sinagogue is running!');
});

const PORT = 4000; //פה חייבים לשנות לכתובת אמיתית!!!! רק עוד לא עשיתי
app.listen(PORT, () => {
    // כשהשרת עולה בפעם הראשונה מגיע לכאן
    console.log(`Server is running on http://localhost:${PORT} `);
});