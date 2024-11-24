import React, { useState } from 'react';
import axios from 'axios';
import { apiRootURL } from '@root/globals';
import { useSelector } from 'react-redux'

const initialReviewer = {
  name: '',
  description: '',
  files: []
}

const CreateReviewer = () => {
  const [reviewer, setReviewer] = useState(initialReviewer);
  const subject = useSelector(state => state.subject.value)

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
    
    const formData = new FormData();
    
    formData.append('name', reviewer.name);
    formData.append('description', reviewer.description);

    Array.from(reviewer.files).forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    axios
      .post(
        `${apiRootURL}/subjects/${subject.slug}/reviewers/`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', 
          }
        }
      )
      .then(response => {
        console.log(response.data)
        setReviewer(initialReviewer)
      })
      .catch(error => {
        console.log(error.response.data)
      })
  };

  return (
      <section className="create-section p-4 flex flex-col">
        <div className="reviewer-content">
        <form className="reviewer-form" onSubmit={handleSubmit}>
          <div className="form-group reviewer-name-group">
            <label htmlFor="reviewerName">Reviewer Name:</label>
            <input
              type="text"
              id="reviewerName"
              placeholder="Enter reviewer name"
              className="input-field"
              name='name'
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
                />
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
                value={reviewer.description}
                name='description'
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="submit-button">Create</button>
          </form>
        </div>
      </section>
    );
  };
  export default CreateReviewer;
