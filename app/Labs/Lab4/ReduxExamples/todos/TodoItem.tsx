"use client";
import { ListGroupItem, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { deleteTodo, setTodo } from "./todosReducer";

export default function TodoItem({ todo }: {
  todo: { id: string; title: string };
}) {
  const dispatch = useDispatch();

  return (
    <ListGroupItem className="d-flex align-items-center">
      <span className="flex-grow-1">{todo.title}</span>
      <Button 
        onClick={() => dispatch(setTodo(todo))}
        id="wd-set-todo-click"
        variant="primary"
        size="sm"
        className="me-2"
      >
        Edit
      </Button>
      <Button 
        onClick={() => dispatch(deleteTodo(todo.id))}
        id="wd-delete-todo-click"
        variant="danger"
        size="sm"
      >
        Delete
      </Button>
    </ListGroupItem>
  );
}