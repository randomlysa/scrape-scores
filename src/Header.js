import React from 'react';

const Header = props => {
  let toggleText;
  if (props.displaying === 'boys') {
    toggleText = 'Display Girls';
  }
  if (props.displaying === 'girls') {
    toggleText = 'Display Boys';
  }
  return (
    <React.Fragment>
      <button onClick={props.toggleBG}>{toggleText}</button>
      <button onClick={props.toggleExtraCols}>Toggle Extra Info</button>
    </React.Fragment>
  );
};

export default Header;
