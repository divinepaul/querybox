import express from 'express';
import path from 'path';
let app = express();
import db from './db.js';
import bcrypt from 'bcrypt'

app.use(express.static('dist'));

app.use(express.json());


app.post('/api/login', async (req, res) => {
    console.log(req.body);
    let rows = await db.query("SELECT * FROM test");
    res.json(rows.rows);
});

app.get("*", (req,res) => {
   res.sendFile(path.join(path.resolve() , './dist/index.html'));
});

app.listen(8000, async () => {
    console.log("Started server on port 8000");
});

