'use strict';

const cors = require('cors');
const NodeCache = require('node-cache');
const fetch = require('node-fetch');
const express = require('express');

const getData = require('./server-getData');

// Store data in cache for 24 hours (86400 seconds). After that, delete, and
// it will be re-fetched.
const myCache = new NodeCache({ stdTTL: 86400, checkperiod: 120 });

require('greenlock-express')
  .create({
    // Let's Encrypt v2 is ACME draft 11
    version: 'draft-11',

    server: 'https://acme-v02.api.letsencrypt.org/directory',
    // Note: If at first you don't succeed, stop and switch to staging
    // https://acme-staging-v02.api.letsencrypt.org/directory

    // You MUST change this to a valid email address
    email: 'valid_email@example.com',

    // You MUST NOT build clients that accept the ToS without asking the user
    agreeTos: true,

    // You MUST change these to valid domains
    // NOTE: all domains will validated and listed on the certificate
    approvedDomains: ['example.com', 'www.example.com'],

    // You MUST have access to write to directory where certs are saved
    // ex: /home/foouser/acme/etc
    configDir: '~/config/',

    app: require('express')().use('/', cors(), function(req, res) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      const cacheData = myCache.get('macs_data');
      if (cacheData) {
        console.log('has cache');
        return res.send(cacheData);
      } else {
        console.log('no can has cache');
      }

      fetch('http://www.mnchristianschools.org/athletics.html')
        .then(res => res.text())
        .then(body => {
          console.log('in fetch');
          const waitData = async rData => {
            return await getData.getData(rData);
          };

          waitData(body).then(d => {
            Promise.all([d[0].boys, d[1].girls]).then(final => {
              // Save 'final' to cache.
              myCache.set('macs_data', final, (err, success) => {
                if (err) console.log('Error: ', err);
                if (success) console.log('Success: ', success);
              });
              // Send reponse - final.
              // final[0] = boys, final[1] = girls
              res.send(final);
            });
          });
        });
    }),

    // Get notified of important updates and help me make greenlock better
    communityMember: true

    //, debug: true
  })
  .listen(80, 443);
