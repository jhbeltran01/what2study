export default {
  setTodos: (state, action) => {
    state.value = action.payload
  },
  addTodoItem: (state, action) => {
    const { todoSlug, todoItem } = action.payload

    state.value = state.value.map(iTodo => {
      console.log(iTodo.slug, todoSlug)
      if (iTodo.slug != todoSlug) { return iTodo }

      iTodo.items = [todoItem, ...iTodo.items]
      console.log(iTodo.items)
      return iTodo
    })
  },
  deleteTodoItem: (state, action) => {
    const { todoSlug, todoItemSlug } = action.payload

    state.value = state.value.map(iTodo => {
      if (iTodo.slug != todoSlug) { return iTodo }
      
      iTodo.items = iTodo.items.filter(
        item => item.slug != todoItemSlug
      )

      return iTodo
    })
  },
  todosUpdateTodoItem: (state, action) => {
    const { todoSlug, todoItem } = action.payload

    state.value = state.value.map(iTodo => {
      if (iTodo.slug != todoSlug) { return iTodo }
      
      iTodo.items = iTodo.items.map(item => {
        if (item.slug != todoItem.slug) { return item } 
        return todoItem
      })

      return iTodo
    })
  }
}