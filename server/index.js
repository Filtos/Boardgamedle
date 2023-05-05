const path = require('path');
const express = require('express');
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');

const parser = new XMLParser({
  attributeNamePrefix: "",
  ignoreAttributes: false,
});

const PORT = process.env.PORT || 3001;

const app = express();

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Handle GET requests to /api route
app.get("/api", async (req, res) => {
  const response = await axios.get('https://boardgamegeek.com/xmlapi2/hot?type=boardgame');
  
  const parsed = parser.parse(response.data);
  
  res.json({ message: "Hello from servers!", games: parsed.items.item });
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});