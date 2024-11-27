import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiRootURL } from '@root/globals';

const initialReviewer = {
  name: '',
  description: '',
  files: []
};

const CreateReviewer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewer, setReviewer] = useState(initialReviewer);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(''); // State to hold error messages


  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('Search term:', searchTerm);
  };

  const handleCreateClick = () => {
    navigate('/reviewers/create-reviewer');
  };

  const handleTitleClick = () => {
    navigate('/reviewers');
  };

  const handleFileUpload = (event) => {
    setReviewer({
      ...reviewer,
      files: event.target.files
    });

    if (event.target.files.length > 0) {
      setSuccessMessage('Files uploaded successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setReviewer({
      ...reviewer,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('name', reviewer.name);
    formData.append('description', reviewer.description);
    
    Array.from(reviewer.files).forEach((file) => {
      formData.append('files', file);
    });
    
    try {
      const response = await axios.post(`${apiRootURL}/reviewers/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    
      console.log('API Response:', response);
    
      if (response.status === 200) {
        setReviewer(initialReviewer); // Clear form fields
        setSuccessMessage('Reviewer created successfully!');
        setErrorMessage(''); // Clear error message if success
        setTimeout(() => setSuccessMessage(''), 5000); // Clear the success message after 5 seconds
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      setErrorMessage('Error creating reviewer, please try again.'); // Set error message
      setSuccessMessage(''); // Clear success message if error
      setTimeout(() => setErrorMessage(''), 5000); // Clear the error message after 5 seconds
    }
  };
  
  

  return (
    <section className="create-section p-4 flex flex-col">
      <div className="create-reviewer-header flex items-center justify-between mb-4">
        <button className="back-create-button" onClick={handleTitleClick}>
          Back
        </button>
      </div>
      <div className="create-reviewer-content">
  {successMessage && (
    <div className="success-message">
      {successMessage}
      <button
        className="close-message-button"
        onClick={() => setSuccessMessage('')}
      >
        &times;
      </button>
    </div>
  )}

  {errorMessage && (
    <div className="error-message">
      {errorMessage}
      <button
        className="close-message-button"
        onClick={() => setErrorMessage('')}
      >
        &times;
      </button>
    </div>
  )}
        <form className="reviewer-form" onSubmit={handleSubmit}>
          <div className="form-group reviewer-name-group">
            <label htmlFor="reviewerName">Reviewer Name:</label>
            <input
              type="text"
              id="reviewerName"
              placeholder="Enter reviewer name"
              className="input-field"
              name="name"
              value={reviewer.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Upload Content:</label>
            <div className="upload-field">
              <input
                type="file"
                id="uploadFile"
                className="input-field"
                onChange={handleFileUpload}
                multiple="multiple"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              id="description"
              placeholder="Enter description"
              className="input-field"
              value={reviewer.description}
              name="description"
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="submit-button">
            Create
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateReviewer;
