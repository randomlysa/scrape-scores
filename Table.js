import React from 'react';

// Import React Table
import ReactTable from 'react-table';
import 'react-table/react-table.css';

const Table = data => {
  return (
    <ReactTable
      data={data.data}
      columns={[
        {
          columns: [
            {
              Header: 'Team',
              accessor: 'team'
            }
          ]
        },
        {
          Header: 'Record',
          columns: [
            {
              Header: 'Wins',
              accessor: 'wins'
            },
            {
              Header: 'Losses',
              accessor: 'losses'
            }
          ]
        },
        {
          Header: 'Points Scored',
          columns: [
            {
              Header: 'at Home',
              accessor: 'scoredAtHome'
            },
            {
              Header: 'Away',
              accessor: 'scoredAtAway'
            }
          ]
        },
        {
          Header: 'Points Allowed',
          columns: [
            {
              Header: 'at Home',
              accessor: 'homePoints'
            },
            {
              Header: 'away',
              accessor: 'awayPoints'
            }
          ]
        }
      ]}
      defaultPageSize={10}
      className="-striped -highlight"
    />
  );
};

export default Table;
