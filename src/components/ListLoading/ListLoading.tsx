import React from 'react';
import './ListLoading.scss';

const Block = () => (
  <div className="list-loading__block-container">
    <div />
    <div />
    <div />
    <div />
  </div>
);
const ListLoading = () => {
  return (
    <div className="list-loading">
      <Block />
      <Block />
    </div>
  );
};

export default ListLoading;
