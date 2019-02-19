module.exports = {
  getData: function(data) {
    // start alasql
    const alasql = require('alasql');
    new alasql.Database('games');
    //  ('CREATE TABLE boys (team string, date string, homeAway string, wL string, homeScore number, awayScore number, opponent string)');
    alasql(
      'CREATE TABLE if not exists boys (gameid INT AUTO_INCREMENT, team string, date string, homeAway string, w number, l number, homeScore number, awayScore number, opponent string)'
    );
    alasql(
      'CREATE TABLE if not exists girls (gameid INT AUTO_INCREMENT, team string, date string, homeAway string, w number, l number, homeScore number, awayScore number, opponent string)'
    );
    // end alasql

    // Current team.
    let currentTeam = [];
    let currentRow = 0; // <tr>
    let currentTh = 0; // <th>

    let rowData = [];
    let error = 0;

    // Push rows that cause error here.
    let errorRows = [];

    data.split('\n').forEach((line, index) => {
      // https://stackoverflow.com/a/5002161/3996097
      const newLine = line.replace(/<\/?[^>]+(>|$)/g, '');

      if (line.includes('<tr')) {
        // Rows with 7 items:
        // want rowData[2] = boys team
        // want rowData[6] = girls team team
        if (rowData.length === 7) {
          currentTeam['boys'] = rowData[2]
            .toLowerCase()
            .split(' ')
            .map(n => n.slice(0, 1).toUpperCase() + n.slice(1))
            .join(' ');

          if (currentTeam['boys']) {
            const team = currentTeam['boys'];
            alasql(
              `INSERT INTO boys VALUES ('', '${team}', '', 'H', '0', '0', '0', '0', '')`
            );
            alasql(
              `INSERT INTO boys VALUES ('', '${team}', '', 'A', '0', '0', '0', '0', '')`
            );
          }

          currentTeam['girls'] = rowData[6]
            .toLowerCase()
            .toLowerCase()
            .split(' ')
            .map(n => n.slice(0, 1).toUpperCase() + n.slice(1))
            .join(' ');

          if (currentTeam['girls']) {
            const team = currentTeam['girls'];
            alasql(
              `INSERT INTO girls VALUES ('', '${team}', '', 'H', '0', '0', '0', '0', '')`
            );
            alasql(
              `INSERT INTO girls VALUES ('', '${team}', '', 'A', '0', '0', '0', '0', '')`
            );
          }
        }

        // There is a row with length of 9 that is something like the nav menu - ignore it.
        if (rowData.length === 9 && rowData[0] !== 'HOME') {
          ['boys', 'girls'].forEach(j => {
            let finalRowData;
            if (j === 'boys') finalRowData = rowData.slice(0, 4);
            if (j === 'girls') finalRowData = rowData.slice(5, 9);

            if (!finalRowData[0].includes('&nbsp;')) {
              let opponentFinal;
              let opponent = finalRowData[3];
              if (opponent[0] === '@') opponentFinal = opponent.slice(1);
              if (opponent[0] === 'v') opponentFinal = opponent.slice(4);

              // finalRowData[2] usually is "W 44-22 or L 15-30"
              // for there to be a score, there pretty much has to be a '-'
              if (finalRowData[2].includes('-')) {
                let team = currentTeam[j];
                let date = finalRowData[0];
                let homeAway = finalRowData[1];

                let w = finalRowData[2].includes('W') ? 1 : 0;
                let l = finalRowData[2].includes('L') ? 1 : 0;

                // Remove letters (W/L), keep only numbers (score)
                // https://stackoverflow.com/a/1862219/3996097
                let homeScore = finalRowData[2]
                  .split('-')[0]
                  .replace(/\D/g, '');
                let awayScore = finalRowData[2]
                  .split('-')[1]
                  .replace(/\D/g, '');

                opponent = opponentFinal;

                alasql(`
                    INSERT INTO ${j} VALUES ('', '${team}', '${date}', '${homeAway}', ${w}, ${l}, ${homeScore}, ${awayScore}, '${opponent}')
                  `);

                // `INSERT INTO boys VALUES ('${team}', ${date}, ${homeAway}, ${wL}, ${homeScore}, ${awayScore}, ${opponent})`
              } else {
                error++;
                // Log rows that don't fit. Use to check if the wrong rows are getting skipped.
                errorRows.push(finalRowData);
              }
            }
          });
        }

        rowData = [];
        currentRow++;
        currentTh = 0;
      }

      // Each tr has 9 th. th 1-4 = boys, th 6-9 = girls;
      // th:
      // 0 - date
      // 1 - home / away (H || A)
      // 2 - W/L Score (L 46-49)
      // 3 - opponent ( vs. ABC)
      // 4 - EMPTY (&nbsp;)
      //

      if (line.includes('<th') || line.includes('<td')) {
        rowData.push(newLine.trim());
      }
    }); // data.split.forEach

    // 'CREATE TABLE boys (team , date , homeAway , wL , homeScore , awayScore , opponent )'
    return ['boys', 'girls'].map(j => {
      const gamesForStreak = alasql(
        `SELECT gameid, team, w, l from ${j} ORDER BY gameid DESC`
      );
      const streakData = [];
      let currentTeam = '';
      let streakType = '';
      let streakLength = 1;
      let streakOver = false;

      gamesForStreak.forEach(game => {
        // Change teams and determine streak type.
        if (game.team !== currentTeam) {
          streakOver = false;
          currentTeam = game.team;
          if (game.w === 1) {
            streakType = 'W';
          } else if (game.l === 1) {
            streakType = 'L';
          }

          // Determine if streak is over or continues
        } else {
          if (streakOver === false && streakType === 'W' && game.w === 1) {
            streakLength++;
          }
          if (streakOver === false && streakType === 'W' && game.w === 0) {
            streakOver = true;
            streakData.push({
              team: currentTeam,
              streakType: streakType,
              streakLength: streakLength
            });
            streakLength = 1;
          }
          if (streakOver === false && streakType === 'L' && game.l === 1) {
            streakLength++;
          }
          if (streakOver === false && streakType === 'L' && game.l === 0) {
            streakOver = true;
            streakData.push({
              team: currentTeam,
              streakType: streakType,
              streakLength: streakLength
            });
            streakLength = 1;
          }
        }
      });

      // DB
      // ADVANCED W/L - filter out teams with no wins or losses.
      // This happens because I added dummy data for each team.
      // That was (seemed) necessary because some teams had no home games and
      // when I tried to join those results, it didn't work. Their W/L showed up, but
      // everything afterward was empty. If I switched to join away items before
      // home items, that seemed to fix things, but this seems like a better fix.

      // Example: Foundation Boys had no home games.
      // The only data that showed up was Team and record. Everything else in
      // their row was empty, even though they have played 3 away games and
      // hae scored and allowed points.

      // Won Loss Total
      const resultsWLT = alasql(
        `SELECT team, SUM(w) as wins, SUM(l) as losses, SUM(w + l) as total FROM ${j} GROUP BY team HAVING SUM(w) > 0 OR SUM(l) > 0`
      );

      // '(team , date , homeAway , w number, l , homeScore , awayScore , opponent )'
      // Points allowed home, away
      const pointsAllowedHomePointsAllowedAway = alasql(
        `WITH
        pointsAllowedHome AS (
          SELECT team, SUM(awayScore) as pointsAllowedHome FROM ${j} WHERE homeAway = "H" GROUP BY team
        ),
        pointsAllowedAway AS (
          SELECT team, SUM(awayScore) as pointsAllowedAway FROM ${j} WHERE homeAway = "A" GROUP BY team
        )
        SELECT *
        FROM pointsAllowedHome
        JOIN  pointsAllowedAway
        USING team
        `
      );

      // Calculate home and away records
      const homeAwayRecords = alasql(
        `WITH
        homeWins AS (
          SELECT team, SUM(w) as homeWins FROM ${j} WHERE homeAway = "H" GROUP BY team
        ),
        homeLosses AS (
          SELECT team, SUM(l) as homeLosses FROM ${j} WHERE homeAway = "H" GROUP BY team
        ),
        awayWins AS (
          SELECT team, SUM(w) as awayWins FROM ${j} WHERE homeAway = "A" GROUP BY team
        ),
        awayLosses AS (
          SELECT team, SUM(l) as awayLosses FROM ${j} WHERE homeAway = "A" GROUP BY team
        )
        SELECT *
        FROM homeWins
        JOIN  homeLosses
        USING team
        JOIN awayWins
        USING team
        JOIN awayLosses
        USING team
        `
      );

      // Calc points scored by a team when playing at home vs when playing away
      const scoredAtHomescoredAway = alasql(
        `WITH
        scoredAtHome AS (
          SELECT team, SUM(homeScore) as scoredAtHome FROM ${j} WHERE homeAway = "H" GROUP BY team
        ),
        scoredAtAway AS (
          SELECT team, SUM(homeScore) as scoredAtAway FROM ${j} WHERE homeAway = "A" GROUP BY team
        )
        SELECT *
        FROM scoredAtHome
        JOIN  scoredAtAway
        USING team
        `
      );

      const p = new Promise((resolve, reject) => {
        const results = alasql(
          `SELECT *, wins/total as pct FROM ? resultsWLT
            LEFT JOIN ? pointsAllowedHomePointsAllowedAway USING team
            LEFT JOIN ? homeAwayRecords USING team
            LEFT JOIN ? scoredAtHomescoredAway USING team
            LEFT JOIN ? streakData USING team
            ORDER BY resultsWLT.pct DESC
            `,
          [
            resultsWLT,
            pointsAllowedHomePointsAllowedAway,
            homeAwayRecords,
            scoredAtHomescoredAway,
            streakData
          ]
        );

        resolve(results);
      });
      return { [j]: p };
    }); // ['boys', 'girls'].map
  }
};