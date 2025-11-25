"use client";
import { useEffect } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { MdOutlineAssignment } from "react-icons/md";
import AssignmentsControls from "./AssignmentsControls";
import AssignmentControlButtons from "./AssignmentControlButtons";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  setAssignments,
  deleteAssignment as deleteAssignmentAction,
} from "./reducer";
import * as client from "../../client";

export default function Assignments() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { assignments } = useSelector((s: any) => s.assignmentsReducer);

  const onAdd = () => {
    router.push(`/Courses/${cid}/Assignments/new/Editor`);
  };

  useEffect(() => {
    const load = async () => {
      if (!cid) return;
      const list = await client.findAssignmentsForCourse(cid as string);
      dispatch(setAssignments(list));
    };
    load();
  }, [cid, dispatch]);

  const onDelete = async (assignmentId: string) => {
    await client.deleteAssignment(assignmentId);
    dispatch(deleteAssignmentAction(assignmentId));
  };

  return (
    <div id="wd-assignments">
      <AssignmentsControls onAdd={onAdd} />

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
              .filter((a: any) => String(a.course) === String(cid))
              .map((a: any) => (
                <ListGroupItem
                  key={a._id}
                  className="wd-assignment-list-item p-3 ps-1 d-flex align-items-start"
                >
                  <BsGripVertical className="me-2 fs-3 mt-1" />
                  <MdOutlineAssignment className="me-3 fs-3 text-success mt-1" />

                  <div className="flex-grow-1">
                    <Link
                      href={`/Courses/${cid}/Assignments/${a._id}/Editor`}
                      className="wd-assignment-link text-dark text-decoration-none fw-bold"
                    >
                      {a.title}
                    </Link>
                    <div className="text-muted small">
                      <span className="text-danger">Multiple Modules</span> |{" "}
                      {a.availableFrom &&
                        `Not available until ${a.availableFrom} |`}
                      <br />
                      Due {a.due} | {a.points} pts
                    </div>
                  </div>

                  <button
                    className="btn btn-sm btn-outline-danger ms-2"
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      await onDelete(a._id);
                    }}
                  >
                    Delete
                  </button>
                </ListGroupItem>
              ))}
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
