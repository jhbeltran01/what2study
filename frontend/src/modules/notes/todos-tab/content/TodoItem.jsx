import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';

function TodoItem({ todoItem }) {
  const [showOptions, setShowOptions] = useState(false);

  const optionsRef = useRef(null);
  const todoItemRef = useRef(null);

  const toggleOptions = () => setShowOptions(!showOptions);

  const handleClickOutside = (event) => {
    if (
      todoItemRef.current && !todoItemRef.current.contains(event.target) &&
      optionsRef.current && !optionsRef.current.contains(event.target)
    ) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={todoItemRef} className="todo-item">
      <p>{todoItem.text}</p>
      <div className="options-toggle" onClick={toggleOptions}>⋮</div>

      {showOptions && (
        <div ref={optionsRef} className="options">
          <button>Edit</button>
          <button>Done</button>
          <button>Delete</button>
        </div>
      )}
    </div>
  );
}

TodoItem.propTypes = {
  todoItem: PropTypes.shape({
    text: PropTypes.string.isRequired
  })
};

export default TodoItem;