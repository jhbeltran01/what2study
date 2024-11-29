import axios from 'axios';
import React from 'react';
import { apiRootURL } from '@root/globals';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

function ResetQuestions({ generateQuestions }) {
  const reviewer = useSelector(state => state.reviewer.value);

  const resetQuestions = () => {
    axios
      .post(`${apiRootURL}/questions/reset/${reviewer.slug}/`)
      .then(response => {
        generateQuestions();
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div className="quiz-reset-container">
      <div className="quiz-reset-content">
        <div className="quiz-reset-text">
          <p className="congratulations">Congratulations!</p>
          <p>
            You've answered all the questions correctly—great job! Your hard work and knowledge truly shine.
          </p>
          <p>
            Would you like to challenge yourself and take the quiz again to see if you can beat your previous performance? Let's go!
          </p>
        </div>
      </div>
      <button className="quiz-reset-button" onClick={resetQuestions}>
        Reset
      </button>
    </div>
  );
}

ResetQuestions.propTypes = {
  generateQuestions: PropTypes.func.isRequired,
};

export default ResetQuestions;
