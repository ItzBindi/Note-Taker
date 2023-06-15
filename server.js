const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const PORT = 3001;
const uuid = require('./helpers/uuid');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuid();
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        notes.push(newNote);
        fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), (err) => {
            if (err) throw err;
            res.json(notes);
        });
    });
});

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        const newNotes = notes.filter((note) => note.id !== id);
        fs.writeFile('./db/db.json', JSON.stringify(newNotes, null, 2), (err) => {
            if (err) throw err;
            res.json(newNotes);
        });
    });
});


app.listen(PORT, () => 
    console.log(`Example app listening at http://localhost:${PORT}`)
);