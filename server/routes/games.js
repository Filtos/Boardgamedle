const express = require('express');
const axios = require('axios');
const router = express.Router();
const { XMLParser } = require('fast-xml-parser');

const parser = new XMLParser({
    attributeNamePrefix: "",
    ignoreAttributes: false,
  });

router.get("/hot", async (req, res) => {
    const response = await axios.get('https://boardgamegeek.com/xmlapi2/hot?type=boardgame');
    
    const parsed = parser.parse(response.data);
    
    res.json(parsed.items.item);
});

router.get("/today", async (req, res) => {
    const { query } = req;
    const response = await axios.get('https://boardgamegeek.com/xmlapi2/thing?id=123540');
    
    const parsed = parser.parse(response.data);

    res.json(parsed.items.item);
});

module.exports = router;