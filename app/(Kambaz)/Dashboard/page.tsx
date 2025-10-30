"use client";

import { useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import * as db from "../Database";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  CardImg,
  Button,
  Row,
  Col,
  FormControl,
} from "react-bootstrap";
import { addNewCourse, deleteCourse, updateCourse } from "../Courses/reducer";
import { enrollCourse, unenrollCourse } from "../Courses/Enrollments/reducer";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { courses } = useSelector((state: any) => state.coursesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments } = useSelector((s: any) => s.enrollmentsReducer);
  const [showAll, setShowAll] = useState(false);

  const [course, setCourse] = useState<any>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description",
  });

  if (!currentUser) return <div id="wd-dashboard">Please sign in to view your courses.</div>;

  const myEnrollments = enrollments.filter((e: any) => e.user === currentUser._id);
  const isEnrolled = (cid: string) => myEnrollments.some((e: any) => e.course === cid);
  const visibleCourses = showAll ? courses : courses.filter((c: any) => isEnrolled(c._id));

  return (
    <div id="wd-dashboard" className="p-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1 id="wd-dashboard-title" className="m-0">Dashboard</h1>
        <Button
          variant={showAll ? "secondary" : "primary"}
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show Enrolled Courses" : "Show All Courses"}
        </Button>
      </div>
      <hr />

      <h5 className="mb-3">
        New Course
        <button
          className="btn btn-warning float-end ms-2"
          id="wd-update-course-click"
          onClick={() => dispatch(updateCourse(course))}
        >
          Update
        </button>
        <button
          className="btn btn-primary float-end"
          id="wd-add-new-course-click"
          onClick={() => dispatch(addNewCourse(course))}
        >
          Add
        </button>
      </h5>

      <FormControl
        className="mb-2"
        value={course.name}
        placeholder="Course title"
        onChange={(e) => setCourse({ ...course, name: e.target.value })}
      />
      <FormControl
        as="textarea"
        rows={3}
        className="mb-3"
        value={course.description}
        placeholder="Course description"
        onChange={(e) => setCourse({ ...course, description: e.target.value })}
      />
      <hr />

      <h2 id="wd-dashboard-published">Published Courses ({visibleCourses.length})</h2>
      <hr />

      <Row xs={1} md={5} className="g-4">
        {visibleCourses.map((c: any) => (
          <Col key={c._id} className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link
                href={`/Courses/${c._id}/Home`}
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <CardImg src={c.image || "/images/reactjs.jpg"} variant="top" width="100%" height={160} />
                <CardBody className="card-body">
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    {c.name}
                  </CardTitle>
                  <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                    {c.description}
                  </CardText>

                  <div className="d-flex justify-content-between align-items-center">
                    <Button variant="primary">Go</Button>
                    <div className="d-flex gap-2">
                      <Button
                        className="btn btn-warning"
                        onClick={(e) => { e.preventDefault(); setCourse(c); }}
                      >
                        Edit
                      </Button>
                      <Button
                        className="btn btn-danger"
                        onClick={(e) => { e.preventDefault(); dispatch(deleteCourse(c._id)); }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end mt-2">
                    {isEnrolled(c._id) ? (
                      <Button
                        variant="danger"
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(unenrollCourse({ user: currentUser._id, course: c._id }));
                        }}
                      >
                        Unenroll
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(enrollCourse({ user: currentUser._id, course: c._id }));
                        }}
                      >
                        Enroll
                      </Button>
                    )}
                  </div>
                </CardBody>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}