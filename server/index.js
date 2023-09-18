const path = require('path');
const express = require('express');


const gamesRouter = require('./routes/games');


const PORT = process.env.PORT || 3001;

const app = express();

app.use('/api/games', gamesRouter);

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});


function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`Server listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  // dbConnect();
  runServer();
}

module.exports = { app };