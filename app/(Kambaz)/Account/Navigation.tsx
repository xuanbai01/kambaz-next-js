"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Nav, NavItem, NavLink } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function AccountNavigation() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const links = currentUser ? ["Profile"] : ["Signin", "Signup"];
  const pathname = (usePathname() || "").toLowerCase();

  return (
    <Nav variant="pills" className="flex-column">
      {links.map((link) => {
        const href = `/Account/${link}`;
        const isActive = pathname.endsWith(`/${link.toLowerCase()}`);
        return (
          <NavItem key={link} className="mb-2">
            <NavLink as={Link} href={href} active={isActive}>
              {link}
            </NavLink>
          </NavItem>
        );
      })}

      {currentUser && currentUser.role === "ADMIN" && (
        <NavItem className="mb-2">
          <NavLink
            as={Link}
            href="/Account/Users"
            active={pathname.endsWith("/account/users")}
          >
            Users
          </NavLink>
        </NavItem>
      )}
    </Nav>
  );
}
