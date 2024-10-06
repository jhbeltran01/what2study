import React, { useState } from 'react';
import '../../../sass/pages/_createnotes.scss';

const Create = () => {
  const [noteText, setNoteText] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Subjects');

  const handleSave = (e) => {
    e.preventDefault();

    if (noteText.trim()) {
      const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
      savedNotes.push(noteText);
      localStorage.setItem('notes', JSON.stringify(savedNotes));
      console.log('Notes saved!');

      setNoteText('');
    }
  };

  return (
    <section className="create-notes-section">
      <form onSubmit={handleSave}>
        <div className="subject-dropdown-container">
          <select
            className="subject-dropdown"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="Subjects">Subjects</option>
            {/* Add more options here as needed */}
          </select>
        </div>

        <div className="notepad">
          <textarea
            className="notepad-text"
            placeholder="Type your notes here..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
        </div>

        <button type="submit" className="save-button">
          Save
        </button>
      </form>
    </section>
  );
};

export default Create;
