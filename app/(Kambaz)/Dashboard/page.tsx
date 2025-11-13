"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import * as client from "../Courses/client";
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
import { setCourses } from "../Courses/reducer";
import {
  setEnrollments,
  addEnrollment,
  removeEnrollment,
} from "../Courses/Enrollments/reducer";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { courses } = useSelector((state: any) => state.coursesReducer); // my courses
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments } = useSelector((s: any) => s.enrollmentsReducer);

  const [allCourses, setAllCourses] = useState<any[]>([]); // catalog
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

  // ---------- helpers (define BEFORE useEffect) ----------

  const loadAllCourses = async () => {
    const list = await client.findAllCourses();
    setAllCourses(list);
  };

  const loadMyCourses = async () => {
    if (!currentUser) return;
    const mine = await client.findMyCourses();
    dispatch(setCourses(mine));
  };

  const loadMyEnrollments = async () => {
    if (!currentUser) return;
    const rows = await client.getMyEnrollments();
    dispatch(setEnrollments(rows));
  };

  const myEnrollments = useMemo(
    () => enrollments.filter((e: any) => e.user === currentUser?._id),
    [enrollments, currentUser]
  );
  const isEnrolled = (cid: string) =>
    myEnrollments.some((e: any) => e.course === cid);

  const visibleCourses = showAll ? allCourses : courses;

  const onAddNewCourse = async () => {
    const newCourse = await client.createCourse(course);
    setAllCourses((prev) => [...prev, newCourse]);
    // optionally: await loadMyCourses();
  };

  const onDeleteCourse = async (courseId: string) => {
    await client.deleteCourse(courseId);
    setAllCourses((prev) => prev.filter((c) => c._id !== courseId));
    dispatch(setCourses(courses.filter((c: any) => c._id !== courseId)));
  };

  const onUpdateCourse = async () => {
    await client.updateCourse(course);
    setAllCourses((prev) =>
      prev.map((c) => (c._id === course._id ? course : c))
    );
    dispatch(
      setCourses(courses.map((c: any) => (c._id === course._id ? course : c)))
    );
  };

  const onEnroll = async (courseId: string) => {
    const row = await client.enrollInCourse(courseId);
    if (row && row._id) {
      dispatch(addEnrollment(row));
      await loadMyCourses();
    }
  };

  const onUnenroll = async (courseId: string) => {
    await client.unenrollFromCourse(courseId);
    if (!currentUser) return;
    dispatch(removeEnrollment({ user: currentUser._id, course: courseId }));
    await loadMyCourses();
  };

  // ---------- effects ----------

  useEffect(() => {
    loadAllCourses();
  }, []);

  useEffect(() => {
    loadMyCourses();
    loadMyEnrollments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  if (!currentUser)
    return <div id="wd-dashboard">Please sign in to view your courses.</div>;

  // ---------- render ----------

  return (
    <div id="wd-dashboard" className="p-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1 id="wd-dashboard-title" className="m-0">
          Dashboard
        </h1>
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
          onClick={onUpdateCourse}
        >
          Update
        </button>
        <button
          className="btn btn-primary float-end"
          id="wd-add-new-course-click"
          onClick={onAddNewCourse}
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
        onChange={(e) =>
          setCourse({ ...course, description: e.target.value })
        }
      />
      <hr />

      <h2 id="wd-dashboard-published">
        {showAll
          ? `All Courses (${allCourses.length})`
          : `Enrolled Courses (${courses.length})`}
      </h2>
      <hr />

      <Row xs={1} md={5} className="g-4">
        {visibleCourses.map((c: any) => (
          <Col
            key={c._id}
            className="wd-dashboard-course"
            style={{ width: "300px" }}
          >
            <Card>
              <Link
                href={`/Courses/${c._id}/Home`}
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <CardImg
                  src={c.image || "/images/reactjs.jpg"}
                  variant="top"
                  width="100%"
                  height={160}
                />
                <CardBody className="card-body">
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    {c.name}
                  </CardTitle>
                  <CardText
                    className="wd-dashboard-course-description overflow-hidden"
                    style={{ height: "100px" }}
                  >
                    {c.description}
                  </CardText>

                  <div className="d-flex justify-content-between align-items-center">
                    <Button variant="primary">Go</Button>
                    <div className="d-flex gap-2">
                      <Button
                        className="btn btn-warning"
                        onClick={(e) => {
                          e.preventDefault();
                          setCourse(c);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        className="btn btn-danger"
                        onClick={(e) => {
                          e.preventDefault();
                          onDeleteCourse(c._id);
                        }}
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
                          onUnenroll(c._id);
                        }}
                      >
                        Unenroll
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        onClick={(e) => {
                          e.preventDefault();
                          onEnroll(c._id);
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
