import React, { useState } from 'react';

const StartReviewerEnumeration = () => {
  const [currentQuestion, setCurrentQuestion] = useState(5);
  const [answers, setAnswers] = useState({});
  const [placeholders, setPlaceholders] = useState(['', '', '']); // initial 3 placeholders

  // Handle changes in answer fields
  const handleInputChange = (e, index) => {
    const updatedPlaceholders = [...placeholders];
    updatedPlaceholders[index] = e.target.value;
    setPlaceholders(updatedPlaceholders);
    setAnswers({
      ...answers,
      [currentQuestion]: updatedPlaceholders,
    });
  };

  // Add another placeholder for additional answer input
  const addPlaceholder = () => {
    setPlaceholders([...placeholders, '']);
  };

  // Remove the last placeholder
  const removeLastPlaceholder = () => {
    if (placeholders.length > 1) {
      const updatedPlaceholders = placeholders.slice(0, -1);
      setPlaceholders(updatedPlaceholders); // remove the last placeholder
      setAnswers({
        ...answers,
        [currentQuestion]: updatedPlaceholders, // update answers after removing the last placeholder
      });
    }
  };

  const handleNext = () => {
    if (currentQuestion < 10) {
      setAnswers({
        ...answers,
        [currentQuestion]: placeholders,
      });
      setCurrentQuestion(currentQuestion + 1);
      setPlaceholders(answers[currentQuestion + 1] || ['', '', '']);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setAnswers({
        ...answers,
        [currentQuestion]: placeholders,
      });
      setCurrentQuestion(currentQuestion - 1);
      setPlaceholders(answers[currentQuestion - 1] || ['', '', '']);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert('Answers saved!');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate answers before submission
    if (Object.keys(answers).length === 0) {
      alert('Please provide answers before submitting.');
      return;
    }
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
            {placeholders.map((placeholder, index) => (
              <div key={index} className="answer-row">
                <textarea
                  className="answer-box"
                  placeholder={`Answer ${index + 1}`}
                  value={placeholder}
                  onChange={(e) => handleInputChange(e, index)}
                  rows="2"
                  aria-label={`Answer ${index + 1}`} // Accessibility improvement
                  required // Make the textarea required
                />
              </div>
            ))}

            <div className="button-group">
              {/* Button to add more placeholders */}
              <button type="button" className="add-placeholder-button" onClick={addPlaceholder}>
                + Add another answer
              </button>

              {/* Single "Remove" button to remove the last placeholder */}
              {placeholders.length > 1 && (
                <button type="button" className="remove-placeholder-button" onClick={removeLastPlaceholder}>
                  Remove last answer
                </button>
              )}
            </div>
          </div>
        </div>

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
                const hasAnswer = answers[questionNumber] && answers[questionNumber].some(answer => answer.trim() !== '');

                return (
                  <button
                    key={index}
                    type="button" // Make sure the button doesn't submit the form
                    className={`question-number-enumeration ${currentQuestion === questionNumber ? 'active' : ''} ${hasAnswer ? 'has-answer' : 'no-answer'}`}
                    onClick={() => {
                      setAnswers({
                        ...answers,
                        [currentQuestion]: placeholders,
                      });
                      setCurrentQuestion(questionNumber);
                      setPlaceholders(answers[questionNumber] || ['', '', '']);
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

export default StartReviewerEnumeration;
