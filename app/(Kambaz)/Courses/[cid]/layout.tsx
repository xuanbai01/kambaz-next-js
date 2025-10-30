"use client";
import { ReactNode, useEffect, useState } from "react";
import CourseNavigation from "./Navigation";
import { FaAlignJustify } from "react-icons/fa";
import Breadcrumb from "./Breadcrumb";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function CoursesLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const router = useRouter();
  const { cid } = useParams();
  const { courses } = useSelector((state: any) => state.coursesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments } = useSelector((s: any) => s.enrollmentsReducer);
  const course = courses.find((c: any) => c._id === cid);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      router.replace("/Account/Signin");
      return;
    }
    const ok = enrollments.some(
      (e: any) => e.user === currentUser._id && e.course === cid
    );
    if (!ok) router.replace("/Dashboard");
  }, [currentUser, enrollments, cid, router]);

  if (!currentUser) return null;

  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify
          className="me-4 fs-4 mb-1 cursor-pointer"
          onClick={() => setShowSidebar(!showSidebar)}
          style={{ cursor: "pointer" }}
        />
        <Breadcrumb course={course} />
      </h2>
      <hr />
      <div className="d-flex">
        {showSidebar && (
          <div className="d-none d-md-block">
            <CourseNavigation cid={cid as string} />
          </div>
        )}
        <div className="flex-fill">{children}</div>
      </div>
    </div>
  );
}
