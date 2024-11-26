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
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0); // State for upload progress
  const navigate = useNavigate();

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

    if (reviewer.files.length === 0) {
      console.error('No files uploaded.');
      setErrorMessage('Please upload at least one file.');
      setSuccessMessage('');
      setTimeout(() => setErrorMessage(''), 5000);
      return; // Stop submission
    }
  
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
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentage); // Update progress percentage
        },
      });
  
      if (response.status === 200) {
        setReviewer(initialReviewer); // Clear form fields
        setSuccessMessage('Reviewer created successfully!');
        setErrorMessage('');
        setTimeout(() => setSuccessMessage(''), 5000);
        setUploadProgress(0); // Reset progress bar
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      setErrorMessage('Error creating reviewer, please try again.');
      setSuccessMessage('');
      setTimeout(() => setErrorMessage(''), 5000);
      setUploadProgress(0); // Reset progress bar
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

          {uploadProgress > 0 && (
  <div className="progress-bar-container">
    <div
      className="progress-bar"
      style={{ width: `${uploadProgress}%` }}
    ></div>
    <span className="progress-percentage">{uploadProgress}%</span>
  </div>
)}



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
