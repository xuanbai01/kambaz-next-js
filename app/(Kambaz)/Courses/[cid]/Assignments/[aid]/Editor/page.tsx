import AssignmentEditor from "./editor";

export default function Page({
  params,
}: { params: { cid: string; aid: string } }) {
  return <AssignmentEditor />;
}