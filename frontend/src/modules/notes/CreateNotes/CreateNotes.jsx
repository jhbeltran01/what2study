import React, { useState } from 'react';
import '../../../sass/pages/_createnotes.scss';

const CreateNotes = () => {
  const [noteTitle, setNoteTitle] = useState('');
  const [noteText, setNoteText] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Subjects');

  const handleSave = (e) => {
    e.preventDefault();

    if (noteTitle.trim() && noteText.trim()) {
      const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
      const newNote = {
        title: noteTitle,
        content: noteText,
        date: new Date().toLocaleDateString(), // Save the date
      };

      savedNotes.push(newNote);
      localStorage.setItem('notes', JSON.stringify(savedNotes));
      console.log('Note saved!');

      setNoteTitle('');
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
          <input
            type="text"
            className="notepad-title"
            placeholder="Title"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
          />
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

export default CreateNotes;
