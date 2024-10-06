import searchIcon from '@assets/search.png';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../../../sass/pages/_createreviewer.scss';
// import axios from 'axios';

const CreateReviewer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewerType, setReviewerType] = useState('Enumeration'); // Default type
  const [numQuestions, setNumQuestions] = useState(10); // Number of questions toggle
  const [description, setDescription] = useState('');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false); // Dropdown visibility state
  const [file, setFile] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  // Question types
  const questionTypes = ['Enumeration', 'Multiple Choice', 'True or False', 'Matching Type'];

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('Search term:', searchTerm);
    // Handle the search logic here
  };

  const handleCreateClick = () => {
    navigate('/reviewers/create-reviewer');
  };

  const handleTitleClick = () => {
    navigate('/reviewers'); // Redirect to Reviewer page
  };


  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };


  const handleTypeClick = () => {
    setShowTypeDropdown(!showTypeDropdown); // Toggle the visibility of the dropdown
  };

  const handleTypeSelection = (type) => {
    setReviewerType(type); // Set the selected type
    setShowTypeDropdown(false); // Hide the dropdown after selection
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Prepare form data
    const formData = new FormData();
    formData.append('reviewerName', e.target.reviewerName.value);
    formData.append('numQuestions', numQuestions);
    formData.append('reviewerType', reviewerType); // Assuming this maps to `available_question_types`
    formData.append('description', description);
    if (file) formData.append('file', file);
  
    // Send to backend
    try {
      const response = await fetch('http://127.0.0.1:8000/apis/reviewers/', {
        method: 'POST',
        body: formData,
        headers: {
          'x-api-key': '175229071824-b6m83cc23849t83pfc3i94of7i16sshj.apps.googleusercontent.com', // Some APIs expect API keys in a custom header
        },
      });
  
      const data = await response.json();
      console.log(data)
      if (response.ok) {
        alert('Reviewer created successfully!');
      } else {
        alert('Error creating reviewer: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  // class App extends React.Component(
  //   state = { details: [], }
  //   componentDidMont() {
  //     let data;
  //     axios.get('http://localhost:8000')
  //     .then (res => {
  //       data = res.data;
  //       this.setsState({
  //         details:data
  //       });
  //     })
  //     .catch(err => { })
  //   }
  // )
  

  return (
      <section className="create-section p-4 flex flex-col">
        <div className="header mb-4">
          <button className="header-title" onClick={handleTitleClick}>
            {'← Back to Reviewers'}
          </button>

          <form className="search-container" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search..."
              className="search-bar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-button">
              <img src={searchIcon} alt="Search" className="search-icon" />
            </button>
          </form>

          <button className="create-button" onClick={handleCreateClick}>
            Create
          </button>
        </div>

        <div className="reviewer-content">
        <form className="reviewer-form" onSubmit={handleSubmit}>
          <div className="form-group reviewer-name-group">
            <label htmlFor="reviewerName">Reviewer Name:</label>
            <input
              type="text"
              id="reviewerName"
              placeholder="Enter reviewer name"
              className="input-field"
            />
          </div>

          <div className="form-group num-questions-group">
            <label htmlFor="numQuestions">No. of Questions:</label>
            <div className="input-toggle-wrapper">
              <input
                type="number"
                id="numQuestions"
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                className="input-field"
              />

            </div>
          </div>

            <div className="form-group">
              <label>Type of Question:</label>
              <div className="dropdown-wrapper">
                <button type="button" className="dropdown-toggle-button" onClick={handleTypeClick}>
                  {reviewerType} &#x25BC; {/* Down arrow symbol */}
                </button>
                {showTypeDropdown && (
                  <ul className="dropdown-list">
                    {questionTypes.map((type) => (
                      <li
                        key={type}
                        className="dropdown-item"
                        onClick={() => handleTypeSelection(type)}
                      >
                        {type}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Upload Content:</label>
              <div className="upload-field">
                <input type="file" id="uploadFile" className="input-field" onChange={handleFileUpload} />
                <label htmlFor="uploadFile" className="upload-link">
                </label>
              </div>
            </div>

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

            <button type="submit" className="submit-button">Create</button>
          </form>
        </div>
      </section>
    );
  };
  export default CreateReviewer;
