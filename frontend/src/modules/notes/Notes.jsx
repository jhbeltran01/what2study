import searchIcon from '@assets/search.png';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../../sass/pages/_notes.scss';

const Notes = () => {
  const [active, setActive] = useState('notes');
  const [searchTerm, setSearchTerm] = useState('');
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    setNotes(storedNotes);
    setFilteredNotes(storedNotes);
  }, []);

  const handleClick = (section) => {
    setActive(section);
    navigate(`/notes/${section}`);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    if (searchTerm.trim() === '') {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter(note =>
        note.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNotes(filtered);
    }
  };

  const handleCreateClick = () => {
    navigate('/notes/create-notes');
  };

  const renderRows = () => {
    const rows = [];
    let noteIndex = 0;
  
    while (noteIndex < filteredNotes.length) {
      const currentRow = [];
      const rowCount = rows.length % 2 === 0 ? 5 : 4;
  
      for (let j = 0; j < rowCount && noteIndex < filteredNotes.length; j++, noteIndex++) {
        const note = filteredNotes[noteIndex];
        currentRow.push(
          <div key={noteIndex} className="note-card">
            <h3>{note.title}</h3>  {/* Display title */}
            <p>{note.content}</p>  {/* Display content */}
            <small>{note.date}</small>  {/* Display date */}
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
    <section className="homepage-section p-4 flex flex-col">
      <div className="header mb-4 flex justify-between items-center">
        <div className="header-buttons">
          <button
            onClick={() => handleClick('notes')}
            className={active === 'notes' ? 'active' : ''}
          >
            Notes
          </button>
          <button
            onClick={() => handleClick('todo')}
            className={active === 'todo' ? 'active' : ''}
          >
            To-Do
          </button>
        </div>

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

      <div className="notes-list">
        {filteredNotes.length > 0 ? renderRows() : <p>No notes available</p>}
      </div>
    </section>
  );
};

export default Notes;