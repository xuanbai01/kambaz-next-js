"use client";
import { ListGroupItem, Button, FormControl } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, updateTodo, setTodo } from "./todosReducer";

export default function TodoForm() {
  const { todo } = useSelector((state: any) => state.todosReducer);
  const dispatch = useDispatch();

  return (
    <ListGroupItem className="d-flex gap-2">
      <FormControl 
        value={todo.title}
        onChange={(e) => dispatch(setTodo({ ...todo, title: e.target.value }))}
        className="flex-grow-1"
      />
      <Button 
        onClick={() => dispatch(updateTodo(todo))}
        id="wd-update-todo-click"
        variant="warning"
      >
        Update
      </Button>
      <Button 
        onClick={() => dispatch(addTodo(todo))}
        id="wd-add-todo-click"
        variant="success"
      >
        Add
      </Button>
    </ListGroupItem>
  );
}