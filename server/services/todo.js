import ToDo from '../models/Todo.js';

export const getTodos = async () => {
  return ToDo.find({});
};

export const createTodo = async (todo) => {
  return ToDo.create(todo);
};
export const deleteTodo = async (todoID) => {
  return ToDo.findByIdAndRemove({ _id: todoID });
}
export const editTodo = async (todoID, todo) => {
  return ToDo.findByIdAndUpdate(todoID, { $set: todo }, { new: true })

}
export const completeTodo = async (todoID, todo) => {
  return ToDo.findByIdAndUpdate(todoID, { $set: todo }, { new: true })

}