import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiRootURL } from '@root/globals';
import { updateTodo, setTodo } from '@redux/todo';
import { setTodos } from '@redux/todos';

function ToDo() {
  const todo = useSelector(state => state.todo.value);
  const todos = useSelector(state => state.todos.value);
  const dispatch = useDispatch();
  const [contentInputText, setContentInputText] = useState(todo.content);

  // Handle the back button click
  const handleTitleClick = () => {
    // You can modify this function to navigate to a different page or any other behavior
    // For example, navigating back to the previous page:
    window.history.back();
  };

  const editContent = (event) => {
    const content = event.target.value;

    axios
      .patch(`${apiRootURL}/todos/${todo.slug}/`, { content })
      .then((response) => {
        dispatch(updateTodo(response.data));
        updateTodos(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateTodos = (newTodo) => {
    const tempTodos = todos.map((todo) => {
      if (todo.slug !== newTodo.slug) {
        return todo;
      }
      return newTodo;
    });

    dispatch(setTodos(tempTodos));
  };

  const getTodo = (event) => {
    const selectedTodoSlug = event.target.value;
    const selectedTodo = todos.filter((todo) => todo.slug === selectedTodoSlug)[0];

    dispatch(setTodo(selectedTodo));
    setContentInputText(selectedTodo.content);
  };

  return (
    <div>
      <button className="back-notes-button" onClick={handleTitleClick}>
        Back
      </button>
      <div className="container-content">
        <div>
          <select
            defaultValue={todo.slug}
            onChange={getTodo}
            className="notes-dropdown"
          >
            {todos.map((todo) => (
              <option value={todo.slug} key={todo.slug}>
                {todo.name}
              </option>
            ))}
          </select>

          <form>
            <textarea
              rows={10}
              onBlur={editContent}
              value={contentInputText}
              onChange={(e) => setContentInputText(e.target.value)}
              className="input-content"
            ></textarea>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ToDo;
