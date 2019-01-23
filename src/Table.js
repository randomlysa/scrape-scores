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
              accessor: 'wins',
              width: 65
            },
            {
              Header: 'Losses',
              accessor: 'losses',
              width: 65
            }
          ]
        },
        {
          Header: 'Home Record',
          columns: [
            {
              Header: 'Wins',
              accessor: 'homeWins',
              show: props.showExtraCols,
              width: 65
            },
            {
              Header: 'Losses',
              accessor: 'homeLosses',
              show: props.showExtraCols,
              width: 65
            }
          ]
        },
        {
          Header: 'Away Record',
          columns: [
            {
              Header: 'Wins',
              accessor: 'awayWins',
              show: props.showExtraCols,
              width: 65
            },
            {
              Header: 'Losses',
              accessor: 'awayLosses',
              show: props.showExtraCols,
              width: 65
            }
          ]
        },
        {
          Header: 'Points Scored',

          columns: [
            {
              Header: 'at Home',
              accessor: 'scoredAtHome',
              show: props.showExtraCols,
              width: 85
            },
            {
              Header: 'Away',
              accessor: 'scoredAtAway',
              show: props.showExtraCols,
              width: 85
            }
          ]
        },
        {
          Header: 'Points Allowed',
          columns: [
            {
              Header: 'at Home',
              accessor: 'pointsAllowedHome',
              show: props.showExtraCols,
              width: 85
            },
            {
              Header: 'Away',
              accessor: 'pointsAllowedAway',
              show: props.showExtraCols,
              width: 85
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
