import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import { apiRootURL } from '@root/globals';
import { useDispatch, useSelector } from 'react-redux';
import { updateTodoItem, removeTodoItem } from '@redux/todo';
import { deleteTodoItem, todosUpdateTodoItem } from '@redux/todos';

function TodoItem({ todoItem }) {
  const todo = useSelector(state => state.todo.value)
  const [showOptions, setShowOptions] = useState(false);
  const [willEditTodoItem, setWillEditTodoItem] = useState(false)
  const [todoItemText, setTodoItemText] = useState(todoItem.text)
  const [isDone, setIsDone] = useState(todoItem.is_done)
  const optionsRef = useRef(null);
  const todoItemRef = useRef(null);
  const todoItemInputRef = useRef(null)
  const dispatch = useDispatch()

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

  const performUpdateTodoItem = (e, done=isDone) => {
    axios
      .patch(
        `${apiRootURL}/todos/${todo.slug}/${todoItem.slug}/`,
        {
          text: todoItemText,
          is_done: done,
        }
      )
      .then(response => {
        console.log(response.data)
        dispatch(updateTodoItem(response.data))
        dispatch(todosUpdateTodoItem({
          todoSlug: todo.slug,
          todoItem: response.data,
        }))
        setWillEditTodoItem(false)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const markTodoAsDone = () => {
    setIsDone(true)
    performUpdateTodoItem(null, true)
  }

  const peformDeleteTodoItem = () => {
    axios
      .delete(`${apiRootURL}/todos/${todo.slug}/${todoItem.slug}/`)
      .then(response => {
        dispatch(removeTodoItem(todoItem.slug))
        dispatch(deleteTodoItem({
          todoSlug: todo.slug,
          todoItemSlug: todoItem.slug,
        }))
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <div ref={todoItemRef} className={`todo-item ${isDone && 'done'}`}>
      {
        !willEditTodoItem
        ? <p>{todoItem.text}</p>
        : <input 
            className='todo-item-edit-field'
            autoFocus="autofocus"
            type="text" 
            value={todoItemText} 
            ref={todoItemInputRef}
            onChange={(e) => setTodoItemText(e.target.value)}
            onBlur={performUpdateTodoItem}
          />
      }
      <div className="options-toggle" onClick={toggleOptions}>⋮</div>

      {showOptions && (
        <div ref={optionsRef} className="options">
          <button 
            onClick={() => setWillEditTodoItem(true)}
          >
            Edit
          </button>
          <button
            onClick={markTodoAsDone}
          >
            Done
          </button>
          <button
            onClick={peformDeleteTodoItem}
          >
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