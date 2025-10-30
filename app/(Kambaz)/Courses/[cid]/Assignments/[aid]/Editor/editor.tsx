"use client";

import { Form, Button, Row, Col } from "react-bootstrap";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { addAssignment, updateAssignment } from "../../reducer";

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { assignments } = useSelector((s: any) => s.assignmentsReducer);

  const existing = assignments.find((a: any) => a._id === aid);
  const isNew = aid === "new";

  // Local scratch (uncontrolled -> read on submit is fine per chapter style)
  const onSave = () => {
    const title = (document.getElementById("wd-name") as HTMLInputElement)?.value || "";
    const description = (document.getElementById("wd-description") as HTMLTextAreaElement)?.value || "";
    const points = Number((document.getElementById("wd-points") as HTMLInputElement)?.value || 0);
    const dueDate = (document.getElementById("wd-due-date") as HTMLInputElement)?.value;
    const availableFromDate = (document.getElementById("wd-available-from") as HTMLInputElement)?.value;
    const availableUntilDate = (document.getElementById("wd-available-until") as HTMLInputElement)?.value;

    if (isNew) {
      dispatch(
        addAssignment({
          title,
          description,
          points,
          course: cid,
          due: dueDate,
          availableFrom: availableFromDate,
          availableUntil: availableUntilDate,
        })
      );
    } else if (existing) {
      dispatch(
        updateAssignment({
          ...existing,
          title,
          description,
          points,
          due: dueDate,
          availableFrom: availableFromDate,
          availableUntil: availableUntilDate,
        })
      );
    }
    router.push(`/Courses/${cid}/Assignments`);
  };

  if (!isNew && !existing) return <div>Assignment not found</div>;

  return (
    <div id="wd-assignments-editor" className="p-3">
      <Form>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-name">Assignment Name</Form.Label>
          <Form.Control type="text" id="wd-name" defaultValue={existing?.title || ""} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control as="textarea" id="wd-description" rows={10} defaultValue={existing?.description || ""} />
        </Form.Group>

        <Row className="mb-3">
          <Form.Label column sm={3} className="text-end">
            Points
          </Form.Label>
          <Col sm={9}>
            <Form.Control type="number" id="wd-points" defaultValue={existing?.points ?? 0} />
          </Col>
        </Row>

        {/* keep the rest of your UI identical, just ensure ids match the reads above */}
        <Row className="mb-3">
          <Form.Label column sm={3} className="text-end">
            Assign
          </Form.Label>
          <Col sm={9}>
            <div className="border p-3">
              <Form.Label className="fw-bold">Assign to</Form.Label>
              <Form.Control type="text" id="wd-assign-to" defaultValue="Everyone" className="mb-3" />
              <Form.Label htmlFor="wd-due-date" className="fw-bold">Due</Form.Label>
              <Form.Control type="date" id="wd-due-date" defaultValue={existing?.due || "2024-05-13"} className="mb-3" />
              <Row>
                <Col>
                  <Form.Label htmlFor="wd-available-from" className="fw-bold">Available from</Form.Label>
                  <Form.Control type="date" id="wd-available-from" defaultValue={existing?.availableFrom || "2024-05-06"} />
                </Col>
                <Col>
                  <Form.Label htmlFor="wd-available-until" className="fw-bold">Until</Form.Label>
                  <Form.Control type="date" id="wd-available-until" defaultValue={existing?.availableUntil || "2024-05-20"} />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <hr />
        <div className="d-flex justify-content-end gap-2">
          <Link href={`/Courses/${cid}/Assignments`}>
            <Button variant="secondary" size="lg">Cancel</Button>
          </Link>
          <Button variant="danger" size="lg" onClick={onSave}>Save</Button>
        </div>
      </Form>
    </div>
  );
}