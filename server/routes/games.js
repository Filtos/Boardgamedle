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
            case "boardgamecategory": {
                finalGame.categories.push(l)
            }
            case "boardgamemechanic": {
                finalGame.mechanics.push(l)
            }
            case "boardgamedesigner": {
                finalGame.designers.push(l)
            }
            case "boardgameartist": {
                finalGame.artists.push(l)
            }
            case "boardgamepublisher": {
                finalGame.publishers.push(l)
            }
        }
    })

    return finalGame;
}

router.get("/hot", async (req, res) => {
    const response = await axios.get('https://boardgamegeek.com/xmlapi2/hot?type=boardgame');
    
    const parsed = parser.parse(response.data);
    
    res.json(parsed.items.item);
});

router.get("/today", async (req, res) => {
    const { query } = req;

    const bggResponse = await axios.get('https://boardgamegeek.com/xmlapi2/thing?id=123540');
    
    const parsed = parser.parse(bggResponse.data);

    res.json(extractGameData(parsed.items.item));
});

module.exports = router;