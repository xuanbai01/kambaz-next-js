"use client";

import { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { FaPencil } from "react-icons/fa6";
import { FaCheck, FaUserCircle } from "react-icons/fa";
import { FormControl } from "react-bootstrap";
import * as client from "../../../Account/client";

export default function PeopleDetails({
  uid,
  onClose,
}: {
  uid: string | null;
  onClose: () => void;
}) {
  const [user, setUser] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);

  const fetchUser = async () => {
    if (!uid) return;
    const u = await client.findUserById(uid);
    setUser(u);
    // Initialize the editable name from the user’s current name
    const fullName = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
    setName(fullName);
  };

  const deleteUser = async (id: string) => {
    await client.deleteUser(id);
    onClose();
  };

  const saveUser = async () => {
    if (!user) return;

    // Safely split name into first and last
    const parts = name.trim().split(" ");
    const firstName = parts[0] ?? "";
    const lastName = parts.slice(1).join(" ");

    const updatedUser = { ...user, firstName, lastName };
    await client.updateUser(updatedUser);
    setUser(updatedUser);
    setEditing(false); // keep the panel open, just exit edit mode
  };

  useEffect(() => {
    if (uid) {
      fetchUser();
      setEditing(false);
    }
  }, [uid]);

  if (!uid || !user) return null;

  return (
    <div className="wd-people-details position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25">
      <button
        onClick={onClose}
        className="btn position-fixed end-0 top-0 wd-close-details"
      >
        <IoCloseSharp className="fs-1" />
      </button>

      <div className="text-center mt-2">
        <FaUserCircle className="text-secondary me-2 fs-1" />
      </div>

      <hr />

      <div className="text-danger fs-4">
        {!editing && (
          <FaPencil
            onClick={() => {
              // make sure name state is in sync when starting edit
              const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
              setName(fullName);
              setEditing(true);
            }}
            className="float-end fs-5 mt-2 wd-edit"
          />
        )}

        {editing && (
          <FaCheck
            onClick={saveUser}
            className="float-end fs-5 mt-2 me-2 wd-save"
          />
        )}

        {!editing && (
          <div
            className="wd-name"
            onClick={() => {
              const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
              setName(fullName);
              setEditing(true);
            }}
          >
            {user.firstName} {user.lastName}
          </div>
        )}

        {editing && (
          <FormControl
            className="w-50 wd-edit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveUser();
              }
            }}
          />
        )}
      </div>

      <b>Roles:</b> <span className="wd-roles">{user.role}</span> <br />
      <b>Login ID:</b> <span className="wd-login-id">{user.loginId}</span> <br />
      <b>Section:</b> <span className="wd-section">{user.section}</span> <br />
      <b>Total Activity:</b>{" "}
      <span className="wd-total-activity">{user.totalActivity}</span>

      <hr />

      <button
        onClick={() => deleteUser(uid)}
        className="btn btn-danger float-end wd-delete"
      >
        Delete
      </button>
      <button
        onClick={onClose}
        className="btn btn-secondary float-end me-2 wd-cancel"
      >
        Cancel
      </button>
    </div>
  );
}
