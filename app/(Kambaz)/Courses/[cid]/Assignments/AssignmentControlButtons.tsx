"use client";
import { FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { deleteAssignment } from "./reducer";

export default function AssignmentControlButtons({
  assignmentId,
}: { assignmentId?: string }) {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (!assignmentId) return; 
    const ok = window.confirm("Delete this assignment?");
    if (!ok) return;
    dispatch(deleteAssignment(assignmentId));
  };

  return (
    <div className="float-end">
      {assignmentId && (
        <FaTrash
          className="text-danger me-2 mb-1"
          onClick={handleDelete}
          style={{ cursor: "pointer" }}
          aria-label="Delete assignment"
          title="Delete assignment"
        />
      )}
    </div>
  );
}
