"use client";

import { Card, Row, Col, ListGroup, Form } from "react-bootstrap";
import { useState } from "react";

type CalendarItem = {
  id: string;
  title: string;
  course: string;
  type: "QUIZ" | "ASSIGNMENT" | "CLASS";
  dateTime: string; // display string
};

const ITEMS: CalendarItem[] = [
  {
    id: "1",
    title: "Q1 - HTML",
    course: "CS4550 01 FA23",
    type: "QUIZ",
    dateTime: "2025-09-21 13:00",
  },
  {
    id: "2",
    title: "Assignment 2 - Flexbox",
    course: "CS4550 01 FA23",
    type: "ASSIGNMENT",
    dateTime: "2025-09-25 23:59",
  },
  {
    id: "3",
    title: "EXAM 1",
    course: "CS4550 01 FA23",
    type: "QUIZ",
    dateTime: "2025-10-26 17:30",
  },
];

export default function CalendarPage() {
  const [courseFilter, setCourseFilter] = useState<string>("ALL");

  const courses = Array.from(new Set(ITEMS.map((i) => i.course)));

  const filtered = ITEMS.filter(
    (item) => courseFilter === "ALL" || item.course === courseFilter
  );

  return (
    <div className="p-3">
      <h3 className="mb-3">Calendar</h3>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            <option value="ALL">All Courses</option>
            {courses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <Card>
        <Card.Header>Upcoming Events</Card.Header>
        <ListGroup variant="flush">
          {filtered.map((item) => (
            <ListGroup.Item
              key={item.id}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <div className="fw-semibold">{item.title}</div>
                <div className="text-muted small">
                  {item.course} · {item.type}
                </div>
              </div>
              <div className="text-muted small">{item.dateTime}</div>
            </ListGroup.Item>
          ))}
          {filtered.length === 0 && (
            <ListGroup.Item className="text-muted">
              No events for this filter.
            </ListGroup.Item>
          )}
        </ListGroup>
      </Card>
    </div>
  );
}
