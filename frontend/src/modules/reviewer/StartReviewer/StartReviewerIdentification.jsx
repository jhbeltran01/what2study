import React, { useState } from 'react';

const StartReviewerIdentification = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(5);
  const [answers, setAnswers] = useState({}); // Stores answers for each question

  const handleInputChange = (e) => {
    setSelectedOption(e.target.value); // Set the current typed answer
  };

  const handleNext = () => {
    if (currentQuestion < 10) {
      setAnswers({
        ...answers,
        [currentQuestion]: selectedOption, // Save current answer to answers state
      });
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(answers[currentQuestion + 1] || ''); // Load saved answer for next question or reset
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setAnswers({
        ...answers,
        [currentQuestion]: selectedOption, // Save current answer to answers state
      });
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[currentQuestion - 1] || ''); // Load saved answer for previous question
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert('Answers saved!');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Answers submitted: ' + JSON.stringify(answers));
  };

  return (
    <form onSubmit={handleSubmit} className="question-container">
      <div className="question-box">
        <h2 className="question-title">Question {currentQuestion}</h2>
        <p className="question-text">
          Identify the protocol commonly used for building RESTful web services
        </p>

        <div className="answer-container-wrapper">
          <div className="answer-container">
            {/* Gray box where the user types the answer */}
            <textarea
              className="answer-box"
              placeholder="Type your answer here..."
              value={selectedOption}
              onChange={handleInputChange}
              rows="4"
              required // Make the textarea required
            />
          </div>
        </div>

        {/* Navigation buttons moved below the question box */}
        <div className="navigation-buttons">
          <button type="button" className="prev-button" onClick={handlePrevious}>
            Previous
          </button>
          <button type="button" className="next-button" onClick={handleNext}>
            Next
          </button>
        </div>
      </div>

      <div className="right-section">
        <div className="question-wrapper">
          <div className="question-number-wrapper">
            <div className="question-number-container">
              {[...Array(10)].map((_, index) => {
                const questionNumber = index + 1;
                const hasAnswer = answers[questionNumber] && answers[questionNumber].trim() !== ''; // Check if the question has an answer

                return (
                  <button
                    key={index}
                    type="button" // Make sure the button doesn't submit the form
                    className={`question-number-identification ${
                      currentQuestion === questionNumber ? 'active' : ''
                    } ${hasAnswer ? 'has-answer' : 'no-answer'}`} // Apply classes based on answers
                    onClick={() => {
                      setAnswers({
                        ...answers,
                        [currentQuestion]: selectedOption, // Save answer before switching questions
                      });
                      setCurrentQuestion(questionNumber);
                      setSelectedOption(answers[questionNumber] || ''); // Load saved answer for selected question
                    }}
                  >
                    {questionNumber}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="save-submit-buttons">
            <button type="button" className="save-button" onClick={handleSave}>
              Save Answers
            </button>
            <button type="submit" className="submit-button">
              Submit Answers
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default StartReviewerIdentification;
