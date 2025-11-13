"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import {
  Table,
  FormControl,
  FormSelect,
  Button,
} from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import * as usersClient from "../../../../Account/client";

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

export default function PeoplePage() {
  const { cid } = useParams();
  const { currentUser } = useSelector((s: any) => s.accountReducer);

  const [people, setPeople] = useState<any[]>([]);
  const [newUser, setNewUser] = useState<any>({ ...EMPTY_USER });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<any>({ ...EMPTY_USER });

  const canManage = currentUser && currentUser.role === "FACULTY";

  const loadPeople = async () => {
    try {
      const data = await usersClient.findAllUsers();
      setPeople(data);
    } catch (e) {
      console.error("Failed to load people:", e);
    }
  };

  useEffect(() => {
    loadPeople();
  }, [cid]);

  const handleCreate = async () => {
    try {
      if (!newUser.username || !newUser.password) return;
      await usersClient.createUser(newUser);
      setNewUser({ ...EMPTY_USER });
      await loadPeople();
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
      await usersClient.updateUserTable(editingId, editingDraft);
      await loadPeople();
      setEditingId(null);
      setEditingDraft({ ...EMPTY_USER });
    } catch (e) {
      console.error("Failed to update user:", e);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await usersClient.deleteUser(userId);
      await loadPeople();
    } catch (e) {
      console.error("Failed to delete user:", e);
    }
  };

  return (
    <div id="wd-people-table">
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
          {people.map((user: any) => {
            const isEditing = editingId === user._id;
            return (
              <tr key={user._id}>
                <td className="wd-full-name text-nowrap">
                  <FaUserCircle className="me-2 fs-1 text-secondary" />
                  {isEditing ? (
                    <>
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
                    <>
                      <span className="wd-first-name">
                        {user.firstName}
                      </span>{" "}
                      <span className="wd-last-name">
                        {user.lastName}
                      </span>
                    </>
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
