import React, { useState } from 'react';
import MultipleChoiceQuestion from './MultipleChoiceQuestion'

interface MyComponentProps {
}

const Question: React.FC<MyComponentProps> = ({}) => {
  return (
    <div className='question place-center'>
      <div className='question__content'>
        <MultipleChoiceQuestion />
      </div>
    </div>
  );
};

export default Question;