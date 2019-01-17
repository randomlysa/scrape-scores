fetch('http://localhost:3000/macs')
  .then(things => things.text())
  .then(data => {
    // start alasql
    const alasql = require('alasql');
    new alasql.Database('games');
    //   'CREATE TABLE boys (team string, date string, homeAway string, wL string, homeScore number, awayScore number, opponent string)'
    alasql(
      'CREATE TABLE boys (team string, date string, homeAway string, w number, l number, homeScore number, awayScore number, opponent string)'
    );
    alasql(
      'CREATE TABLE girls (team string, date string, homeAway string, w number, l number, homeScore number, awayScore number, opponent string)'
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

          currentTeam['girls'] = rowData[6]
            .toLowerCase()
            .toLowerCase()
            .split(' ')
            .map(n => n.slice(0, 1).toUpperCase() + n.slice(1))
            .join(' ');
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

              if (finalRowData[2].includes('-')) {
                let team = currentTeam[j];
                let date = finalRowData[0];
                let homeAway = finalRowData[1];
                let w = finalRowData[2].split(' ')[0] === 'W' ? 1 : 0;
                let l = finalRowData[2].split(' ')[0] === 'L' ? 1 : 0;
                let homeScore = finalRowData[2].split(' ')[1].split('-')[0];
                let awayScore = finalRowData[2].split(' ')[1].split('-')[1];
                let opponent = opponentFinal;
                // `INSERT INTO boys VALUES ('${team}', ${date}, ${homeAway}, ${wL}, ${homeScore}, ${awayScore}, ${opponent})`
                alasql(`
            INSERT INTO ${j} VALUES ('${team}', '${date}', '${homeAway}', ${w}, ${l}, ${homeScore}, ${awayScore}, '${opponent}')
          `);
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
    });

    // 'CREATE TABLE boys (team , date , homeAway , wL , homeScore , awayScore , opponent )'
    ['boys', 'girls'].forEach(j => {
      // DB
      const query = `SELECT team, SUM(w) as wins, SUM(l) as losses FROM ${j} GROUP BY team ORDER BY wins DESC`;
      const results = alasql(query);

      // Select element
      const selector = '#' + j;
      const tableElement = document.querySelector(selector);

      // Create and insert HTML using DB results.
      results.forEach(line => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
    <td>${line.team}</td>
    <td>${line.wins}</td>
    <td>${line.losses}</td>`;

        tableElement.appendChild(tr);
      });
    });

    // maybe later, work on above first.
    return;
    const res3 = alasql(
      'SELECT team, SUM(homeScore) as pointsAtHome FROM boys WHERE homeAway = "H" GROUP BY team ORDER BY pointsAtHome DESC'
    );
    console.table(res3);

    const res4 = alasql(
      'SELECT team, SUM(awayScore) as pointsAway FROM boys WHERE homeAway = "A" GROUP BY team ORDER BY pointsAway DESC'
    );
    console.table(res4);

    const res5 = alasql(
      'SELECT team, SUM(w) as homeWins FROM boys WHERE homeAway = "H" and w = 1 GROUP BY team ORDER BY homeWins DESC'
    );
    console.table(res5);

    const res6 = alasql(
      'SELECT team, SUM(w) as awayWins FROM boys WHERE homeAway = "A" and w = 1 GROUP BY team ORDER BY awayWins DESC'
    );
    console.table(res6);

    const res7 = alasql(
      'SELECT team, SUM(w) as awayWins FROM boys WHERE homeAway = "A" and w = 1 GROUP BY team ORDER BY awayWins DESC'
    );
    console.table(res7);
  }); // fetch.then.then whee
