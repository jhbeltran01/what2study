import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../sass/pages/_notes.scss';
import searchIcon from '../../assets/search.png';

const Notes = () => {
  const [active, setActive] = useState('my-notes');
  const [searchTerm, setSearchTerm] = useState('');
  const [myNotes, setMyNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    setMyNotes(storedNotes);
  }, []);

  const handleClick = (tab) => {
    setActive(tab);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Search Term:', searchTerm);
  };

  const handleCreateNote = () => {
    navigate('/notes/create-notes');
  };

  const renderHexagonRows = () => {
    const rowPattern = [5, 4];  // Pattern of 5, 4 hexagons per row
    let rowIndex = 0;
    let noteIndex = 0;
    const rows = [];
  
    while (noteIndex < myNotes.length) {
      const hexagonsInRow = rowPattern[rowIndex % rowPattern.length];
      
      // For the first row, include the "Create" hexagon first
      if (rowIndex === 0) {
        rows.push(
          <div key={rowIndex} className="hexagon-row">
            <div className="hexagon create-note" onClick={handleCreateNote}>
              <div className="hexagon-plus">+</div>
              <div className="hexagon-create-text">Create</div>
            </div>
            {myNotes.slice(noteIndex, noteIndex + hexagonsInRow - 1).map((note, index) => (
              <div key={index} className="hexagon">
                {note.title}
              </div>
            ))}
          </div>
        );
        noteIndex += hexagonsInRow - 1; // Subtract 1 because the "Create" button occupies the first spot
      } else {
        const notesForRow = myNotes.slice(noteIndex, noteIndex + hexagonsInRow);
        rows.push(
          <div key={rowIndex} className={`hexagon-row ${rowIndex % 2 === 1 ? 'hexagon-row--offset' : ''}`}>
            {notesForRow.map((note, index) => (
              <div key={index} className="hexagon">
                {note.title}
              </div>
            ))}
          </div>
        );
        noteIndex += hexagonsInRow;
      }
  
      rowIndex++;
    }
  
    return rows;
  };
  

  return (
    <section className="note-section p-4 flex flex-col">
      <div className="header mb-4 flex justify-between items-center">
        <div className="header-buttons">
          <button
            onClick={() => handleClick('my-notes')}
            className={active === 'my-notes' ? 'active header-button' : 'header-button'}
          >
            My Notes
          </button>
          <button
            onClick={() => handleClick('to-do')}
            className={active === 'to-do' ? 'active header-button' : 'header-button'}
          >
            To Do
          </button>
        </div>

        <form className="notes-search-container" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search..."
            className="notes-search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="notes-search-button">
            <img src={searchIcon} alt="Search" className="notes-search-icon" />
          </button>
        </form>
      </div>

      <div className="hexagon-container">
        <div className="hexagon-row">
          <div className="hexagon create-note" onClick={handleCreateNote}>
            <div className="hexagon-plus">+</div>
            <div className="hexagon-create-text">Create</div>
          </div>
        </div>
        {renderHexagonRows()}
      </div>
    </section>
  );
};

export default Notes;
