import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { apiRootURL } from '@root/globals';

function TodoItem({ todoItem }) {
  const [showOptions, setShowOptions] = useState(false);

  const optionsRef = useRef(null);
  const todoItemRef = useRef(null);

  const toggleOptions = () => setShowOptions(!showOptions);

  const handleDelete = async () => {
    const confirmed = window.confirm(`Are you sure you want to delete?`);
    if (confirmed) {
        try {
            const response = await axios.delete(`${apiRootURL}/todos/items/${todoItem.slug}/`);
            if (response) {
                alert("Todo Deleted successfully deleted.");
                location.reload()
            } else {
                alert("Failed to delete the Todo.");
            }
        } catch (error) {
            console.error("Error deleting todo:", error);
            alert("An error occurred while trying to delete the todo");
        }
      setShowOptions(false);
    }
};
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
          <button onClick={handleDelete}>
              Done
          </button>
          <button onClick={handleDelete}>
              Delete
          </button>
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