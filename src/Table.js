import React from 'react';

// Import React Table
import ReactTable from 'react-table';
import 'react-table/react-table.css';

const Table = data => {
  return (
    <ReactTable
      showPagination={false}
      data={data.data}
      columns={[
        {
          Header: 'Put Boys/Girls Here?',
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
              accessor: 'scoredAtHome',
              show: false
            },
            {
              Header: 'Away',
              accessor: 'scoredAtAway',
              show: false
            }
          ]
        },
        {
          Header: 'Points Allowed',
          columns: [
            {
              Header: 'at Home',
              accessor: 'homePoints',
              show: false
            },
            {
              Header: 'Away',
              accessor: 'awayPoints',
              show: false
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
