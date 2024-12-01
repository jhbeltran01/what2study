export default {
  setTodo: (state, action) => {
    state.value = action.payload
  },
  updateTodoItem: (state, action) => {
    const todoItem = action.payload;
    state.value.items = state.value.items.map(item => {
      if (item.slug != todoItem.slug) { return item }
      return todoItem
    })
  },
  removeTodoItem: (state, action) => {
    const itemSlug = action.payload;
    state.value.items = state.value.items.filter(
      item => item.slug != itemSlug
    )
  },
  addNewTodoItem: (state, action) => {
    const newTodoItem = action.payload
    state.value.items = [newTodoItem, ...state.value.items]
  }
}