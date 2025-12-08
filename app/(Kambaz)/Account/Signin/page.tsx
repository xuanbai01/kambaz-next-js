"use client";
import * as client from "../client";
import Link from "next/link";
import { redirect } from "next/dist/client/components/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import * as db from "../../Database";
import { FormControl, Button } from "react-bootstrap";

export default function Signin() {
  const [credentials, setCredentials] = useState<any>({});
  const dispatch = useDispatch();

  const signin = async () => {
    const user = await client.signin(credentials);
    if (!user) return;
    dispatch(setCurrentUser(user));
    redirect("/Dashboard");
  };

  return (
    <div id="wd-signin-screen">
      <h1>Sign in</h1>
      <FormControl
        defaultValue={credentials.username}
        onChange={(e) =>
          setCredentials({ ...credentials, username: e.target.value })
        }
        className="mb-2"
        placeholder="username"
        id="wd-username"
      />
      <FormControl
        defaultValue={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
        className="mb-2"
        placeholder="password"
        type="password"
        id="wd-password"
      />
      <Button onClick={signin} id="wd-signin-btn" className="w-100 mb-2">
        Sign in
      </Button>

      <div className="mb-4">
        <Link id="wd-signup-link" href="/Account/Signup">
          Sign up
        </Link>
      </div>

      <div className="mt-4 p-3 border rounded bg-light">
        <h2 className="h5 mb-2">Project Information</h2>
        <p className="mb-1">
          <strong>Student:</strong> Xuan Bai
        </p>
        <p className="mb-3">
          <strong>Section:</strong> 05
        </p>
        <p className="mb-1">
          <strong>Frontend repository:</strong>{" "}
          <a
            href="https://github.com/xuanbai01/kambaz-next-js/tree/quizzes"
            target="_blank"
            rel="noreferrer"
          >
            github.com/xuanbai01/kambaz-next-js/tree/quizzes
          </a>
        </p>
        <p className="mb-0">
          <strong>Backend repository:</strong>{" "}
          <a
            href="https://github.com/xuanbai01/kambaz-node-server-app/tree/quizzes"
            target="_blank"
            rel="noreferrer"
          >
            github.com/xuanbai01/kambaz-node-server-app/tree/quizzes
          </a>
        </p>
      </div>
    </div>
  );
}
