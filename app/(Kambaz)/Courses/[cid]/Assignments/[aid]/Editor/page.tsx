import Editor from "./editor";

export default function Page({
  params,
}: { params: { cid: string; aid: string } }) {
  return <Editor />;
}