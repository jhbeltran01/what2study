import React, { useContext, useState, useEffect, FormEvent } from 'react';
import { actions } from './constants';
import { 
  AnswerIsSubmittedContext, 
  ResultsContext, 
  SocketContext, 
  WillShowResultsContext 
} from './Main';

interface Question {
  question: string;
  question_number: number;
}

interface Answer {
  text: string;
  is_correct: boolean;
}

interface User {
  username: string;
}

interface Result {
  answers: Answer[];
  user: User;
}

interface StartReviewerIdentificationProps {
  question: Question;
}

const StartReviewerIdentification: React.FC<StartReviewerIdentificationProps> = ({ question }) => {
  const socket = useContext(SocketContext);
  const willShowResults = useContext(WillShowResultsContext);
  const results = useContext(ResultsContext) as Result[];
  const answerIsSubmitted = useContext(AnswerIsSubmittedContext);
  const [answer, setAnswer] = useState<string>('');

  useEffect(() => {
    if (!willShowResults) return;
    setAnswer('');
  }, [willShowResults]);

  const submitAnswer = (event: FormEvent) => {
    event.preventDefault();

    const message = JSON.stringify({
      action: actions.SUBMIT_ANSWER,
      answers: [{ text: answer, question_number: question.question_number }]
    });
    socket!.send(message);
  };

  return (
    <form onSubmit={submitAnswer} className="question-container">
      <div>
        <div className="question-box">
          <p className="question-text black">{question.question}</p>
          <div className="answer-container-wrapper">
            <div className="answer-container">
              {!answerIsSubmitted && !willShowResults && (
                <input
                  className="answer-box black"
                  placeholder="Type your answer here..."
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              )}
              {answerIsSubmitted && answer !== '' ? (
                <p className="submit-success black">{answer}</p>
              ) : (
                answerIsSubmitted && <p className="submit-error black">No submitted answer.</p>
              )}
              {willShowResults &&
                results.map((result) => {
                  const answer = result.answers[0];
                  const user = result.user;

                  return (
                    <div className="mb-[1rem]" key={user.username}>
                      <div
                        className={`flex items-center justify-between ${
                          answer.is_correct ? 'submit-success' : 'submit-error'
                        }`}
                      >
                        <div>{answer.text}</div>
                        <p className="username-answer black">{user.username}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {!answerIsSubmitted && !willShowResults && (
          <div className="max-w-[400px] mx-[auto] mt-[2rem]">
            <button className="submit-button black">Submit Answer</button>
          </div>
        )}
      </div>
    </form>
  );
};

export default StartReviewerIdentification;