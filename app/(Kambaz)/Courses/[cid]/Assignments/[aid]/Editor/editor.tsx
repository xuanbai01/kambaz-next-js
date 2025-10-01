"use client";

import { Form, Button, Row, Col } from "react-bootstrap";

export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor" className="p-3">
      <Form>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-name">Assignment Name</Form.Label>
          <Form.Control 
            type="text" 
            id="wd-name" 
            defaultValue="A1 - ENV + HTML" 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            id="wd-description"
            rows={10}
            defaultValue="The assignment is available online Submit a link to the landing page of your Web application running on Netlify. The landing page should include the following: Your full name and section Links to each of the lab assignments Link to the Kanbas application Links to all relevant source code repositories The Kanbas application should include a link to navigate back to the landing page."
          />
        </Form.Group>

        <Row className="mb-3">
          <Form.Label column sm={3} className="text-end">
            Points
          </Form.Label>
          <Col sm={9}>
            <Form.Control 
              type="number" 
              id="wd-points" 
              defaultValue={100} 
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Label column sm={3} className="text-end">
            Assignment Group
          </Form.Label>
          <Col sm={9}>
            <Form.Select id="wd-group">
              <option value="ASSIGNMENTS">ASSIGNMENTS</option>
            </Form.Select>
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Label column sm={3} className="text-end">
            Display Grade as
          </Form.Label>
          <Col sm={9}>
            <Form.Select id="wd-display-grade-as">
              <option value="Percentage">Percentage</option>
            </Form.Select>
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Label column sm={3} className="text-end">
            Submission Type
          </Form.Label>
          <Col sm={9}>
            <Form.Select id="wd-submission-type" className="mb-3">
              <option value="Online">Online</option>
            </Form.Select>

            <div className="border p-3">
              <Form.Label className="fw-bold">Online Entry Options</Form.Label>
              
              <Form.Check
                type="checkbox"
                id="wd-text-entry"
                name="wd-text-entry"
                label="Text Entry"
                className="mb-2"
              />
              
              <Form.Check
                type="checkbox"
                id="wd-website-url"
                name="wd-website-url"
                label="Website URL"
                className="mb-2"
              />
              
              <Form.Check
                type="checkbox"
                id="wd-media-recordings"
                name="wd-media-recordings"
                label="Media Recordings"
                className="mb-2"
              />
              
              <Form.Check
                type="checkbox"
                id="wd-student-annotation"
                name="wd-student-annotation"
                label="Student Annotation"
                className="mb-2"
              />
              
              <Form.Check
                type="checkbox"
                id="wd-file-upload"
                name="wd-file-upload"
                label="File Uploads"
              />
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Label column sm={3} className="text-end">
            Assign
          </Form.Label>
          <Col sm={9}>
            <div className="border p-3">
              <Form.Label className="fw-bold">Assign to</Form.Label>
              <Form.Control 
                type="text" 
                id="wd-assign-to" 
                defaultValue="Everyone"
                className="mb-3"
              />

              <Form.Label htmlFor="wd-due-date" className="fw-bold">Due</Form.Label>
              <Form.Control
                type="date"
                id="wd-due-date"
                defaultValue="2024-05-13"
                className="mb-3"
              />

              <Row>
                <Col>
                  <Form.Label htmlFor="wd-available-from" className="fw-bold">
                    Available from
                  </Form.Label>
                  <Form.Control
                    type="date"
                    id="wd-available-from"
                    defaultValue="2024-05-06"
                  />
                </Col>
                <Col>
                  <Form.Label htmlFor="wd-available-until" className="fw-bold">
                    Until
                  </Form.Label>
                  <Form.Control
                    type="date"
                    id="wd-available-until"
                    defaultValue="2024-05-20"
                  />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <hr />

        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" size="lg">
            Cancel
          </Button>
          <Button variant="danger" size="lg">
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}