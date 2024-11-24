import React, { useContext, useState } from 'react';
import { AnswerIsSubmittedContext, ResultsContext, SocketContext, WillShowResultsContext } from './Main';


const StartReviewerMultipleChoice = ({question}) => {
  const socket = useContext(SocketContext)
  const results = useContext(ResultsContext)
  const willShowResults = useContext(WillShowResultsContext)
  const answerIsSubmitted = useContext(AnswerIsSubmittedContext)
  const [answer, setAnswer] = useState('')

  const submitAnswer = (event) => {
    event.preventDefault()

    const message = JSON.stringify({
      action: "SUBMIT_ANSWER",
      answers: [{
        "text": answer,
        "question_number": 1
      }]
    })

    socket.send(message)
  }

  return (
    <form onSubmit={submitAnswer} className="question-container">
      <div>
        <div className="question-box">
          <p className="question-text">
            {question.question}
          </p>
          <div className="options-container-wrapper">
            <div className="options-container">
              {!willShowResults && ['A', 'B', 'C', 'D'].map((option, index) => {
                const choice = question.choices[index]
                const choiceIsTheAnswer = choice == answer

                return (
                  <button
                    key={option}
                    type="button"
                    className={`
                      flex
                      ${!answerIsSubmitted && answer != '' && choiceIsTheAnswer && 'option selected'}
                      ${answerIsSubmitted && choice == answer && 'submit-success items-center'}
                      ${!choiceIsTheAnswer && 'option'}
                    `}
                    onClick={() => setAnswer(choice)}
                  >
                    <div className="option-circle">{option}</div>
                    <span className='option-text'>{choice}</span>
                  </button>
                )
              })}
              {
                willShowResults
                && ['A', 'B', 'C', 'D'].map((option, index) => {
                  const choice = question.choices[index]
                  const isTheAnswer = question.answer == choice;

                  return(
                    <div 
                      className={`${isTheAnswer ? 'submit-success' : 'option'} flex justify-between`}
                      key={option}
                    >
                      <div className='flex items-center'>
                        <div className="option-circle">{option}</div>
                        <span className='option-text'>{choice}</span>
                      </div>
                      <div className='flex gap-[10px]'> 
                        {results.map(result => {
                          const answer = result.answers[0]
                          const user = result.user
                          if (answer.text != choice) { return }

                          return (
                            <p className='username-answer' key={user.username}>{user.username}</p>
                          )
                        })}
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>

      {
        !answerIsSubmitted && !willShowResults
        && <div className='max-w-[400px] mx-[auto] mt-[2rem]'> 
            <button className='submit-button'>Submit Answer</button>
          </div>
      }
    </form>
  );
};

export default StartReviewerMultipleChoice;