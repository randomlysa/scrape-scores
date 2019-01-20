import React from 'react';
import { render } from 'react-dom';

// Get and parse data
import getData from './getData';
import Table from './Table';

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
    if (data.length > 0) {
      return (
        <div>
          <Table data={data} />
        </div>
      );
    } else {
      return 'Loading';
    }
  }
}

render(<App />, document.getElementById('app'));
