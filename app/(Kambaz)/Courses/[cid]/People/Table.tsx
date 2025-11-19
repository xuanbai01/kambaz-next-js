"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  FormControl,
  FormSelect,
  Button,
} from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import * as client from "../../../Account/client";
import PeopleDetails from "./Details";

const EMPTY_USER = {
  username: "",
  password: "",
  firstName: "",
  lastName: "",
  role: "STUDENT",
  loginId: "",
  section: "",
  lastActivity: "",
  totalActivity: "",
};

type PeopleTableProps = {
  users?: any[];
  fetchUsers: () => void;
};

export default function PeopleTable({
  users = [],
  fetchUsers,
}: PeopleTableProps) {
  const { currentUser } = useSelector((s: any) => s.accountReducer);
  const canManage = currentUser && currentUser.role === "FACULTY";

  const [newUser, setNewUser] = useState<any>({ ...EMPTY_USER });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<any>({ ...EMPTY_USER });

  // detail panel state
  const [showDetails, setShowDetails] = useState(false);
  const [showUserId, setShowUserId] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!newUser.username || !newUser.password) return;
    try {
      await client.createUser(newUser);
      setNewUser({ ...EMPTY_USER });
      await fetchUsers();
    } catch (e) {
      console.error("Failed to create user:", e);
    }
  };

  const startEdit = (user: any) => {
    setEditingId(user._id);
    setEditingDraft({ ...EMPTY_USER, ...user });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingDraft({ ...EMPTY_USER });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      await client.updateUserTable(editingId, editingDraft);
      await fetchUsers();
      setEditingId(null);
      setEditingDraft({ ...EMPTY_USER });
    } catch (e) {
      console.error("Failed to update user:", e);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await client.deleteUser(userId);
      await fetchUsers();
    } catch (e) {
      console.error("Failed to delete user:", e);
    }
  };

  return (
    <div id="wd-people-table">
      {/* Details side panel */}
      {showDetails && (
        <PeopleDetails
          uid={showUserId}
          onClose={() => {
            setShowDetails(false);
            setShowUserId(null);
            fetchUsers(); // refresh after closing
          }}
        />
      )}

      {/* Create user (faculty only) */}
      {canManage && (
        <div className="mb-4 border p-3 rounded">
          <h5 className="mb-3">Add User</h5>
          <div className="d-flex flex-wrap gap-2 mb-2">
            <FormControl
              placeholder="Username"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              style={{ maxWidth: 180 }}
            />
            <FormControl
              placeholder="Password"
              type="password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              style={{ maxWidth: 180 }}
            />
            <FormControl
              placeholder="First name"
              value={newUser.firstName}
              onChange={(e) =>
                setNewUser({ ...newUser, firstName: e.target.value })
              }
              style={{ maxWidth: 180 }}
            />
            <FormControl
              placeholder="Last name"
              value={newUser.lastName}
              onChange={(e) =>
                setNewUser({ ...newUser, lastName: e.target.value })
              }
              style={{ maxWidth: 180 }}
            />
            <FormSelect
              value={newUser.role}
              onChange={(e) =>
                setNewUser({ ...newUser, role: e.target.value })
              }
              style={{ maxWidth: 160 }}
            >
              <option value="STUDENT">Student</option>
              <option value="FACULTY">Faculty</option>
              <option value="ADMIN">Admin</option>
            </FormSelect>
          </div>
          <Button variant="primary" onClick={handleCreate}>
            Create User
          </Button>
        </div>
      )}

      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Login ID</th>
            <th>Section</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
            {canManage && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => {
            const isEditing = editingId === user._id;
            const isSelected = showUserId === user._id;

            return (
              <tr
                key={user._id}
                style={{
                  backgroundColor: isSelected ? "#ffe6e6" : "transparent",
                  transition: "background-color 0.2s ease",
                }}
              >
                <td className="wd-full-name text-nowrap">
                  {isEditing ? (
                    <>
                      <FaUserCircle className="me-2 fs-1 text-secondary" />
                      <FormControl
                        className="mb-1"
                        placeholder="First name"
                        value={editingDraft.firstName || ""}
                        onChange={(e) =>
                          setEditingDraft({
                            ...editingDraft,
                            firstName: e.target.value,
                          })
                        }
                      />
                      <FormControl
                        className="mb-1"
                        placeholder="Last name"
                        value={editingDraft.lastName || ""}
                        onChange={(e) =>
                          setEditingDraft({
                            ...editingDraft,
                            lastName: e.target.value,
                          })
                        }
                      />
                    </>
                  ) : (
                    <span
                      className="text-decoration-none"
                      onClick={() => {
                        setShowUserId(user._id);
                        setShowDetails(true);
                      }}
                      style={{
                        cursor: "pointer",
                        color: isSelected ? "red" : "inherit",
                        fontWeight: isSelected ? 600 : "normal",
                      }}
                    >
                      <FaUserCircle className="me-2 fs-1 text-secondary" />
                      <span className="wd-first-name">
                        {user.firstName}
                      </span>{" "}
                      <span className="wd-last-name">
                        {user.lastName}
                      </span>
                    </span>
                  )}
                </td>

                <td className="wd-login-id">
                  {isEditing ? (
                    <FormControl
                      value={editingDraft.loginId || ""}
                      onChange={(e) =>
                        setEditingDraft({
                          ...editingDraft,
                          loginId: e.target.value,
                        })
                      }
                    />
                  ) : (
                    user.loginId
                  )}
                </td>

                <td className="wd-section">
                  {isEditing ? (
                    <FormControl
                      value={editingDraft.section || ""}
                      onChange={(e) =>
                        setEditingDraft({
                          ...editingDraft,
                          section: e.target.value,
                        })
                      }
                    />
                  ) : (
                    user.section
                  )}
                </td>

                <td className="wd-role">
                  {isEditing ? (
                    <FormSelect
                      value={editingDraft.role || "STUDENT"}
                      onChange={(e) =>
                        setEditingDraft({
                          ...editingDraft,
                          role: e.target.value,
                        })
                      }
                    >
                      <option value="STUDENT">Student</option>
                      <option value="FACULTY">Faculty</option>
                      <option value="ADMIN">Admin</option>
                    </FormSelect>
                  ) : (
                    user.role
                  )}
                </td>

                <td className="wd-last-activity">
                  {isEditing ? (
                    <FormControl
                      value={editingDraft.lastActivity || ""}
                      onChange={(e) =>
                        setEditingDraft({
                          ...editingDraft,
                          lastActivity: e.target.value,
                        })
                      }
                    />
                  ) : (
                    user.lastActivity
                  )}
                </td>

                <td className="wd-total-activity">
                  {isEditing ? (
                    <FormControl
                      value={editingDraft.totalActivity || ""}
                      onChange={(e) =>
                        setEditingDraft({
                          ...editingDraft,
                          totalActivity: e.target.value,
                        })
                      }
                    />
                  ) : (
                    user.totalActivity
                  )}
                </td>

                {canManage && (
                  <td>
                    {isEditing ? (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          className="me-2"
                          onClick={saveEdit}
                        >
                          Save
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => startEdit(user)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(user._id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
