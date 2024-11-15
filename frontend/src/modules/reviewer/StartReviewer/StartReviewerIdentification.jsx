import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAnswers, addUserAnswer, setCheckedAnswers } from '@redux/answers'
import axios from 'axios';
import { apiRootURL } from '@root/globals'

const StartReviewerIdentification = ({questions, generateQuestions}) => {
  const numberOfQuestions = questions.length
  const reviewer = useSelector(state => state.reviewer.value)
  const answers = useSelector(state => state.answers.value)
  const [answerText, setAnswerText] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false)
  const dispatch = useDispatch()


  useEffect(() => {
    if (questions.length == 0) { return }

    dispatch(setAnswers({
      questions: questions,
      reviewerSlug: reviewer.slug,
    }))
  }, [questions])

  useEffect(() => {
    if (answers.answers[currentQuestion].user_answers.length == 0) { 
      setAnswerText('')
      return 
    }

    setAnswerText(answers.answers[currentQuestion].user_answers[0].answer)
  }, [currentQuestion])

  const handleInputChange = (e) => {
    setAnswerText(e.target.value); // Set the current typed answer
  };

  const handleNext = () => {
    if (currentQuestion+1 < numberOfQuestions) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion+1 > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // const handleSave = (e) => {
  //   e.preventDefault();
  //   alert('Answers saved!');
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(answers)
    axios 
      .post(
        `${apiRootURL}/questions/check-answer/`,
        answers
      )
      .then(response => {
        const tempCheckedAnswers = {...response.data}
        
        tempCheckedAnswers['answers'] = tempCheckedAnswers.checked_answers
        delete tempCheckedAnswers['checked_answers']
        dispatch(setCheckedAnswers(tempCheckedAnswers))
        setIsSubmitted(true)
      })
      .catch(err => {
        console.log(err)
      })
  };

  const updateUserAnswer = () => {
    dispatch(addUserAnswer({
      questionIndex: currentQuestion,
      answerIndex: 1,
      text: answerText,
      answers: answers
    }))
  }

  const generateNewQuestions = () => {
    setIsSubmitted(false)
    generateQuestions()
    setAnswerText('')
    setCurrentQuestion(0)
  }

  const displaySubmittedAnswer = isSubmitted && answers.answers[currentQuestion].user_answers.length > 0
  const isCorrect = displaySubmittedAnswer && answers.answers[currentQuestion].user_answers[0].is_correct


  return (
    <form onSubmit={handleSubmit} className="question-container grid grid-2-column-2 gap-[10px]">
      <div>
        <div className="question-box">
          <h2 className="question-title">Question {currentQuestion+1}</h2>
          <p className="question-text">
            {questions[currentQuestion] && questions[currentQuestion].question}
          </p>
          <div className="answer-container-wrapper">
            {
              !isSubmitted 
              && <div className="answer-container">
                  {/* Gray box where the user types the answer */}
                  <input
                    className="answer-box"
                    placeholder="Type your answer here..."
                    value={answerText}
                    onChange={handleInputChange}
                    type='text'
                    onBlur={updateUserAnswer}
                    required // Make the textarea required
                  />
                </div>
            }
            {
              displaySubmittedAnswer
              && <div className={`user-answer ${isCorrect ? 'correct' : 'wrong'}`}>
                  {answers.answers[currentQuestion].user_answers[0].answer}
                </div>
            }
            {
              !displaySubmittedAnswer && isSubmitted
              && <div className='user-answer wrong'>
                  No submitted answer
                </div>
            }
          </div>
        </div>

        {/* Navigation buttons moved below the question box */}
        <div className="navigation-buttons">
          <button type="button" className="prev-button" onClick={handlePrevious}>
            Previous
          </button>
          <button type="button" className="next-button" onClick={handleNext}>
            Next
          </button>
        </div>

        {
          isSubmitted
          && <div className='max-w-[300px] mx-auto mt-[1.5rem]'>
              <button
                  className='submit-button'
                  onClick={generateNewQuestions}
                >
                  Generate New Questions
                </button>
          </div>
          }
      </div>

      <div className="right-section">
        <div className="question-wrapper flex flex-col justify-between h-[100%]">
          <div className="question-number-wrapper">
            <p className='px-[1em] mb-[1rem]'>Question {currentQuestion+1}/{numberOfQuestions}</p>
            <div className="question-number-container">
              {answers.answers.map((answer, index) => {
                const questionNumber = index + 1;
                const hasAnswer = answer.user_answers.length > 0
                const isCorrect = isSubmitted && hasAnswer && answer.user_answers[0].is_correct

                return (
                  <div className='flex justify-center' key={index}>
                    <button
                      key={index}
                      type="button" // Make sure the button doesn't submit the form
                      className={`question-number-identification 
                        ${!isSubmitted && currentQuestion+1 === questionNumber && 'active'} 
                        ${!isSubmitted && hasAnswer ? 'has-answer' : 'no-answer'}
                        ${isSubmitted && isCorrect ? 'correct' : isSubmitted ? 'wrong' : ''}`
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
    </form>
  );
};

StartReviewerIdentification.propTypes = {
  questions: PropTypes.array.isRequired,
  generateQuestions: PropTypes.func.isRequired,
}

export default StartReviewerIdentification;
