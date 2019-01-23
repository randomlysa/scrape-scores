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
      display: 'boys',
      boys: [],
      girls: []
    };

    this.toggleExtraCols = this.toggleExtraCols.bind(this);
    this.toggleBG = this.toggleBG.bind(this);
  }

  toggleExtraCols() {
    this.setState({ showExtraCols: !this.state.showExtraCols });
  }

  toggleBG() {
    if (this.state.display === 'boys') this.setState({ display: 'girls' });
    else this.setState({ display: 'boys' });
  }

  componentDidMount() {
    const data = getData();
    data.then(d => {
      d.forEach(item => {
        // which is either 'boys' or 'girls'
        const which = Object.keys(item);

        item[which].then(data => {
          // set data to this.state.boys or this.state.girls
          this.setState({ [which[0]]: data });
        });
      });
    });
  }

  render() {
    // data is either for boys or girls
    const data = this.state[this.state.display];

    if (data.length > 0) {
      return (
        <div>
          <Header
            toggleBG={this.toggleBG}
            toggleExtraCols={this.toggleExtraCols}
          />
          <Table data={data} showExtraCols={this.state.showExtraCols} />
        </div>
      );
    } else {
      return 'Loading';
    }
  }
}

render(<App />, document.getElementById('app'));
