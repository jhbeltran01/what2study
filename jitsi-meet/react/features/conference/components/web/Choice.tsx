import React, { useState } from 'react';

interface MyComponentProps {
}

const Choice: React.FC<MyComponentProps> = ({}) => {
  return (
    <div className='choice grid grid-2-column align-center'>
      <p className='choice__marker place-center'>A</p>
      <p className='choice__text'>Facilitating communication between different software components</p>
    </div>
  );
};

export default Choice;