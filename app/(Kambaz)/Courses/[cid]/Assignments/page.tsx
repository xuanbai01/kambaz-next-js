import Link from "next/link";
export default function Assignments({ params:{ cid } }: { params:{ cid:string } }) {
  return (
        <div id="wd-assignments">
            <input
                id="wd-search-assignment"
                placeholder="Search for Assignments"
                type="text"
            />
            <button id="wd-add-assignment-group">+ Group</button>
            <button id="wd-add-assignment">+ Assignment</button>

            <h3 id="wd-assignments-title">
                ASSIGNMENTS 40% of Total <button>+</button>
            </h3>

            <ul id="wd-assignment-list">
                <li className="wd-assignment-list-item">
                    <Link className="wd-assignment-link" href={`/Courses/${cid}/Assignments/123/Editor`}>
                        A1 - ENV + HTML
                    </Link>
                        <div>Multiple Modules | <b>Not available until</b> May 6 at 12:00am</div>
                    <div><b>Due</b> May 13 at 11:59pm | 100 pts</div>
                </li>

                <li className="wd-assignment-list-item">
                    <Link className="wd-assignment-link" href={`/Courses/${cid}/Assignments/234/Editor`}>
                        A2 - CSS + BOOTSTRAP
                    </Link>
                    <div>Multiple Modules | <b>Not available until</b> May 13 at 12:00am</div>
                    <div><b>Due</b> May 20 at 11:59pm | 100 pts</div>
                </li>

                <li className="wd-assignment-list-item">
                    <Link className="wd-assignment-link" href={`/Courses/${cid}/Assignments/345/Editor`}>
                        A3 - JAVASCRIPT + REACT
                    </Link>
                    <div>Multiple Modules | <b>Not available until</b> May 20 at 12:00am</div>
                    <div><b>Due</b> May 27 at 11:59pm | 100 pts</div>
                </li>
            </ul>
        </div>
    );
}
