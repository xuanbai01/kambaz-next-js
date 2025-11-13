"use client";

import { Form, Button, Row, Col } from "react-bootstrap";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { addAssignment, updateAssignment } from "../../reducer";
import * as client from "../../../../client";

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { assignments } = useSelector((s: any) => s.assignmentsReducer);

  const existing = assignments.find((a: any) => a._id === aid);
  const isNew = aid === "new";

  const onSave = async () => {
    const title = (document.getElementById("wd-name") as HTMLInputElement)?.value || "";
    const description = (document.getElementById("wd-description") as HTMLTextAreaElement)?.value || "";
    const points = Number((document.getElementById("wd-points") as HTMLInputElement)?.value || 0);
    const due = (document.getElementById("wd-due-date") as HTMLInputElement)?.value || null;
    const availableFrom = (document.getElementById("wd-available-from") as HTMLInputElement)?.value || null;
    const availableUntil = (document.getElementById("wd-available-until") as HTMLInputElement)?.value || null;

    if (isNew) {
      const created = await client.createAssignmentForCourse(String(cid), {
        title, description, points, due, availableFrom, availableUntil,
      });
      dispatch(addAssignment(created));
    } else if (existing) {
      const updated = await client.updateAssignment({
        ...existing, title, description, points, due, availableFrom, availableUntil,
      });
      dispatch(updateAssignment(updated));
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
            <Form.Control type="number" id="wd-points" defaultValue={existing?.points ?? 100} />
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Label column sm={3} className="text-end">Assign</Form.Label>
          <Col sm={9}>
            <div className="border p-3">
              <Form.Label className="fw-bold">Assign to</Form.Label>
              <Form.Control type="text" id="wd-assign-to" defaultValue="Everyone" className="mb-3" />
              <Form.Label htmlFor="wd-due-date" className="fw-bold">Due</Form.Label>
              <Form.Control type="date" id="wd-due-date" defaultValue={existing?.due || ""} className="mb-3" />
              <Row>
                <Col>
                  <Form.Label htmlFor="wd-available-from" className="fw-bold">Available from</Form.Label>
                  <Form.Control type="date" id="wd-available-from" defaultValue={existing?.availableFrom || ""} />
                </Col>
                <Col>
                  <Form.Label htmlFor="wd-available-until" className="fw-bold">Until</Form.Label>
                  <Form.Control type="date" id="wd-available-until" defaultValue={existing?.availableUntil || ""} />
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
