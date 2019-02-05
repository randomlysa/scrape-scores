//  https://stackoverflow.com/questions/11744975/enabling-https-on-express-js#11745114
const fs = require('fs');
const http = require('http');
const https = require('https');

const cors = require('cors');
const NodeCache = require('node-cache');
const fetch = require('node-fetch');
const privateKey = fs.readFileSync('private.key', 'utf8');
const certificate = fs.readFileSync('server.crt', 'utf8');

const credentials = { key: privateKey, cert: certificate };
const express = require('express');
const app = express();
app.use(cors());

// your express configuration here

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

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8443);
