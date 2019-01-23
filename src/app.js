import React from 'react';
import { render } from 'react-dom';

// Get and parse data
import getData from './getData';
import Header from './Header';
import Table from './Table';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      showExtraCols: false,
      data: []
    };

    this.toggleExtraCols = this.toggleExtraCols.bind(this);
  }

  toggleExtraCols() {
    this.setState({ showExtraCols: !this.state.showExtraCols });
  }

  componentDidMount() {
    const data = getData();
    data.then(d => {
      d.forEach(item => {
        const which = Object.keys(item);
        item[which].then(data => {
          this.setState({ data });
        });
      });
    });
  }

  render() {
    const { data } = this.state;
    if (data.length > 0) {
      return (
        <div>
          <Header toggleExtraCols={this.toggleExtraCols} />
          <Table data={data} showExtraCols={this.state.showExtraCols} />
        </div>
      );
    } else {
      return 'Loading';
    }
  }
}

render(<App />, document.getElementById('app'));
