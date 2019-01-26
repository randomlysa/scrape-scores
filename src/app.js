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
      girls: [],
      updateAvailable: false
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

  updateData() {
    const data = getData();
    data.then(d => {
      d.forEach(item => {
        // which is either 'boys' or 'girls'
        const which = Object.keys(item);

        item[which].then(data => {
          // set data to this.state.boys or this.state.girls
          this.setState({ [which[0]]: data });

          localStorage.setItem(
            'macs_scores',
            JSON.stringify({ timeStamp: Date.now(), ...this.state })
          );
        });
      });
    });
  }

  componentDidMount() {
    // If no localstorage data exists
    //  show loading and get data.
    //  once data is received, save to state and localstorage.

    // If localstorage exists
    //  load and display data from storage
    //  request update
    //  compare update to storage (just data, not view)
    //  if different, show 'update available, click to update'
    //    on click to update, update state and storage

    const localData = localStorage.getItem('macs_scores');

    // LocalStorage data exists.
    if (localData) {
      const { boys, girls, timeStamp } = JSON.parse(localData);
      this.setState({ boys, girls });
      if (Date.now() - timeStamp > 3600000) {
        // Local data older than an hour, get update.
        this.updateData();
      }
    } else {
      // LocalStorage data doesn't exist.
      this.updateData();
    }
  }

  render() {
    // data is either for boys or girls
    const data = this.state[this.state.display];

    if (data.length > 0) {
      return (
        <div>
          <Header
            displaying={this.state.display}
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
