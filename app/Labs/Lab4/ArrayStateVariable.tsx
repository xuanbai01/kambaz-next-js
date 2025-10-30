"use client";
import { useState } from "react";
import { Button, ListGroup, ListGroupItem, Card } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function ArrayStateVariable() {
  const [array, setArray] = useState([1, 2, 3, 4, 5]);
  const { todos } = useSelector((state: any) => state.todosReducer);
  
  const addElement = () => {
    setArray([...array, Math.floor(Math.random() * 100)]);
  };
  
  const deleteElement = (index: number) => {
    setArray(array.filter((item, i) => i !== index));
  };
  
  return (
    <div id="wd-array-state-variables">
      <Card style={{ width: '300px' }}>
        <Card.Body>
          <Card.Title>Array State Variable</Card.Title>
          <Button 
            onClick={addElement}
            variant="success"
            className="mb-3"
          >
            Add Element
          </Button>
          <ListGroup>
            {array.map((item, index) => (
              <ListGroupItem 
                key={index}
                className="d-flex justify-content-between align-items-center"
              >
                <span>{item}</span>
                <Button 
                  onClick={() => deleteElement(index)}
                  variant="danger"
                  size="sm"
                >
                  Delete
                </Button>
              </ListGroupItem>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>

      <h3 className="mt-3">Todos from Redux</h3>
      <ListGroup style={{ width: '300px' }}>
        {todos.map((todo: any) => (
          <ListGroupItem key={todo.id}>
            {todo.title}
          </ListGroupItem>
        ))}
      </ListGroup>
      <hr/>
    </div>
  );
}