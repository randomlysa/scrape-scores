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
              accessor: 'team',
              Cell: props => (
                <span>
                  {props.original.team
                    .split(' ')
                    .slice(0, -1)
                    .join(' ')}
                </span>
              )
            }
          ]
        },
        {
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
          columns: [
            {
              Header: 'Home',
              accessor: 'homeWins',
              Cell: props => (
                <span>
                  {props.original.homeWins} - {props.original.homeLosses}
                </span>
              )
            }
          ]
        },

        {
          Header: 'Away',
          accessor: 'homeWins',
          Cell: props => (
            <span>
              {props.original.awayWins} - {props.original.awayLosses}
            </span>
          )
        },
        {
          columns: [
            {
              Header: 'PPG',
              accessor: 'scoredAtHome',
              Cell: props => (
                <span>
                  {Math.round(
                    (parseInt(props.original.scoredAtHome) +
                      parseInt(props.original.scoredAtAway)) /
                      (props.original.wins + props.original.losses)
                  )}
                </span>
              ),
              width: 85
            },
            {
              Header: 'OPP PPG',
              accessor: 'pointsAllowedHome',
              Cell: props => (
                <span>
                  {Math.round(
                    (parseInt(props.original.pointsAllowedHome) +
                      parseInt(props.original.pointsAllowedAway)) /
                      (props.original.wins + props.original.losses)
                  )}
                </span>
              ),
              width: 85
            },
            {
              Header: 'Streak',
              accessor: 'streakLength',
              Cell: props => (
                <span>
                  {props.original.streakType} {props.original.streakLength}
                </span>
              ),
              width: 85
            }
          ]
        },
        {
          Header: 'Points Scored',

          columns: [
            {
              Header: 'Home',
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
              Header: 'Home',
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
