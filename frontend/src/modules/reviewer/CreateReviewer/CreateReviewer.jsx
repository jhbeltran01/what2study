// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { apiRootURL } from '@root/globals';

// const initialReviewer = {
//   name: '',
//   description: '',
//   files: []
// };

// const CreateReviewer = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [reviewer, setReviewer] = useState(initialReviewer);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [uploadProgress, setUploadProgress] = useState(0); // State for upload progress
//   const navigate = useNavigate();

//   const handleSearchSubmit = (event) => {
//     event.preventDefault();
//     console.log('Search term:', searchTerm);
//   };

//   const handleCreateClick = () => {
//     navigate('/reviewers/create-reviewer');
//   };

//   const handleTitleClick = () => {
//     navigate('/reviewers');
//   };

//   const handleFileUpload = (event) => {
//     setReviewer({
//       ...reviewer,
//       files: event.target.files
//     });
//   };

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setReviewer({
//       ...reviewer,
//       [name]: value
//     });
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (reviewer.files.length === 0) {
//       console.error('No files uploaded.');
//       setErrorMessage('Please upload at least one file.');
//       setSuccessMessage('');
//       setTimeout(() => setErrorMessage(''), 5000);
//       return; // Stop submission
//     }
  
//     const formData = new FormData();
//     formData.append('name', reviewer.name);
//     formData.append('description', reviewer.description);
  
//     Array.from(reviewer.files).forEach((file) => {
//       formData.append('files', file);
//     });
  
//     try {
//       const response = await axios.post(`${apiRootURL}/reviewers/`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         onUploadProgress: (progressEvent) => {
//           const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//           setUploadProgress(percentage); // Update progress percentage
//         },
//       });
    
//       console.log('API Response:', response);
//       if (response) {
//         setReviewer(initialReviewer); // Clear form fields
//         setSuccessMessage('Reviewer created successfully!');
//         setErrorMessage('');
//         setTimeout(() => setSuccessMessage(''), 5000);
//         setUploadProgress(0); // Reset progress bar
//       }
//     } catch (error) {
//       console.error(error.response?.data || error.message);
//       setErrorMessage('Error creating reviewer, please try again.');
//       setSuccessMessage('');
//       setTimeout(() => setErrorMessage(''), 5000);
//       setUploadProgress(0); // Reset progress bar
//     }
//   };
  

//   return (
//     <section className="create-reviewer-section p-4 flex flex-col">
//       <div className="create-reviewer-header flex items-center justify-between mb-4">
//         <button className="back-createrev-button" onClick={handleTitleClick}>
//           Back
//         </button>
//       </div>
//       <div className="create-reviewer-content">
//         {successMessage && (
//           <div className="rev-success-message">
//             {successMessage}
//             <button
//               className="rev-close-message-button"
//               onClick={() => setSuccessMessage('')}
//             >
//               &times;
//             </button>
//           </div>
//         )}

//         {errorMessage && (
//           <div className="rev-error-message">
//             {errorMessage}
//             <button
//               className="rev-close-message-button"
//               onClick={() => setErrorMessage('')}
//             >
//               &times;
//             </button>
//           </div>
//         )}

//         <form className="create-reviewer-form" onSubmit={handleSubmit}>
//           <div className="create-form-group reviewer-name-group">
//             <label className="rev-label-name" htmlFor="reviewerName">Reviewer Name:</label>
//             <input
//               type="text"
//               id="reviewerName"
//               placeholder="Enter reviewer name"
//               className="input-field"
//               name="name"
//               value={reviewer.name}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="create-form-group">
//             <label className="rev-label-upload">Upload Content:</label>
//             <div className="upload-field">
//               <input
//                 type="file"
//                 id="uploadFile"
//                 className="input-field"
//                 onChange={handleFileUpload}
//                 multiple="multiple"
//               />
//             </div>
//           </div>

//           {uploadProgress > 0 && (
//   <div className="progress-bar-container">
//     <div
//       className="progress-bar"
//       style={{ width: `${uploadProgress}%` }}
//     ></div>
//     <span className="progress-percentage">{uploadProgress}%</span>
//   </div>
// )}
//           <div className="create-form-group">
//             <label className="rev-label-description" htmlFor="description">Description:</label>
//             <input
//               type="text"
//               id="description"
//               placeholder="Enter description"
//               className="input-field"
//               value={reviewer.description}
//               name="description"
//               onChange={handleChange}
//             />
//           </div>

//           <button type="submit" className="submit-button">
//             Create
//           </button>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default CreateReviewer;

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
  const [reviewer, setReviewer] = useState(initialReviewer);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

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

    // Validate inputs
    if (!reviewer.name.trim()) {
      setErrorMessage('Reviewer Name is required.');
      setSuccessMessage('');
      return;
    }
    if (!reviewer.description.trim()) {
      setErrorMessage('Reviewer Description is required.');
      setSuccessMessage('');
      return;
    }
    if (reviewer.files.length === 0) {
      setErrorMessage('Please upload at least one file.');
      setSuccessMessage('');
      return;
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
          setUploadProgress(percentage);
        },
      });

      if (response) {
        setReviewer(initialReviewer); // Clear form fields
        setSuccessMessage('Reviewer created successfully!');
        setErrorMessage('');
        setUploadProgress(0);
      }
    } catch (error) {
      setErrorMessage('Error creating reviewer. Please try again.');
      setSuccessMessage('');
      setUploadProgress(0);
    }
  };

  return (
    <section className="create-reviewer-section">
      <div className="create-reviewer-header">
        <button className="back-createrev-button" onClick={handleTitleClick}>
          Back
        </button>
      </div>
      <div className="create-reviewer-content">
        {/* Display success or error messages */}
        {successMessage && (
          <div className="rev-success-message">
            {successMessage}
            <button
              className="rev-close-message-button"
              onClick={() => setSuccessMessage('')}
            >
              &times;
            </button>
          </div>
        )}
        {errorMessage && (
          <div className="rev-error-message">
            {errorMessage}
            <button
              className="rev-close-message-button"
              onClick={() => setErrorMessage('')}
            >
              &times;
            </button>
          </div>
        )}

        <form className="create-reviewer-form" onSubmit={handleSubmit}>
          <div className="create-form-group">
            <label className="rev-label-name" htmlFor="reviewerName">Reviewer Name:</label>
            <input
              type="text"
              id="reviewerName"
              placeholder="Enter the reviewer's name"
              className="input-field"
              name="name"
              value={reviewer.name}
              onChange={handleChange}
            />
          </div>

          <div className="create-form-group">
            <label className="rev-label-upload" htmlFor="uploadFile">Upload PDF File:</label>
            <input
              type="file"
              id="uploadFile"
              className="input-field"
              accept="application/pdf" required
              onChange={handleFileUpload}
              multiple
            />
              {/* <span class="upload-error-message" style="color: red; display: none;">Please upload a valid PDF file.</span> */}

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

          <div className="create-form-group">
            <label className="rev-label-description" htmlFor="description">Reviewer Description:</label>
            <input
              type="text"
              id="description"
              placeholder="Enter the reviewer's description"
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
