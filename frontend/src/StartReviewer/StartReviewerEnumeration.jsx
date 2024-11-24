import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setAnswers, addUserAnswer, removeLastAnswer, pushAnItem, setCheckedAnswers } from '@redux/answers';
import axios from 'axios';
import { apiRootURL } from '@root/globals'
import PropTypes from 'prop-types';
import Navigator from './Navigator';

const StartReviewerEnumeration = ({question}) => {

  return (
    <form  className="question-container grid grid-2-column-2 gap-[10px]">
      <div>
        <div className="question-box">
          <h2 className="question-title">Question {currentQuestion+1}</h2>
          <p className="question-text">
            {questions[currentQuestion].question}
          </p>
          <div className="answer-container-wrapper">
            <div className="mb-4 flex justify-end gap-[5px]">
              {/* Single "Remove" button to remove the last placeholder */}
              {placeholders.length > 1 && (
                <button type="button" className="remove-placeholder-button" onClick={removeLastPlaceholder}>
                  -
                </button>
              )}
              {/* Button to add more placeholders */}
              <button type="button" className="add-placeholder-button" onClick={addPlaceholder}>
                +
              </button>
            </div>
            <div className="answer-container">
              {placeholders.map((placeholder, index) => {
                const isCorrect = isSubmitted && userAnswer && userAnswer.is_correct == true

                return (
                  <div key={index} className="answer-row mb-[0.5rem]">
                    {
                      !isSubmitted
                      && <input
                        className="answer-box"
                        type='text'
                        placeholder={`Answer ${index + 1}`}
                        value={placeholder}
                        aria-label={`Answer ${index + 1}`} // Accessibility improvement
                        required="required" // Make the textarea required
                        onChange={(e) => handleInputChange(e, index)}
                        onBlur={() => updateUserAnswer(index)}
                      />
                    }
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

StartReviewerEnumeration.propTypes = {
  questions: PropTypes.array.isRequired,
  generateQuestions: PropTypes.func.isRequired,
}

export default StartReviewerEnumeration;
