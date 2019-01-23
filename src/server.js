// content of index.js
const express = require('express');
const cors = require('cors');
const NodeCache = require('node-cache');

const app = express();
app.use(cors());

const port = 3000;
const fetch = require('node-fetch');

// Store data in cache for 24 hours (86400 seconds). After that, delete, and
// it will be re-fetched.
const myCache = new NodeCache({ stdTTL: 86400, checkperiod: 120 });

app.get('/', (request, response) => {
  response.send('Hello -- this is the wrong page!');
});

app.get('/macs', async (request, response) => {
  const cacheData = myCache.get('macs_data');
  if (cacheData) {
    console.log('has cache');
    return response.send(cacheData);
  } else {
    console.log('no can has cache');
  }

  fetch('http://www.mnchristianschools.org/athletics.html')
    .then(res => res.text())
    .then(body => {
      // Save 'body' to cache.
      myCache.set('macs_data', body, (err, success) => {
        if (err) console.log('Error: ', err);
        if (success) console.log('Success: ', success);
      });
      console.log('in fetch');
      response.send(body);
    });
});

app.listen(port, err => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
});
