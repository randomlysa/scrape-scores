import React from 'react';
import { render } from 'react-dom';

// Import React Table
import ReactTable from 'react-table';
import 'react-table/react-table.css';

// Get and parse data
import getData from './getData';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    const data = getData();
    data.then(d => {
      d.forEach(item => {
        item.then(y => {
          this.setState({ data: y });
        });
      });
    });
  }
  render() {
    const { data } = this.state;
    return (
      <div>
        <ReactTable
          data={data}
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
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
