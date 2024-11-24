import React, { useContext, useState, useEffect } from 'react';
import { actions } from './constants';
import { AnswerIsSubmittedContext, ResultsContext, SocketContext, WillShowResultsContext } from './Main';

const StartReviewerIdentification = ({question}) => {
  const socket = useContext(SocketContext)
  const willShowResults = useContext(WillShowResultsContext)
  const results = useContext(ResultsContext)
  const answerIsSubmitted = useContext(AnswerIsSubmittedContext)
  const [answer, setAnswer] = useState('')

  useEffect(() => {
    if (!willShowResults) { return }
    setAnswer('')
  }, [willShowResults])

  const submitAnswer = (event) => {
    event.preventDefault()

    const message = JSON.stringify({
      action: actions.SUBMIT_ANSWER,
      answers: [{text: answer, question_number: 1}]
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
          <div className="answer-container-wrapper">
            <div className="answer-container">
              {
                !answerIsSubmitted && !willShowResults
                &&  <input
                    className="answer-box"
                    placeholder="Type your answer here..."
                    type='text'
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                  />
              }
              {
                answerIsSubmitted && answer != ''
                ? <p className='submit-success'>{answer}</p>
                : answerIsSubmitted && <p className='submit-error'>No submitted answer.</p>
              }
              {
                willShowResults
                && results.map(result => {
                  const answer = result.answers[0]
                  const user = result.user

                  return (
                    <div className=' mb-[1rem]'>
                      <div className={`flex items-center justify-between ${answer.is_correct ? 'submit-success' : 'submit-error'}`}  key={user.username}>
                        {answer.text} <p className='username-answer'>{user.username}</p>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>

        {
          !answerIsSubmitted && !willShowResults
          && <div className='max-w-[400px] mx-[auto] mt-[2rem]'> 
              <button className='submit-button'>Submit Answer</button>
            </div>
        }
      </div>
    </form>
  );
};

export default StartReviewerIdentification;
