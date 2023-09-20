const express = require('express');
const axios = require('axios');
const router = express.Router();
const { XMLParser } = require('fast-xml-parser');

const parser = new XMLParser({
    attributeNamePrefix: "",
    ignoreAttributes: false,
});

function extractGameData(rawData) {
    const { 
        yearpublished,
        playingtime,
        maxplayers,
        minplayers,
        image,
        thumbnail,
        link,
        id,
        name,
    } = rawData;

    const finalGame = {
        id,
        name: name?.find(name => name.type === 'primary'),
        year: yearpublished.value,
        playTime: playingtime.value,
        minPlayers: minplayers.value,
        maxPlayers: maxplayers.value,
        image,
        thumbnail,
        categories: [],
        mechanics: [],
        designers: [],
        artists: [],
        publishers: [],
    };
    
    link.map(l => {
        switch (l.type) {
            case "boardgamecategory": 
                finalGame.categories.push({ ...l, guessed: false})
                break;
            case "boardgamemechanic": 
                finalGame.mechanics.push({ ...l, guessed: false})
                break;
            case "boardgamedesigner": 
                finalGame.designers.push({ ...l, guessed: false})
                break;
            case "boardgameartist": 
                finalGame.artists.push({ ...l, guessed: false})
                break;
            case "boardgamepublisher": 
                finalGame.publishers.push({ ...l, guessed: false})
                break;
            default:
                break;
        }
    })

    return finalGame;
}

router.get("/hot", async (req, res) => {

    const response = await axios.get('https://boardgamegeek.com/xmlapi2/hot?type=boardgame');
    
    const parsed = parser.parse(response.data);
    
    res.json(parsed.items.item);
});

router.get("/search", async (req, res) => {

    const { query } = req.query;

    if (query === '') {
        return res.json('')
    };

    const config = {
        params: {
            q: query,
            showcount: 10,
        },
        headers: {
            accept: 'application/json, text/plain, */*'
        }
    }

    const response = await axios.get('https://boardgamegeek.com/search/boardgame', config)

    res.json(response.data.items)
});

router.get("/today", async (req, res) => {
    const { query } = req;

    const bggResponse = await axios.get('https://boardgamegeek.com/xmlapi2/thing?id=350184');
    
    const parsed = parser.parse(bggResponse.data);

    res.json(extractGameData(parsed.items.item));
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    const bggResponse = await axios.get(`https://boardgamegeek.com/xmlapi2/thing?id=${id}`);
    
    const parsed = parser.parse(bggResponse.data);

    res.json(extractGameData(parsed.items.item));
});

module.exports = router;