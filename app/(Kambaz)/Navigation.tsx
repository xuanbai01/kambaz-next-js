"use client";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import Link from "next/link";

export default function KambazNavigation() {
  return (
    <ListGroup 
      className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2" 
      style={{ width: 120}}
      id="wd-kambaz-navigation">

      <ListGroupItem className="bg-black border-0 text-center" as="a"
              target="_blank" href="https://www.northeastern.edu/" id="wd-neu-link">
          <img src="/images/NEU.svg" width="75px" alt="Northeastern University" />
      </ListGroupItem>

      <ListGroupItem className="border-0 bg-black text-center">
        <Link href="/Account" id="wd-account-link" className="text-decoration-none">
          <FaRegCircleUser className="fs-1 text-white" />
          <div className="text-white">Account</div>
        </Link>
      </ListGroupItem>

      <ListGroupItem className="border-0 bg-white text-center">
        <Link href="/Dashboard" id="wd-dashboard-link" className="text-decoration-none">
          <AiOutlineDashboard className="fs-1 text-danger" />
          <div className="text-danger">Dashboard</div>
        </Link>
      </ListGroupItem>

      <ListGroupItem className="border-0 bg-black text-center">
        <Link href="/Courses" id="wd-course-link" className="text-decoration-none">
          <LiaBookSolid className="fs-1 text-danger" />
          <div className="text-danger">Courses</div>
        </Link>
      </ListGroupItem>

      <ListGroupItem className="border-0 bg-black text-center">
        <Link href="/Calendar" id="wd-calendar-link" className="text-decoration-none">
          <IoCalendarOutline className="fs-1 text-danger" />
          <div className="text-danger">Calendar</div>
        </Link>
      </ListGroupItem>

      <ListGroupItem className="border-0 bg-black text-center">
        <Link href="/Inbox" id="wd-inbox-link" className="text-decoration-none">
          <FaInbox className="fs-1 text-danger" />
          <div className="text-danger">Inbox</div>
        </Link>
      </ListGroupItem>

      <ListGroupItem className="border-0 bg-black text-center">
        <Link href="/Labs" id="wd-labs-link" className="text-decoration-none">
          <LiaCogSolid className="fs-1 text-danger" />
          <div className="text-danger">Labs</div>
        </Link>
      </ListGroupItem>
    </ListGroup>
  );
}