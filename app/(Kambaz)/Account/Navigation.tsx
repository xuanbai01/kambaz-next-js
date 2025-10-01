import { AiOutlineDashboard } from "react-icons/ai";
import { FaRegCircleUser } from "react-icons/fa6";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import Link from "next/link";

export default function AccountNavigation() {
  return (
    <ListGroup 
      className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2" 
      style={{ width: 120, left: 0 }}
      id="wd-account-navigation"
    >
      <ListGroupItem className="bg-black border-0 text-center">
        <a target="_blank" href="https://www.northeastern.edu/" id="wd-neu-link">
          <img src="/images/NEU.svg" width="75px" alt="Northeastern University" />
        </a>
      </ListGroupItem>

      <ListGroupItem className="border-0 bg-white text-center">
        <Link href="/Account" id="wd-account-link" className="text-decoration-none">
          <FaRegCircleUser className="fs-1 text-danger" />
          <div className="text-danger">Account</div>
        </Link>
      </ListGroupItem>

      <ListGroupItem className="border-0 bg-black text-center">
        <Link href="/Dashboard" id="wd-dashboard-link" className="text-decoration-none">
          <AiOutlineDashboard className="fs-1 text-danger" />
          <div className="text-danger">Dashboard</div>
        </Link>
      </ListGroupItem>
    </ListGroup>
  );
}