import PropTypes from 'prop-types';
import React from 'react'

function Navigation({currentQuestion, numberOfQuestions, answers, isSubmitted, setCurrentQuestion}) {
  return (
    <div className="right-section">
      <div className="question-wrapper">
        <div className="question-number-wrapper">
          <p className='px-[1em] mb-[1rem]'>Question {currentQuestion+1}/{numberOfQuestions}</p>
          <div className="question-number-container">
            {answers.map((answer, index) => {
              const questionNumber = index + 1;
              const hasAnswer = answer.user_answers.length > 0
              const isCorrect = isSubmitted && hasAnswer && answer.is_correct

              return (
                <div className='flex justify-center' key={index}>
                  <button
                    key={index}
                    type="button" // Make sure the button doesn't submit the form
                    className={`question-number-identification 
                      ${!isSubmitted && hasAnswer ? 'has-answer' : 'no-answer'}
                      ${isSubmitted && isCorrect ? 'correct' : isSubmitted ? 'wrong' : ''}
                      ${currentQuestion+1 === questionNumber && 'active'}`
                    }
                    onClick={() => {
                      setCurrentQuestion(questionNumber-1);
                    }}
                  >
                    {questionNumber}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {
          !isSubmitted
          && <div className="save-submit-buttons">
              {/* <button type="button" className="save-button mb-[1rem]" onClick={handleSave}>
                Save Answers
              </button> */}
              <button type="submit" className="submit-button">
                Submit Answers
              </button>
            </div>
        }
      </div>
    </div>
  )
}

Navigation.propTypes = {
  currentQuestion: PropTypes.number.isRequired,
  numberOfQuestions: PropTypes.number.isRequired,
  answers: PropTypes.array.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  setCurrentQuestion: PropTypes.func.isRequired,
}

export default Navigation
