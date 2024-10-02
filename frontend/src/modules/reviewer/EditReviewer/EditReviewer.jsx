/**********************************************************************************************************************
  Subject: ITMC311: Integrative Programming 2
  Mentor: Sir Kevin Vega
  App Name: StudyHive
  Company Name: BCDP

  Company Members:
  Nicole B. Castillo
  Marie Angeline Pelausa
  Joy Milangela Dacuba
  Harold Beltran
  ____________________________________________________________________________________________________________________

  Ticket Information: Extension of [STUD-011] Reviewer Page -> View Reviewer Page
  Purpose: Handles Modification of Reviewer

***********************************************************************************************************************/

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EditReviewer = () => {
  const location = useLocation(); // Retrieves the current location state from the router
  const navigate = useNavigate(); // Allows navigation to different routes
  const { reviewer } = location.state; // Retrieves the 'reviewer' data passed from the previous page

  // State variables to hold form data
  const [reviewerName, setReviewerName] = useState(reviewer.name); // Reviewer name
  const [reviewerType, setReviewerType] = useState(reviewer.type); // Type of reviewer (question type)
  const [numQuestions, setNumQuestions] = useState(reviewer.numQuestions); // Number of questions
  const [description, setDescription] = useState(reviewer.description); // Description of the reviewer
  const [uploadedFile, setUploadedFile] = useState(null); // Uploaded file, if any
  const [showTypeDropdown, setShowTypeDropdown] = useState(false); // Toggle for question type dropdown
  const [visibility, setVisibility] = useState(reviewer.visibility); // Reviewer visibility (Public/Private)
  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false); // Toggle for visibility dropdown
  const [notification, setNotification] = useState(''); // Message for updating success notification

  // Constants for dropdown options
  const questionTypes = ['Enumeration', 'Multiple Choice', 'True or False', 'Matching Type']; // Question types available
  const visibilityOptions = ['Private', 'Public']; // Visibility options for the reviewer

  // Function to handle the update of reviewer details
  const handleUpdateClick = () => {
    const updatedReviewer = {
      ...reviewer, // Keeps existing properties of the reviewer object
      name: reviewerName, // Updates reviewer name
      type: reviewerType, // Updates question type
      numQuestions, // Updates number of questions
      description, // Updates description
      file: uploadedFile ? uploadedFile.name : reviewer.file, // Updates file if uploaded
      visibility, // Updates visibility
    };

    // Updates the reviewer in local storage
    const reviewers = JSON.parse(localStorage.getItem('reviewers')) || [];
    const updatedReviewers = reviewers.map((r) => (r.name === reviewer.name ? updatedReviewer : r));
    localStorage.setItem('reviewers', JSON.stringify(updatedReviewers));
    
    // Shows a success notification for the update
    setNotification('Reviewer updated successfully!');
    
    // Clears the notification after 3 seconds
    setTimeout(() => {
      setNotification('');
    }, 3000);

    // Navigates back to the list of reviewers
    navigate('/reviewers');
  };

  // Navigates back to the reviewers page
  const handleTitleClick = () => navigate('/reviewers');

  // Handles file upload and sets the state for the uploaded file
  const handleFileUpload = (event) => setUploadedFile(event.target.files[0]);

  // Toggles the visibility of the dropdowns for question type and visibility
  const toggleDropdown = (type) => {
    if (type === 'type') setShowTypeDropdown(!showTypeDropdown);
    else if (type === 'visibility') setShowVisibilityDropdown(!showVisibilityDropdown);
  };

  // Handles the selection of question type or visibility from the dropdown menus
  const handleSelection = (type, selection) => {
    if (type === 'reviewerType') {
      setReviewerType(selection);
      setShowTypeDropdown(false);
    } else if (type === 'visibility') {
      setVisibility(selection);
      setShowVisibilityDropdown(false);
    }
  };

  return (
    <section className="create-section">
      <div className="create">
        <div className="header">
          <button className="header-title" onClick={handleTitleClick}>
            {'← Back to Reviewers'} {/* Button to navigate back */}
          </button>
        </div>

        {/* Displays notification message if any */}
        {notification && (
          <div className="notification">
            {notification} {/* Success message after updating reviewer */}
          </div>
        )}

        <div className="reviewer-content">
          <form className="reviewer-form">
            <div className="form-group">
              <label htmlFor="reviewerName">Reviewer Name:</label>
              <input
                type="text"
                id="reviewerName"
                placeholder="Enter reviewer name"
                className="input-field"
                value={reviewerName} // Input value for reviewer name
                onChange={(e) => setReviewerName(e.target.value)} // Updates the reviewer name on input change
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <input
                type="text"
                id="description"
                placeholder="Enter description"
                className="input-field"
                value={description} // Input value for description
                onChange={(e) => setDescription(e.target.value)} // Updates the description on input change
              />
            </div>

            <div className="form-group">
              <label htmlFor="numQuestions">No. of Questions:</label>
              <input
                type="number"
                id="numQuestions"
                value={numQuestions} // Input value for the number of questions
                onChange={(e) => setNumQuestions(e.target.value)} // Updates number of questions on input change
                className="input-field"
              />
            </div>

            {/* Dropdown for question types */}
            <div className="form-group dropdown-wrapper">
              <label>Type of Question:</label>
              <button
                type="button"
                className="dropdown-toggle-button"
                onClick={() => toggleDropdown('type')} // Toggles the question type dropdown
              >
                {reviewerType}
                <span className="dropdown-icon">&#x25BC;</span> {/* Dropdown arrow */}
              </button>
              {showTypeDropdown && (
                <ul className="dropdown-list">
                  {questionTypes.map((type) => (
                    <li
                      key={type}
                      className="dropdown-item"
                      onClick={() => handleSelection('reviewerType', type)} // Handles question type selection
                    >
                      {type}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Dropdown for visibility options */}
            <div className="form-group dropdown-wrapper">
              <label>Visibility:</label>
              <button
                type="button"
                className="dropdown-toggle-button"
                onClick={() => toggleDropdown('visibility')} // Toggles the visibility dropdown
              >
                {visibility}
                <span className="dropdown-icon">&#x25BC;</span> {/* Dropdown arrow */}
              </button>
              {showVisibilityDropdown && (
                <ul className="dropdown-list">
                  {visibilityOptions.map((option) => (
                    <li
                      key={option}
                      className="dropdown-item"
                      onClick={() => handleSelection('visibility', option)} // Handles visibility selection
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* File upload input */}
            <div className="form-group">
              <label htmlFor="uploadFile">Upload Content:</label>
              <input
                type="file"
                id="uploadFile"
                className="input-field"
                onChange={handleFileUpload} // Handles file upload
              />
            </div>

            {/* Update button */}
            <button type="button" className="update-button" onClick={handleUpdateClick}>
              Update {/* Button to trigger reviewer update */}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EditReviewer;
