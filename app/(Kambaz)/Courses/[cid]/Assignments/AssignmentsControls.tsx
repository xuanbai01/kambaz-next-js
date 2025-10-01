"use client";

import { Button, Form, InputGroup } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

export default function AssignmentsControls() {
  return (
    <div id="wd-assignments-controls" className="d-flex justify-content-between align-items-center mb-4">
      <InputGroup style={{ width: "300px" }}>
        <InputGroup.Text className="bg-white">
          <FaSearch />
        </InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Search for Assignment"
          id="wd-search-assignment"
        />
      </InputGroup>

      <div>
        <Button variant="secondary" size="lg" className="me-2" id="wd-add-group-btn">
          <FaPlus className="me-2" />
          Group
        </Button>
        <Button variant="danger" size="lg" id="wd-add-assignment-btn">
          <FaPlus className="me-2" />
          Assignment
        </Button>
      </div>
    </div>
  );
}