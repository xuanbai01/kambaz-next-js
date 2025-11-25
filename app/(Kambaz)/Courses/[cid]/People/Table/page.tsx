"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PeopleTable from "../Table";
import * as client from "../../../client";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const { cid } = useParams();
  const fetchUsers = async () => {
    if (!cid) return;
    const enrolled = await client.findUsersForCourse(cid as string);
    setUsers(enrolled);
  };
  useEffect(() => {
    fetchUsers();
  }, [cid]);
  return (
    <div>
      <h3>Users</h3>
      <PeopleTable users={users} fetchUsers={fetchUsers} />
    </div>
  );
}
