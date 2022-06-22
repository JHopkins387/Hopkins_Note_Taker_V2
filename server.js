//starts import express package and initialize app variable
const express = require('express');
const app = express();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3000;
const host = '0.0.0.0';
const fs = require('fs');

let db = require('./db/db.json');

//middleware location
app.use(express.json());
app.use(express.static('public'));

//adds static routes here for the notes.html page and index.html page
app.get('/notes', (req, res) => {
    res.sendFile(__dirname + '/public/notes.html')
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

// GET API route
app.get('/api/notes', (req, res) => {
    res.json(db);
})

//Post API route
app.post('/api/notes', (req, res) => {
    req.body.id = uuidv4();
    db.push(req.body);
    fs.writeFile('./db/db.json', JSON.stringify(db), function (err) {
        if (err) throw err
        console.log('Finished!')
    })
    res.json(req.body);
})

app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    for (let i = 0; i < db.length; i++) {
        if (id === db[i].id) {
            db.splice(i, 1)
        } else {
            res.status(404).send();
        }
    }
    //here I write new db array to db.json file
    fs.writeFile('./db/db.json', JSON.stringify(db), function (err) {
        if (err) throw err
    })
    res.send('DONE!');
})

app.listen(PORT, host, () => {
    console.log(`API server now on port ${PORT}!`);
});


