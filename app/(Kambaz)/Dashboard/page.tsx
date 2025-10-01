"use client";

import Link from "next/link";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  CardImg,
  Button,
  Row,
  Col,
} from "react-bootstrap";

export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      <h2 id="wd-dashboard-published">Published Courses (7)</h2>
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          <Col className="wd-dashboard-course" style={{ width: "270px" }}>
            <Card>
              <Link
                href="/Courses/1234/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <CardImg
                  variant="top"
                  src="/images/reactjs.jpg"
                  style={{ height: "160px" }}
                />
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title">
                    CS1234 React JS
                  </CardTitle>
                  <CardText className="wd-dashboard-course-title">
                    Full Stack software developer
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>

          <Col className="wd-dashboard-course" style={{ width: "270px" }}>
            <Card>
              <Link
                href="/Courses/1234/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <CardImg
                  variant="top"
                  src="/images/reactjs.jpg"
                  style={{ height: "160px" }}
                />
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title">
                    CS 5010 Programming Design Paradigms
                  </CardTitle>
                  <CardText className="wd-dashboard-course-title">
                    Programming Foundations & Paradigms
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>

          <Col className="wd-dashboard-course" style={{ width: "270px" }}>
            <Card>
              <Link
                href="/Courses/1234/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <CardImg
                  variant="top"
                  src="/images/reactjs.jpg"
                  style={{ height: "160px" }}
                />
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title">
                    CS 5800 Algorithms
                  </CardTitle>
                  <CardText className="wd-dashboard-course-title">
                    Algorithm Design & Analysis
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>

          <Col className="wd-dashboard-course" style={{ width: "270px" }}>
            <Card>
              <Link
                href="/Courses/1234/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <CardImg
                  variant="top"
                  src="/images/reactjs.jpg"
                  style={{ height: "160px" }}
                />
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title">
                    CS 5500 Foundations of Software Engineering
                  </CardTitle>
                  <CardText className="wd-dashboard-course-title">
                    Systems & Software Breadth
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>

          <Col className="wd-dashboard-course" style={{ width: "270px" }}>
            <Card>
              <Link
                href="/Courses/1234/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <CardImg
                  variant="top"
                  src="/images/reactjs.jpg"
                  style={{ height: "160px" }}
                />
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title">
                    CS 5600 Computer Systems
                  </CardTitle>
                  <CardText className="wd-dashboard-course-title">
                    Systems & Software breadth
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>

          <Col className="wd-dashboard-course" style={{ width: "270px" }}>
            <Card>
              <Link
                href="/Courses/1234/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <CardImg
                  variant="top"
                  src="/images/reactjs.jpg"
                  style={{ height: "160px" }}
                />
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title">
                    CS 5610 Web Development
                  </CardTitle>
                  <CardText className="wd-dashboard-course-title">
                    Systems & Software breadth
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>

          <Col className="wd-dashboard-course" style={{ width: "270px" }}>
            <Card>
              <Link
                href="/Courses/1234/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <CardImg
                  variant="top"
                  src="/images/reactjs.jpg"
                  style={{ height: "160px" }}
                />
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title">
                    CS 5100 Foundations of Artificial Intelligence
                  </CardTitle>
                  <CardText className="wd-dashboard-course-title">
                    AI & Data Science breadth
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}