import React, { createContext, useEffect, useState } from 'react'
import { rootWebSocketURL, actions } from './constants.js'
import ReviewersList from './ReviewersList.jsx'
import StartReviewer from './StartReviewer.jsx'
import ErrorMessage from './ErrorMessage.jsx'
import ActionButtons from './ActionButtons.jsx'
import { useSelector } from 'react-redux'

export const SocketContext = createContext()
export const AnswerIsSubmittedContext = createContext()
export const ResultsContext = createContext()
export const WillShowResultsContext = createContext()

function Main() {
  const studypod = useSelector(state => state.studypod.value)
  const [socket, setSocket] = useState(null)
  const [reviewers, setReviewers] = useState([])
  const [displayReviewers, setDisplayReviewers] = useState(false)
  const [startReview, setStartReview] = useState(false)
  const [questions, setQuestions] = useState([])
  const [answerIsSubmitted, setAnswerIsSubmitted] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [results, setResults] = useState({})
  const [willShowResults, setWillShowResults] = useState(false)

  useEffect(() => {
    if (socket == null) {
      setSocket(new WebSocket(`${rootWebSocketURL}/study-pod/${studypod.slug}/`))
      return
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log(data)
      setAnswerIsSubmitted(false)
      setWillShowResults(false)
      
      switch(data.action) {
        case actions.RETRIEVE_REVIEWER_LIST:
          retrieveReviewerList(data.content)
          break
        case actions.SELECT_REVIEWER:
          startReviewing()
          break
        case actions.GENERATE_QUESTION:
          generateQuestions(data.questions)
          break
        case actions.SUBMIT_ANSWER:
          submitAnswer(data.content)
          break
        case actions.ERROR:
          setError(data.message)
          break
        case actions.SHOW_RESULTS:
          showResults(data.content)
          break
      } 
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socket.close()
    }
  }, [socket])

  const retrieveReviewerList = (reviewers) => {
    setReviewers(reviewers)
    setDisplayReviewers(true)
  }

  const startReviewing = () => {
    setDisplayReviewers(false)
    setStartReview(true)
  }

  const generateQuestions = (questions) => {
    setQuestions(questions)
  }

  const submitAnswer = (content) => {
    setAnswerIsSubmitted(true)
  }

  const setError = (message) => {
    setHasError(true)
    setErrorMessage(message)

    setTimeout(() => {
      setHasError(false)
      setErrorMessage('')
    }, 5000)
  }

  const showResults = (results) => {
    setWillShowResults(true)
    setResults(results)
  }

  return (
    <WillShowResultsContext.Provider value={willShowResults}>
      <ResultsContext.Provider value={results}>
        <AnswerIsSubmittedContext.Provider value={answerIsSubmitted}>
          <SocketContext.Provider value={socket}>
            <div className='container-2'>
              {displayReviewers && <ReviewersList reviewers={reviewers}/>}
              {startReview && <StartReviewer questions={questions} />}
              {hasError && <ErrorMessage message={errorMessage} />}
              <ActionButtons />
            </div>
          </SocketContext.Provider>
        </AnswerIsSubmittedContext.Provider>
      </ResultsContext.Provider>
    </WillShowResultsContext.Provider>
  )
}

export default Main
