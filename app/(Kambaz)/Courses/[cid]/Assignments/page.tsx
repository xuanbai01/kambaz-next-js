import { ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { MdOutlineAssignment } from "react-icons/md";
import AssignmentsControls from "./AssignmentsControls";
import AssignmentControlButtons from "./AssignmentControlButtons";
import LessonControlButtons from "./LessonControlButtons";
import Link from "next/link";

export default function Assignments() {
  return (
    <div id="wd-assignments">
      <AssignmentsControls />

      <ListGroup className="rounded-0" id="wd-assignment-list">
        <ListGroupItem className="p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary d-flex align-items-center">
            <BsGripVertical className="me-2 fs-3" />
            ASSIGNMENTS
            <div className="ms-auto">
              <span className="border border-dark rounded-pill px-2 py-1 me-2">
                40% of Total
              </span>
              <AssignmentControlButtons/>
            </div>
          </div>

          <ListGroup className="rounded-0">
            <ListGroupItem className="wd-assignment-list-item p-3 ps-1 d-flex align-items-start">
              <BsGripVertical className="me-2 fs-3 mt-1" />
              <MdOutlineAssignment className="me-3 fs-3 text-success mt-1" />
              <div className="flex-grow-1">
                <Link
                  href="/Courses/1234/Assignments/A1/Editor" 
                  className="wd-assignment-link text-dark text-decoration-none fw-bold"
                >
                  A1
                </Link>
                <div className="text-muted small">
                  <span className="text-danger">Multiple Modules</span> | Not available until May 6 at 12:00am |
                  <br />
                  Due May 13 at 11:59pm | 100 pts
                </div>
              </div>
              <LessonControlButtons />
            </ListGroupItem>

            <ListGroupItem className="wd-assignment-list-item p-3 ps-1 d-flex align-items-start">
              <BsGripVertical className="me-2 fs-3 mt-1" />
              <MdOutlineAssignment className="me-3 fs-3 text-success mt-1" />
              <div className="flex-grow-1">
                <Link
                  href="/Courses/1234/Assignments/A2/Editor"
                  className="wd-assignment-link text-dark text-decoration-none fw-bold"
                >
                  A2
                </Link>
                <div className="text-muted small">
                  <span className="text-danger">Multiple Modules</span> | Not available until May 13 at 12:00am |
                  <br />
                  Due May 20 at 11:59pm | 100 pts
                </div>
              </div>
              <LessonControlButtons />
            </ListGroupItem>

            <ListGroupItem className="wd-assignment-list-item p-3 ps-1 d-flex align-items-start">
              <BsGripVertical className="me-2 fs-3 mt-1" />
              <MdOutlineAssignment className="me-3 fs-3 text-success mt-1" />
              <div className="flex-grow-1">
                <Link
                  href="/Courses/1234/Assignments/A3/Editor"
                  className="wd-assignment-link text-dark text-decoration-none fw-bold"
                >
                  A3
                </Link>
                <div className="text-muted small">
                  <span className="text-danger">Multiple Modules</span> | Not available until May 20 at 12:00am |
                  <br />
                  Due May 27 at 11:59pm | 100 pts
                </div>
              </div>
              <LessonControlButtons />
            </ListGroupItem>
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}