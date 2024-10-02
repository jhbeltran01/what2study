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

  Ticket Information: [STUD-011] Reviewer Page
  Purpose: Handles Main Reviewer Features

***********************************************************************************************************************/

import React, { useState, useEffect } from 'react'; // Importing React and hooks
import { useNavigate } from 'react-router-dom'; // Importing navigation hook from react-router-dom
import searchIcon from '@assets/search.png'; // Importing the search icon image
import '../../sass/pages/_reviewer.scss'; // Importing the stylesheet for this page

const Reviewer = () => {
  // State variables
  const [searchTerm, setSearchTerm] = useState(''); // Holds the search term
  const [reviewers, setReviewers] = useState([]); // Holds the list of reviewers
  const [dropdownIndex, setDropdownIndex] = useState(null); // Index of the dropdown menu to show
  const [showNotification, setShowNotification] = useState(false); // Controls the visibility of notifications
  const [notificationMessage, setNotificationMessage] = useState(''); // Message to show in the notification
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Controls the visibility of the delete confirmation modal
  const [deleteIndex, setDeleteIndex] = useState(null); // Index of the reviewer to delete
  const navigate = useNavigate(); // Hook for navigation

  // Effect to load stored reviewers from local storage
  useEffect(() => {
    const storedReviewers = JSON.parse(localStorage.getItem('reviewers')) || [];
    setReviewers(storedReviewers);
  }, []);

  // Handle search submission
  const handleSearchSubmit = (event) => {
    event.preventDefault(); // Prevents page reload
    console.log('Search term:', searchTerm); // Logs the search term to the console
  };

  // Navigate to create a new reviewer
  const handleCreateClick = () => {
    navigate('/reviewers/create-reviewer'); // Navigates to the create reviewer page
  };

  // Navigate back to the list of reviewers
  const handleTitleClick = () => {
    navigate('/reviewers'); // Navigates to the reviewers list page
  };

  // Navigate to view details of a specific reviewer
  const handleViewClick = (index) => {
    const reviewer = reviewers[index]; // Get the reviewer data based on index
    navigate('/reviewers/view-reviewer', { state: { reviewer } }); // Navigates to the view reviewer page with state
  };

  // Toggle the dropdown menu for a specific reviewer
  const handleMoreOptionsClick = (index) => {
    setDropdownIndex(dropdownIndex === index ? null : index); // Toggles dropdown index
  };

  // Navigate to edit a specific reviewer
  const handleEditClick = (index) => {
    const reviewer = reviewers[index]; // Get the reviewer data
    navigate('/reviewers/edit-reviewer', { state: { reviewer } }); // Navigates to the edit reviewer page
    setDropdownIndex(null); // Closes the dropdown menu
  };

  // Show delete confirmation modal
  const handleDeleteClick = (index) => {
    setDeleteIndex(index); // Sets the index of the reviewer to delete
    setShowDeleteModal(true); // Opens the delete confirmation modal
    setDropdownIndex(null); // Closes the dropdown menu
  };

  // Confirm deletion of the reviewer
  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const reviewerToDelete = reviewers[deleteIndex]; // Get the reviewer to delete
      
      // Delete from the main reviewers array
      const updatedReviewers = reviewers.filter((_, i) => i !== deleteIndex); // Remove the reviewer
      setReviewers(updatedReviewers); // Update state with the new reviewers list
      localStorage.setItem('reviewers', JSON.stringify(updatedReviewers)); // Update local storage

      // Remove from bookmarks if it exists
      const existingBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || []; // Get existing bookmarks
      const updatedBookmarks = existingBookmarks.filter(bookmark => bookmark.name !== reviewerToDelete.name); // Remove the deleted reviewer from bookmarks
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks)); // Update bookmarks in local storage

      setNotificationMessage('Successfully deleted!'); // Set success message
      setShowNotification(true); // Show the notification
      setShowDeleteModal(false); // Close the delete modal
      setDeleteIndex(null); // Reset delete index
      
      // Hide the notification after 2 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 2000);
    }
  };

  // Cancel the deletion action
  const cancelDelete = () => {
    setShowDeleteModal(false); // Close the delete modal
    setDeleteIndex(null); // Reset delete index
  };

  return (
    <section className="homepage-section p-4 flex flex-col">
      <div className="header mb-4">
        <button className="header-title" onClick={handleTitleClick}>
          My Reviewers
        </button>

        <form className="reviewer-search-container" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search..."
            className="reviewer-search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
          />
          <button type="submit" className="reviewer-search-button">
            <img src={searchIcon} alt="Search" className="reviewer-search-icon" />
          </button>
        </form>

        <button className="create-button" onClick={handleCreateClick}>
          Create
        </button>
      </div>

      <div className="reviewer-content">
        {reviewers.map((reviewer, index) => (
          <div key={index} className="reviewer-entry">
            <div className="reviewer-header">
              <h2 className="reviewer-title">{reviewer.name}</h2>
              <div className="reviewer-info">
                <span className="reviewer-type">{reviewer.type}</span>
                <span className="reviewer-date">{reviewer.date}</span>
              </div>
              <p className="reviewer-description">Description: {reviewer.description}</p>
              <button className="more-options" onClick={() => handleMoreOptionsClick(index)}>
                ⋮
              </button>
              {dropdownIndex === index && (
                <div className="dropdown-menu">
                  <button onClick={() => handleEditClick(index)}>Edit</button>
                  <button onClick={() => handleDeleteClick(index)}>Delete</button>
                </div>
              )}
            </div>
            <p className="reviewer-created-by">Created by: {reviewer.createdBy}</p>
            <button className="view-link" onClick={() => handleViewClick(index)}>
              View
            </button>
            <hr className="divider" />
          </div>
        ))}
      </div>

      {/* Toast Notification */}
      {showNotification && (
        <div className="notification-container">
          <p>{notificationMessage}</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <p>Are you sure you want to delete this reviewer?</p>
            <button className="modal-confirm-button" onClick={confirmDelete}>
              Yes
            </button>
            <button className="modal-cancel-button" onClick={cancelDelete}>
              No
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Reviewer;
