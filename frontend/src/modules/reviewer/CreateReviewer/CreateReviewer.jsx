/***********************************************************************************************************************************
Subject: ITMC311 Integrative Programming 2
Mentor: Sir Kevin G. Vega
App Name: StudyHive
Company Name: BCDP

Company Members:
Nicole B. Castillo
Marie Angeline Pelausa
Joy Milangela Dacuba
Harold Beltran
___________________________________________________________________________________________________________________________________

Ticket Information: [STUD-010] Reviewer Page Extension -> Create Reviewer Page
Purpose: Allows users to customize and create a reviewer.
***********************************************************************************************************************************/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateReviewer = () => {
  // State variables to hold form input values
  const [reviewerName, setReviewerName] = useState(''); // Reviewer name input
  const [reviewerType, setReviewerType] = useState('Multiple Choice'); // Default type of question
  const [numQuestions, setNumQuestions] = useState(10); // Default number of questions
  const [description, setDescription] = useState(''); // Reviewer description input
  const [uploadedFile, setUploadedFile] = useState(null); // Uploaded file (if any)
  const [showTypeDropdown, setShowTypeDropdown] = useState(false); // Toggle dropdown for question types
  const [visibility, setVisibility] = useState('Private'); // Reviewer visibility setting
  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false); // Toggle dropdown for visibility
  const navigate = useNavigate(); // Navigation hook to handle page redirects

  // Arrays to define options for question types and visibility settings
  const questionTypes = ['Enumeration', 'Multiple Choice', 'Identification']; // Question types
  const visibilityOptions = ['Private', 'Public']; // Reviewer visibility options

  // Handle the click to create a reviewer object
  const handleCreateClick = () => {
    const reviewer = {
      name: reviewerName, // Reviewer name
      type: reviewerType, // Type of question selected
      numQuestions, // Number of questions
      date: new Date().toLocaleDateString(), // Current date
      description, // Reviewer description
      createdBy: 'User Name', // Default creator (static for now)
      file: uploadedFile ? uploadedFile.name : 'No file uploaded', // Uploaded file name or default message
      visibility // Visibility (Private/Public)
    };

    // If visibility is 'Public', store the reviewer in a public collection
    if (visibility === 'Public') {
      const publicReviewers = JSON.parse(localStorage.getItem('publicReviewers')) || [];
      publicReviewers.push(reviewer);
      localStorage.setItem('publicReviewers', JSON.stringify(publicReviewers));
    }

    // Store the reviewer in the local 'reviewers' collection
    const reviewers = JSON.parse(localStorage.getItem('reviewers')) || [];
    reviewers.push(reviewer);
    localStorage.setItem('reviewers', JSON.stringify(reviewers));

    // Redirect user to the reviewers page after creation
    navigate('/reviewers');
  };

  // Handle click on the 'Back to Reviewers' button
  const handleTitleClick = () => navigate('/reviewers');

  // Handle file upload for the reviewer
  const handleFileUpload = (event) => setUploadedFile(event.target.files[0]);

  // Toggle dropdown display for question type or visibility
  const toggleDropdown = (type) => {
    if (type === 'type') setShowTypeDropdown(!showTypeDropdown); // Toggle question type dropdown
    else if (type === 'visibility') setShowVisibilityDropdown(!showVisibilityDropdown); // Toggle visibility dropdown
  };

  // Handle selection of question type or visibility
  const handleSelection = (type, selection) => {
    if (type === 'reviewerType') {
      setReviewerType(selection); // Set the selected question type
      setShowTypeDropdown(false); // Close the dropdown
    } else if (type === 'visibility') {
      setVisibility(selection); // Set the selected visibility option
      setShowVisibilityDropdown(false); // Close the dropdown
    }
  };

  return (
    <section className="create-section">
      <div className="create">
        {/* Header section with 'Back to Reviewers' button */}
        <div className="header">
          <button className="header-title" onClick={handleTitleClick}>
            {'← Back to Reviewers'}
          </button>
        </div>

        {/* Main content for creating a reviewer */}
        <div className="reviewer-content">
          <form className="reviewer-form">
            {/* Form input for reviewer name */}
            <div className="form-group">
              <label htmlFor="reviewerName">Reviewer Name:</label>
              <input
                type="text"
                id="reviewerName"
                placeholder="Enter reviewer name"
                className="input-field"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
              />
            </div>

            {/* Form input for description */}
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <input
                type="text"
                id="description"
                placeholder="Enter description"
                className="input-field"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Form input for number of questions */}
            <div className="form-group">
              <label htmlFor="numQuestions">No. of Questions:</label>
              <input
                type="number"
                id="numQuestions"
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Dropdown for selecting type of question */}
            <div className="form-group dropdown-wrapper">
              <label>Type of Question:</label>
              <button
                type="button"
                className="dropdown-toggle-button"
                onClick={() => toggleDropdown('type')}
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
                      onClick={() => handleSelection('reviewerType', type)}
                    >
                      {type}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Dropdown for selecting visibility */}
            <div className="form-group dropdown-wrapper">
              <label>Visibility:</label>
              <button
                type="button"
                className="dropdown-toggle-button"
                onClick={() => toggleDropdown('visibility')}
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
                      onClick={() => handleSelection('visibility', option)}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Form input for file upload */}
            <div className="form-group">
              <label htmlFor="uploadFile">Upload Content:</label>
              <input
                type="file"
                id="uploadFile"
                className="input-field"
                onChange={handleFileUpload}
              />
            </div>

            {/* Button to create the reviewer */}
            <button type="button" className="submit-button" onClick={handleCreateClick}>
              Create
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CreateReviewer;
