# Scrape Scores

Cleverly named project to scrape scores off a website and convert to a traditionally used 'standings' table with sorting by win %, record, W/L, Home/Away Record, PPG, OPP PPG, win streak, and home/away total points scored.

Uses in memory JS SQL (AlaSQL), a cached node server, and caching on localhost for faster reloading.

Can probably be seen at http://code.randomlysa.com/scrape-scores/ assuming the original page still exists with data.

Updates:

- node/express/green-lock for https
- moved alasql to server to save ~ 400kb (~600kb to 206kb)
- calculate game hash to check if game has been saved to db already
- calculated win % to sort by, instead of by wins (oops)
