//  https://stackoverflow.com/questions/11744975/enabling-https-on-express-js#11745114
const fs = require('fs');
const http = require('http');
const https = require('https');

const cors = require('cors');
const NodeCache = require('node-cache');
const fetch = require('node-fetch');

const express = require('express');
const app = express();
app.use(cors());

const getData = require('./server-getData');

// your express configuration here

// Disabling cache since this is now only a local dev server.
// Store data in cache for 24 hours (86400 seconds). After that, delete, and
// it will be re-fetched.
// const myCache = new NodeCache({ stdTTL: 86400, checkperiod: 120 });

app.get('/', (request, response) => {
  response.send('Hello -- this is the wrong page!');
});

app.get('/macs', async (request, response) => {
  // const cacheData = myCache.get('macs_data');
  // if (cacheData) {
  //   console.log('has cache');
  //   return response.send(cacheData);
  // } else {
  //   console.log('no can has cache');
  // }

  fetch('http://www.mnchristianschools.org/athletics.html')
    .then(res => res.text())
    .then(body => {
      // Save 'body' to cache.
      // myCache.set('macs_data', body, (err, success) => {
      //   if (err) console.log('Error: ', err);
      //   if (success) console.log('Success: ', success);
      // });
      console.log('in fetch');
      const waitData = async rData => {
        return await getData.getData(rData);
      };

      waitData(body).then(d => {
        Promise.all([d[0].boys, d[1].girls]).then(final => {
          // final[0] = boys, final[1] = girls
          response.send(final);
        });
      });
    });
});

var httpServer = http.createServer(app);
var httpsServer = https.createServer(app);

httpServer.listen(8080);
httpsServer.listen(8443);
