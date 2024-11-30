import React, { createContext, useEffect, useState } from 'react'
import { rootWebSocketURL, actions } from './constants.js'
import ReviewersList from './ReviewersList.jsx'
import StartReviewer from './StartReviewer.jsx'
import ErrorMessage from './ErrorMessage.jsx'
import ActionButtons from './ActionButtons.jsx'
import { useSelector } from 'react-redux'
import Header from './Header.jsx'
import SuccessMessage from './SuccessMessage.jsx'

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
  const [roomInfo, setRoomInfo] = useState({})
  const [successMessages, setSuccessMessages] = useState([])
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  useEffect(() => {
    if (socket == null) {
      setSocket(new WebSocket(`${rootWebSocketURL}/study-pod/${studypod.slug}/`))
      return
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log(data)
      
      if (data.action == actions.RETRIEVE_REVIEWER_LIST
        || data.action == actions.SELECT_REVIEWER
        || data.action == actions.GENERATE_QUESTION
        || data.action == actions.SUBMIT_ANSWER
        || data.action == actions.SHOW_RESULTS
      ) {
        setAnswerIsSubmitted(false)
        setWillShowResults(false)
      }

      if (data.action == actions.RETRIEVE_REVIEWER_LIST) {
        setStartReview(false)
      }
      
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
          addSuccessMessages(data.message, true)
          break
        case actions.SHOW_RESULTS:
          showResults(data.content)
          break
        case actions.GET_ROOM_INFO:
          updateRoomInfo(data.content)
          break
        case actions.UPDATE_CONNECTED_USER:
          updateConnectedUsers(data.connected_users)
          break
        case actions.UPDATE_NUMBER_OF_SUBMISSIONS:
          updateNumberOfSubmissions(data.number_of_submissions)
          break
        case actions.SUCCESS:
          addSuccessMessages(data.message)
          break
        case actions.UPDATE_MODERATOR:
          updateModerator(data.content.moderator)
          addSuccessMessages(data.content.message)
      } 
    };

    socket.onopen = (event) => {
      const message = JSON.stringify({
        action: actions.GET_ROOM_INFO
      })
      socket.send(message)
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

  const showResults = (results) => {
    setWillShowResults(true)
    setResults(results)
  }

  const updateRoomInfo = (content) => {
    setRoomInfo(content)
  }

  const updateConnectedUsers = (connectedUsers) => {
    setRoomInfo(prevState => ({...prevState, connected_users: connectedUsers}))
  }

  const updateNumberOfSubmissions = (numberOfSubmissions) => {
    setRoomInfo(prevState => ({...prevState, number_of_submissions: numberOfSubmissions}))
  }

  const addSuccessMessages = (message, isError=false) => {
    const messageData = {
      id: 'id-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      text: message,
      isError: isError
    }

    setSuccessMessages(prevState => [messageData, ...prevState])
    setShowSuccessMessage(true)

    setTimeout(() => {
      setSuccessMessages(prevState => {
        prevState.pop()
        setShowSuccessMessage(prevState.length > 0)
        return [...prevState]
      })
    }, 5000)
  }

  const updateModerator = (moderator) => {
    setRoomInfo(prevState => ({...prevState, moderator: moderator}))
  }

  return (
    <WillShowResultsContext.Provider value={willShowResults}>
      <ResultsContext.Provider value={results}>
        <AnswerIsSubmittedContext.Provider value={answerIsSubmitted}>
          <SocketContext.Provider value={socket}>
            <div className='container-2'>
              {showSuccessMessage && <SuccessMessage messages={successMessages} />}
              <Header
                moderator={roomInfo.moderator}
                numberOfConnectedUsers={roomInfo.connected_users}
                numberOfSubmissions={roomInfo.number_of_submissions}
                displayReviewers={displayReviewers}
              />
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