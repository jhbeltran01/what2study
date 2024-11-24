import React, { createContext, useEffect, useState } from 'react'
import { rootWebSocketURL, actions } from './constants'
import ReviewersList from './ReviewersList'
import StartReviewer from './StartReviewer'
import ErrorMessage from './ErrorMessage'
import ActionButtons from './ActionButtons'

interface MyComponentProps {
  studypodSlug: string;
}




export const SocketContext = createContext<WebSocket | null>(null)
export const AnswerIsSubmittedContext = createContext<boolean | null>(null)
export const ResultsContext = createContext<any[] | null>(null)
export const WillShowResultsContext = createContext<boolean | null>(null)

const Main: React.FC<MyComponentProps> = ({studypodSlug}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [reviewers, setReviewers] = useState([])
  const [displayReviewers, setDisplayReviewers] = useState(false)
  const [startReview, setStartReview] = useState(false)
  const [questions, setQuestions] = useState([])
  const [answerIsSubmitted, setAnswerIsSubmitted] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [results, setResults] = useState([])
  const [willShowResults, setWillShowResults] = useState(false)

  useEffect(() => {
    if (socket == null) {
      setSocket(new WebSocket(`${rootWebSocketURL}/study-pod/${studypodSlug}/`))
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
    console.log(results)
    setWillShowResults(true)
    setResults(results)
  }

  return (
    <WillShowResultsContext.Provider value={willShowResults}>
      <ResultsContext.Provider value={results}>
        <AnswerIsSubmittedContext.Provider value={answerIsSubmitted}>
          <SocketContext.Provider value={socket}>
            <div className='container-1 black'>
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
