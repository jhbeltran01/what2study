import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setAnswers, addUserAnswer, removeLastAnswer, pushAnItem, setCheckedAnswers } from '@redux/answers';
import axios from 'axios';
import { apiRootURL } from '@root/globals'
import PropTypes from 'prop-types';
import Navigator from './Navigator';

const StartReviewerEnumeration = ({questions, generateQuestions}) => {
  const answers = useSelector(state => state.answers.value)
  const reviewer = useSelector(state => state.reviewer.value)
  const numberOfQuestions = questions.length
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [placeholders, setPlaceholders] = useState(['']);
  const [isSubmitted, setIsSubmitted] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (questions.length == 0) { return }

    dispatch(setAnswers({
      questions: questions,
      reviewerSlug: reviewer.slug,
    }))

    return () => {
      setPlaceholders([''])
    }
  }, [questions])

  useEffect(() => {
    if (!answers.answers || answers.answers[currentQuestion].user_answers.length == 0) { 
      setPlaceholders([''])
      return 
    }

    setPlaceholders(getFilledAnswers())
  }, [currentQuestion])

  const getFilledAnswers = () => {
    return answers.answers[currentQuestion].user_answers.map(answer => answer.answer)
  }

  // Handle changes in answer fields
  const handleInputChange = (e, index) => {
    const updatedPlaceholders = [...placeholders];
    updatedPlaceholders[index] = e.target.value;
    setPlaceholders(updatedPlaceholders);
  };

  // Add another placeholder for additional answer input
  const addPlaceholder = () => {
    setPlaceholders([...placeholders, '']);
    dispatch(pushAnItem({questionIndex: currentQuestion}))
  };

  // Remove the last placeholder
  const removeLastPlaceholder = () => {
    if (placeholders.length > 1) {
      const updatedPlaceholders = placeholders.slice(0, -1);
      setPlaceholders(updatedPlaceholders); // remove the last placeholder
      dispatch(removeLastAnswer({questionIndex: currentQuestion}))
    }
  };

  const handleNext = () => {
    if (currentQuestion+1 < numberOfQuestions) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion >= 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const updateUserAnswer = (index) => {
    dispatch(addUserAnswer({
      questionIndex: currentQuestion,
      answerIndex: index,
      text: placeholders[index],
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        `${apiRootURL}/questions/check-answer/`,
        answers
      )
      .then(response => {
        getFilledAnswers()
        const tempCheckedAnswers = {...response.data}
        
        tempCheckedAnswers['answers'] = tempCheckedAnswers.checked_answers
        delete tempCheckedAnswers['checked_answers']
        
        dispatch(setCheckedAnswers(tempCheckedAnswers))
        setIsSubmitted(true)
        setCurrentQuestion(0)
      })
      .catch(err => {
        console.log(err)
      })
  };

  const generateNewQuestions = () => {
    setIsSubmitted(false)
    generateQuestions()
    setCurrentQuestion(0)
    dispatch(setCheckedAnswers({}))
  }

  return (
    <form onSubmit={handleSubmit} className="question-container grid grid-2-column-2 gap-[10px]">
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
              {answers.answers != undefined && placeholders.map((placeholder, index) => {
                const userAnswer = answers.answers[currentQuestion].user_answers[index]
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

                    {
                      isSubmitted
                      && <div className={`user-answer ${isCorrect ? 'correct' : 'wrong'}`}>
                          {userAnswer ? userAnswer.answer : 'No submitted answer'}
                        </div>
                    }
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <Navigator 
          handlePrevious={handlePrevious}
          handleNext={handleNext}
          generateNewQuestions={generateNewQuestions}
          isSubmitted={isSubmitted}
        />
      </div>

      <Navigation 
        currentQuestion={currentQuestion}
        numberOfQuestions={numberOfQuestions}
        answers={answers.answers ? answers.answers : []} 
        isSubmitted={isSubmitted}
        setCurrentQuestion={setCurrentQuestion}
      />
    </form>
  );
};

StartReviewerEnumeration.propTypes = {
  questions: PropTypes.array.isRequired,
  generateQuestions: PropTypes.func.isRequired,
}

export default StartReviewerEnumeration;
