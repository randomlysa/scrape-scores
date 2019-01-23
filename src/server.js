// content of index.js
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const port = 3000;
const fetch = require('node-fetch');

app.get('/', (request, response) => {
  response.send('Hello -- this is the wrong page!');
});

app.get('/macs', (request, response) => {
  fetch('http://www.mnchristianschools.org/athletics.html')
    .then(res => res.text())
    .then(body => response.end(body));
});

app.listen(port, err => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
});
