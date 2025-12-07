"use client";

import { useState } from "react";
import { Card, Row, Col, Form, ListGroup, Badge } from "react-bootstrap";

type Message = {
  id: string;
  from: string;
  subject: string;
  course: string;
  date: string;
  unread: boolean;
};

const SAMPLE_MESSAGES: Message[] = [
  {
    id: "1",
    from: "Professor Smith",
    subject: "Welcome to the course!",
    course: "RS101",
    date: "2025-09-01 09:15",
    unread: false,
  },
  {
    id: "2",
    from: "TA Johnson",
    subject: "Quiz 1 released",
    course: "RS101",
    date: "2025-09-03 14:30",
    unread: true,
  },
  {
    id: "3",
    from: "System",
    subject: "Assignment 2 due tomorrow",
    course: "CS4550",
    date: "2025-09-10 18:00",
    unread: true,
  },
];

export default function InboxPage() {
  const [search, setSearch] = useState("");

  const filtered = SAMPLE_MESSAGES.filter(
    (m) =>
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.from.toLowerCase().includes(search.toLowerCase()) ||
      m.course.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-3">
      <h3 className="mb-3">Inbox</h3>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            placeholder="Search by subject, sender, or course"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
      </Row>

      <Card>
        <Card.Header>Conversations</Card.Header>
        <ListGroup variant="flush">
          {filtered.map((m) => (
            <ListGroup.Item
              key={m.id}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <div className="fw-semibold">
                  {m.subject}{" "}
                  {m.unread && (
                    <Badge bg="primary" pill>
                      Unread
                    </Badge>
                  )}
                </div>
                <div className="text-muted small">
                  From {m.from} · {m.course}
                </div>
              </div>
              <div className="text-muted small">{m.date}</div>
            </ListGroup.Item>
          ))}
          {filtered.length === 0 && (
            <ListGroup.Item className="text-muted">
              No conversations match your search.
            </ListGroup.Item>
          )}
        </ListGroup>
      </Card>
    </div>
  );
}
