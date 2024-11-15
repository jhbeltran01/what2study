import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAnswers, addUserAnswer, setCheckedAnswers } from '@redux/answers'
import axios from 'axios';
import { apiRootURL } from '@root/globals'
import Navigation from './Navigation';
import Navigator from './Navigator';

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
    if (!answers.answers || answers.answers[currentQuestion].user_answers.length == 0) { 
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

  const handleSubmit = (e) => {
    e.preventDefault();

    axios 
      .post(
        `${apiRootURL}/questions/check-answer/`,
        answers
      )
      .then(response => {
        setAnswerText('')
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

  const updateUserAnswer = () => {
    dispatch(addUserAnswer({
      questionIndex: currentQuestion,
      answerIndex: 1,
      text: answerText,
    }))
  }

  const generateNewQuestions = () => {
    setIsSubmitted(false)
    generateQuestions()
    setCurrentQuestion(0)
    dispatch(setCheckedAnswers({}))
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

StartReviewerIdentification.propTypes = {
  questions: PropTypes.array.isRequired,
  generateQuestions: PropTypes.func.isRequired,
}

export default StartReviewerIdentification;
