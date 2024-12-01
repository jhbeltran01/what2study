import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { apiRootURL } from '@root/globals';
import Form from './Form';
import { useDispatch, useSelector } from 'react-redux';
import { setNote } from '@redux/note';
import { setNotes } from '@redux/notes';
import { useNavigate } from 'react-router-dom';
import { NOTE_CONTENT } from '@root/routes/constants';

export const ShowFormContext = createContext();

function Main() {
  const notes = useSelector(state => state.notes.value);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${apiRootURL}/notes/`)
      .then(response => {
        dispatch(setNotes(response.data.results));
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const redirectToNoteContent = (note) => {
    dispatch(setNote(note));
    navigate(NOTE_CONTENT);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDeleteNote = async (noteSlug) => {
    const confirmed = window.confirm('Are you sure you want to delete this note?');
    if (confirmed) {
      try {
        await axios.delete(`${apiRootURL}/notes/${noteSlug}/`);
        alert('Note deleted successfully.');
        const response = await axios.get(`${apiRootURL}/notes/`); // Fetch updated list of notes
        dispatch(setNotes(response.data.results));
      } catch (error) {
        console.error('Error deleting note:', error);
        alert('An error occurred while trying to delete the note.');
      }
    }
  };

  const filteredNotes = notes.filter(note =>
    note.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderRows = () => {
    const rows = [];
    let noteIndex = 0;
    while (noteIndex < filteredNotes.length) {
      const currentRow = [];
      const rowCount = rows.length % 2 === 0 ? 5 : 4;

      for (let j = 0; j < rowCount && noteIndex < filteredNotes.length; j++, noteIndex++) {
        const note = filteredNotes[noteIndex];
        currentRow.push(
          <div 
            key={noteIndex} 
            id={`note-${note.id}`}  
            className={`note-card-container ${isDeleteMode ? 'wiggle' : ''}`} 
          >
            <div className="note-card">
              <button
                className="note-card-button"
                onClick={() => redirectToNoteContent(note)} 
              >
                <h3>{note.name}</h3>  {/* Display title */}
              </button>
              {isDeleteMode && (
                <button 
                  onClick={() => handleDeleteNote(note.slug)}  // Using note.slug to delete
                  className="delete-note-icon"
                >
                  🗑️ 
                </button>
              )}
            </div>
          </div>
        );
      }
  
      rows.push(
        <div key={rows.length} className="notes-row">
          {currentRow}
        </div>
      );
    }
    return rows;
  };

  return (
    <ShowFormContext.Provider value={[showForm, setShowForm]}>
      <div>
        <div className="flex">
          <input 
            type="text" 
            value={searchQuery}
            onChange={handleSearch} 
            placeholder="Search..." 
            className="search-bar2"
          />
          <div className="flex gap-2">
            {!isDeleteMode && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-add"
              >
                Add
              </button>
            )}

            {!isDeleteMode && (
              <button
                onClick={() => setIsDeleteMode(true)}
                className="btn-delete"
              >
                Delete
              </button>
            )}
            {isDeleteMode && (
              <button
                onClick={() => setIsDeleteMode(false)}
                className="btn-cancel"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="notes-list">
          {filteredNotes.length > 0 ? renderRows() : <p>Hey there! Looks like you don't have any notes yet. Start adding some!</p>}
        </div>

        {showForm && <Form />}
      </div>
    </ShowFormContext.Provider>
  );
}

export default Main;