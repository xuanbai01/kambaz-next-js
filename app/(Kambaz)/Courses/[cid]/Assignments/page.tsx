"use client";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { MdOutlineAssignment } from "react-icons/md";
import AssignmentsControls from "./AssignmentsControls";
import AssignmentControlButtons from "./AssignmentControlButtons";
import LessonControlButtons from "./LessonControlButtons";
import Link from "next/link";
import { useParams } from "next/navigation";
import * as db from "../../../Database";

export default function Assignments() {
  const { cid } = useParams();
  const assignments = db.assignments;

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
              <AssignmentControlButtons />
            </div>
          </div>

          <ListGroup className="rounded-0">
            {assignments
              .filter((assignment: any) => assignment.course === cid)
              .map((assignment: any) => (
                <ListGroupItem
                  key={assignment._id}
                  className="wd-assignment-list-item p-3 ps-1 d-flex align-items-start"
                >
                  <BsGripVertical className="me-2 fs-3 mt-1" />
                  <MdOutlineAssignment className="me-3 fs-3 text-success mt-1" />
                  <div className="flex-grow-1">
                    <Link
                      href={`/Courses/${cid}/Assignments/${assignment._id}/Editor`}
                      className="wd-assignment-link text-dark text-decoration-none fw-bold"
                    >
                      {assignment.title}
                    </Link>
                    <div className="text-muted small">
                      <span className="text-danger">Multiple Modules</span> |{" "}
                      {assignment.availableFrom && `Not available until ${assignment.availableFrom} |`}
                      <br />
                      Due {assignment.due} | {assignment.points} pts
                    </div>
                  </div>
                  <LessonControlButtons />
                </ListGroupItem>
              ))}
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}