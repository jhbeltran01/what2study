import React, { useState } from 'react';

const StartReviewerMultipleChoice = () => {
  const [selectedOption, setSelectedOption] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(5);

  const handleOptionSelect = (option) => {
    setSelectedOption((prev) => ({
      ...prev,
      [currentQuestion]: option,
    }));
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

  return (
    <form className="question-container">
      <div className="question-box">
        <h2 className="question-title">Question {currentQuestion}</h2>
        <p className="question-text">
          What is the main purpose of using middleware in integrative programming?
        </p>

        <div className="options-container-wrapper">
          <div className="options-container">
            {['A', 'B', 'C', 'D'].map((option) => (
              <button
                key={option}
                type="button"
                className={`option ${selectedOption[currentQuestion] === option ? 'selected' : ''}`}
                onClick={() => handleOptionSelect(option)}
              >
                <div className="circle">{option}</div>
                <span>This is option {option}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="navigation-buttons">
          <button className="prev-button" type="button" onClick={handlePrevious}>
            Previous
          </button>
          <button className="next-button" type="button" onClick={handleNext}>
            Next
          </button>
        </div>
      </div>

      <div className="right-section">
        <div className="question-wrapper">
          <div className="question-number-wrapper">
            <div className="question-number-container">
              {[...Array(10)].map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`question-number ${
                    currentQuestion === index + 1 ? 'active' : ''
                  } ${selectedOption[index + 1] ? 'answered' : ''}`} // Add answered class based on selection
                  onClick={() => setCurrentQuestion(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
          <div className="save-submit-buttons">
            <button className="save-button" type="button">Save Answers</button>
            <button className="submit-button" type="button">Submit Answers</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default StartReviewerMultipleChoice;
