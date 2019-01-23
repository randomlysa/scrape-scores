import React from 'react';

// Import React Table
import ReactTable from 'react-table';
import 'react-table/react-table.css';

const Table = props => {
  return (
    <ReactTable
      showPagination={false}
      data={props.data}
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
          Header: 'Home Record',
          columns: [
            {
              Header: 'Wins',
              accessor: 'homeWins'
            },
            {
              Header: 'Losses',
              accessor: 'homeLosses'
            }
          ]
        },
        {
          Header: 'Away Record',
          columns: [
            {
              Header: 'Wins',
              accessor: 'awayWins'
            },
            {
              Header: 'Losses',
              accessor: 'awayLosses'
            }
          ]
        },
        {
          Header: 'Points Scored',

          columns: [
            {
              Header: 'at Home',
              accessor: 'scoredAtHome',
              show: props.showExtraCols
            },
            {
              Header: 'Away',
              accessor: 'scoredAtAway',
              show: props.showExtraCols
            }
          ]
        },
        {
          Header: 'Points Allowed',
          columns: [
            {
              Header: 'at Home',
              accessor: 'homePoints',
              show: props.showExtraCols
            },
            {
              Header: 'Away',
              accessor: 'awayPoints',
              show: props.showExtraCols
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
