import Link from "next/link";
import Image from "next/image";
export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (8)</h2> <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course">
          <Link href="/Courses/CS1234" className="wd-dashboard-course-link">
            <Image src="/images/reactjs.jpg" width={200} height={150} alt="Course cover" />
            <div>
              <h5>CS1234 React JS</h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/Courses/CS5010" className="wd-dashboard-course-link">
            <Image src="/images/reactjs.jpg" width={200} height={150} alt="Course cover" />
            <div>
              <h5>CS 5010 / 5011 – Programming Design Paradigms (+ Recitation)</h5>
              <p className="wd-dashboard-course-title">
                Programming Foundations & Paradigms</p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link href="/Courses/CS5800" className="wd-dashboard-course-link">
            <Image src="/images/reactjs.jpg" width={200} height={150} alt="Course cover" />
            <div>
              <h5>CS 5800 – Algorithms</h5>
              <p className="wd-dashboard-course-title">
                Algorithm Design & Analysis</p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link href="/Courses/CS5500" className="wd-dashboard-course-link">
            <Image src="/images/reactjs.jpg" width={200} height={150} alt="Course cover" />
            <div>
              <h5>CS 5500 – Foundations of Software Engineering</h5>
              <p className="wd-dashboard-course-title">
                Systems & Software Breadth</p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link href="/Courses/CS5600" className="wd-dashboard-course-link">
            <Image src="/images/reactjs.jpg" width={200} height={150} alt="Course cover" />
            <div>
              <h5>CS 5600 – Computer Systems</h5>
              <p className="wd-dashboard-course-title">
                Systems & Software breadth</p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link href="/Courses/CS5610" className="wd-dashboard-course-link">
            <Image src="/images/reactjs.jpg" width={200} height={150} alt="Course cover" />
            <div>
              <h5>CS 5610 – Web Development</h5>
              <p className="wd-dashboard-course-title">
                Systems & Software breadth</p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link href="/Courses/CS5700" className="wd-dashboard-course-link">
            <Image src="/images/reactjs.jpg" width={200} height={150} alt="Course cover" />
            <div>
              <h5>CS 5700 – Fundamentals of Computer Networking</h5>
              <p className="wd-dashboard-course-title">
                Systems & Software breadth</p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link href="/Courses/CS5100" className="wd-dashboard-course-link">
            <Image src="/images/reactjs.jpg" width={200} height={150} alt="Course cover" />
            <div>
              <h5>CS 5100 – Foundations of Artificial Intelligence</h5>
              <p className="wd-dashboard-course-title">
                AI & Data Science breadth</p>
              <button>Go</button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
