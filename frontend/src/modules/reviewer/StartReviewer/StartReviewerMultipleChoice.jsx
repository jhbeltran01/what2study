import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { setCheckedAnswers, addUserAnswer, setAnswers } from '@redux/answers'
import Navigator from './Navigator';
import axios from 'axios';
import { apiRootURL } from '@root/globals'

const StartReviewerMultipleChoice = ({questions, generateQuestions}) => {
  const numberOfQuestions = questions.length
  const reviewer = useSelector(state => state.reviewer.value)
  const answers = useSelector(state => state.answers.value)
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

  const handleOptionSelect = (text, correctAnswer) => {
    dispatch(addUserAnswer({
      questionIndex: currentQuestion,
      answerIndex: 0,
      text: text,
      correctAnswer: correctAnswer,
    }))
  };

  const handleNext = () => {
    if (currentQuestion < 10) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const generateNewQuestions = () => {
    setIsSubmitted(false)
    generateQuestions()
    setCurrentQuestion(0)
    dispatch(setCheckedAnswers({}))
  }

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
        console.log(tempCheckedAnswers)
        dispatch(setCheckedAnswers(tempCheckedAnswers))
        setIsSubmitted(true)
        setCurrentQuestion(0)
      })
      .catch(err => {
        console.log(err)
      })
  };

  const question = questions[currentQuestion]

  return (
    <form onSubmit={handleSubmit} className="question-container grid grid-2-column-2 gap-[10px]">
      <div className='question'>
        <div className="question-box">
          <h2 className="question-title">Question {currentQuestion+1}</h2>
          <p className="question-text">
            {question && question.question}
          </p>
          <div className="options-container-wrapper">
            <div className="options-container">
              {['A', 'B', 'C', 'D'].map((option, index) => {
                const optionText = question.choices[index]
                const hasAnswers =  answers.answers != undefined && answers.answers.length > 0 && answers.answers[currentQuestion].user_answers != undefined
                const userAnswer = hasAnswers && answers.answers[currentQuestion].user_answers[0]
                const hasAnswer = userAnswer != undefined 
                const selectedAnswer =  hasAnswer && userAnswer.answer
                const isCorrect = isSubmitted && hasAnswer && userAnswer.is_correct
                const isTheAnswer = selectedAnswer == optionText
                console.log()
                return (
                  <button
                    key={option}
                    type="button"
                    className={`option flex 
                      ${!isSubmitted && isTheAnswer && 'selected'} 
                      ${isSubmitted && isTheAnswer && isCorrect && 'correct'}
                      ${isSubmitted && isTheAnswer && !isCorrect && 'wrong'}
                    `}
                    onClick={() => handleOptionSelect(optionText, question.answer)}
                  >
                    <div className="option-circle">{option}</div>
                    <span>{optionText}</span>
                  </button>
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

StartReviewerMultipleChoice.propTypes = {
  questions: PropTypes.array.isRequired,
  generateQuestions: PropTypes.func.isRequired,
}

export default StartReviewerMultipleChoice;