import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateNotes = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleCreateClick = () => {
    const newNote = {
      title,
      content,
      date: new Date().toLocaleDateString(),
    };

    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push(newNote);
    localStorage.setItem('notes', JSON.stringify(notes));

    navigate('/notes');
  };

  return (
    <section className="create-notes">
      <div className="create-note-container">

        <div className="note-content">
          <form className="note-form">
            <div className="form-group note-form-group">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                placeholder="Enter note title"
                className="note-input-field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="form-group note-form-group">
              <label htmlFor="content">Content:</label>
              <textarea
                id="content"
                placeholder="Enter note content"
                className="note-input-field"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div className="create-note-button-container">
              <button type="button" className="note-create-button" onClick={handleCreateClick}>
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CreateNotes;
