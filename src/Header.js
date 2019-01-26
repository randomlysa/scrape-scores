import React from 'react';
import styled from '@emotion/styled';

const Button = styled.button`
  background: #ead2ac;
  border: none;
  padding: 10px;
  margin-right: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  :hover {
    background: #9cafb7;
  }
`;

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
      <Button onClick={props.toggleBG}>{toggleText}</Button>
      <Button onClick={props.toggleExtraCols}>Toggle Extra Info</Button>
    </React.Fragment>
  );
};

export default Header;
