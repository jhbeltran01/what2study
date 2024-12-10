import React, { createContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { rootWebSocketURL, actions } from './constants';
import ReviewersList from './ReviewersList';
import StartReviewer from './StartReviewer';
import ErrorMessage from './ErrorMessage';
import ActionButtons from './ActionButtons';
import Header from './Header';
import SuccessMessage from './SuccessMessage';

interface MessageData {
  action: string;
  content?: any;
  message?: string;
  questions?: any[];
  connected_users?: number;
  number_of_submissions?: number;
}

interface RoomInfo {
  moderator?: { username: string };
  connected_users?: number;
  number_of_submissions?: number;
}

interface ReduxState {
  studypod: { value: { slug: string } };
}

export const SocketContext = createContext<WebSocket | null>(null);
export const AnswerIsSubmittedContext = createContext<boolean>(false);
export const ResultsContext = createContext<object>({});
export const WillShowResultsContext = createContext<boolean>(false);

interface MainProps {
  studypodSlug: string;
}

const Main: React.FC<MainProps> = ({ studypodSlug }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [reviewers, setReviewers] = useState<any[]>([]);
  const [displayReviewers, setDisplayReviewers] = useState<boolean>(false);
  const [startReview, setStartReview] = useState<boolean>(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answerIsSubmitted, setAnswerIsSubmitted] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [results, setResults] = useState<object>([]);
  const [willShowResults, setWillShowResults] = useState<boolean>(false);
  const [roomInfo, setRoomInfo] = useState<RoomInfo>({});
  const [successMessages, setSuccessMessages] = useState<
    { id: string; text: string; isError: boolean }[]
  >([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

  useEffect(() => {
    if (socket == null) {
      setSocket(new WebSocket(`${rootWebSocketURL}/study-pod/${studypodSlug}/`));
      return;
    }

    socket.onmessage = (event) => {
      const data: MessageData = JSON.parse(event.data);
      console.log(data);

      if (
        [
          actions.RETRIEVE_REVIEWER_LIST,
          actions.SELECT_REVIEWER,
          actions.GENERATE_QUESTION,
          actions.SUBMIT_ANSWER,
          actions.SHOW_RESULTS,
        ].includes(data.action)
      ) {
        setAnswerIsSubmitted(false);
        setWillShowResults(false);
      }

      if (data.action === actions.RETRIEVE_REVIEWER_LIST) {
        setStartReview(false);
      }

      switch (data.action) {
        case actions.RETRIEVE_REVIEWER_LIST:
          retrieveReviewerList(data.content);
          break;
        case actions.SELECT_REVIEWER:
          startReviewing();
          break;
        case actions.GENERATE_QUESTION:
          generateQuestions(data.questions || []);
          break;
        case actions.SUBMIT_ANSWER:
          submitAnswer();
          break;
        case actions.ERROR:
          addSuccessMessages(data.message || '', true);
          break;
        case actions.SHOW_RESULTS:
          showResults(data.content || {});
          break;
        case actions.GET_ROOM_INFO:
          updateRoomInfo(data.content || {});
          break;
        case actions.UPDATE_CONNECTED_USER:
          updateConnectedUsers(data.connected_users || 0);
          break;
        case actions.UPDATE_NUMBER_OF_SUBMISSIONS:
          updateNumberOfSubmissions(data.number_of_submissions || 0);
          break;
        case actions.SUCCESS:
          addSuccessMessages(data.message || '');
          break;
        case actions.UPDATE_MODERATOR:
          updateModerator(data.content?.moderator);
          addSuccessMessages(data.content?.message || '');
          break;
      }
    };

    socket.onopen = () => {
      const message = JSON.stringify({ action: actions.GET_ROOM_INFO });
      socket.send(message);
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socket.close();
    };
  }, [socket, studypodSlug]);

  const retrieveReviewerList = (reviewers: any[]) => {
    setReviewers(reviewers);
    setDisplayReviewers(true);
    setQuestions([]);
  };

  const startReviewing = () => {
    setDisplayReviewers(false);
    setStartReview(true);
  };

  const generateQuestions = (questions: any[]) => {
    setQuestions(questions);
  };

  const submitAnswer = () => {
    setAnswerIsSubmitted(true);
  };

  const showResults = (results: object) => {
    setWillShowResults(true);
    setResults(results);
    console.log(results)
  };

  const updateRoomInfo = (content: RoomInfo) => {
    setRoomInfo(content);
  };

  const updateConnectedUsers = (connectedUsers: number) => {
    setRoomInfo((prevState) => ({ ...prevState, connected_users: connectedUsers }));
  };

  const updateNumberOfSubmissions = (numberOfSubmissions: number) => {
    setRoomInfo((prevState) => ({ ...prevState, number_of_submissions: numberOfSubmissions }));
  };

  const addSuccessMessages = (message: string, isError = false) => {
    const messageData = {
      id: 'id-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      text: message,
      isError,
    };

    setSuccessMessages((prevState) => [messageData, ...prevState]);
    setShowSuccessMessage(true);

    setTimeout(() => {
      setSuccessMessages((prevState) => {
        prevState.pop();
        setShowSuccessMessage(prevState.length > 0);
        return [...prevState];
      });
    }, 5000);
  };

  const updateModerator = (moderator: { username: string } | undefined) => {
    setRoomInfo((prevState) => ({ ...prevState, moderator }));
  };

  return (
    <WillShowResultsContext.Provider value={willShowResults}>
      <ResultsContext.Provider value={results}>
        <AnswerIsSubmittedContext.Provider value={answerIsSubmitted}>
          <SocketContext.Provider value={socket}>
            <div className="container-2">
              {showSuccessMessage && <SuccessMessage messages={successMessages} />}
              <Header
                moderator={roomInfo.moderator}
                numberOfConnectedUsers={roomInfo.connected_users}
                numberOfSubmissions={roomInfo.number_of_submissions}
                displayReviewers={displayReviewers}
              />
              {displayReviewers && <ReviewersList reviewers={reviewers} />}
              {startReview && <StartReviewer questions={questions} />}
              {hasError && <ErrorMessage message={errorMessage} />}
              <ActionButtons />
            </div>
          </SocketContext.Provider>
        </AnswerIsSubmittedContext.Provider>
      </ResultsContext.Provider>
    </WillShowResultsContext.Provider>
  );
};

export default Main;