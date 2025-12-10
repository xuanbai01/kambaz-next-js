"use client";
import { FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { deleteAssignment as deleteAssignmentAction } from "./reducer";

type Props = {
  assignmentId?: string;
  onDelete?: (assignmentId: string) => void | Promise<void>;
};

export default function AssignmentControlButtons({
  assignmentId,
  onDelete,
}: Props) {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (!assignmentId) return;
    if (onDelete) {
      await onDelete(assignmentId);
    } else {
      dispatch(deleteAssignmentAction(assignmentId));
    }
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
