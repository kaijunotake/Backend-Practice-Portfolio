//  import the packages
const express = require('express');
const app = express();  // 幫做一個物件來存放所有東西
const port = 3000;

//  middleware, to analyze the request in Json form
app.use(express.json());    //nessesary if you want to get POST /PUT request

const songs = [
    { id: 1, title: "Let It Be", artist: "The Beatles", tags: ["平靜"] },
    { id: 2, title: "Fix You", artist: "Coldplay", tags: ["療癒", "慢"] }
];

//  default home page
app.get('/', (req, res) => {
    res.send('Welcone to Musicbox API!');
});

//  get all the collections
app.get('/songs', (req, res) => {
    res.json(songs);
});

//  啊災
app.post("/songs", (req, res) => {
    try {
        const newSong = req.body;
        
        if(!newSong.title || !newSong.artist) {
            return res.status(400).json({ error:"Song title or name of the artist is missing."})
        }

        // automatically generate ID for songs
        newSong.id = songs.length + 1;

        //
        songs.push(newSong);

        res.status(201).json(newSong);

    } catch (err) {
        res.status(500).json({ error:"Error when adding new song"});
    }
    
});

//  update new tags for song
app.put("/songs/:id/tags", (req, res) => {
    const id = Number(req.params.id);
    const song = songs.find(s => s.id ===id);

    if(!song) {
        return res.status(404).json({ error: "Song ID not found."});
    }

    const newTags = req.body.tags;

    if(!Array.isArray(newTags)) {
        return res.status(400).json({ error: "Please insert an array of labels!"})
    }

    song.tags = newTags;

    console.log("Updated details of this song ", song);

    //  return updated info to user
    res.json(song);
});

// adding a route to serve package.json for freeCodeCamp
const path = require('path');

app.get('/package.json', (req, res) => {
    const filePath = path.join(__dirname, 'package.json');
    const file = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(file);
    res.json(data);
});

//  Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});