import React from 'react';

const Header = props => {
  return (
    <React.Fragment>
      <button onClick={props.toggleBG}>Toggle Boys/Girls</button>
      <button onClick={props.toggleExtraCols}>Toggle Extra Info</button>
    </React.Fragment>
  );
};

export default Header;
