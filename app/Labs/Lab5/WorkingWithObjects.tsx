"use client";
import React, { useState } from "react";
import { FormControl } from "react-bootstrap";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export default function WorkingWithObjects() {
  const [assignment, setAssignment] = useState({
    id: 1,
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10",
    completed: false,
    score: 0,
  });

  const [moduleObj, setModuleObj] = useState({
    id: "M101",
    name: "Web Development Fundamentals",
    description: "Intro to HTML, CSS, JS",
    course: "CS5610",
  });

  const ASSIGNMENT_API_URL = `${HTTP_SERVER}/lab5/assignment`;
  const MODULE_API_URL = `${HTTP_SERVER}/lab5/module`;

  return (
    <div id="wd-working-with-objects">
      <h3>Working With Objects</h3>

      <h4>Modifying Assignment</h4>
      <a
        id="wd-update-assignment-title"
        className="btn btn-primary float-end"
        href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}
      >
        Update Title
      </a>
      <FormControl
        className="w-75"
        id="wd-assignment-title"
        defaultValue={assignment.title}
        onChange={(e) =>
          setAssignment({ ...assignment, title: e.target.value })
        }
      />
      <hr />

      <h4>Retrieving Assignment</h4>
      <a
        id="wd-retrieve-assignments"
        className="btn btn-primary me-2"
        href={`${HTTP_SERVER}/lab5/assignment`}
      >
        Get Assignment
      </a>
      <hr />
      <a
        id="wd-retrieve-assignment-title"
        className="btn btn-primary me-2"
        href={`${HTTP_SERVER}/lab5/assignment/title`}
      >
        Get Title
      </a>

      <hr />
      <h4>Working with Module</h4>
      <a
        id="wd-get-module"
        className="btn btn-primary me-2"
        href={`${MODULE_API_URL}`}
      >
        Get Module
      </a>
      <a
        id="wd-get-module-name"
        className="btn btn-primary me-2"
        href={`${MODULE_API_URL}/name`}
      >
        Get Module Name
      </a>

      <FormControl
        className="w-75 my-2"
        id="wd-module-name"
        defaultValue={moduleObj.name}
        onChange={(e) => setModuleObj({ ...moduleObj, name: e.target.value })}
      />
      <a
        id="wd-update-module-name"
        className="btn btn-warning me-2"
        href={`${MODULE_API_URL}/name/${moduleObj.name}`}
      >
        Update Module Name
      </a>

      <FormControl
        className="w-75 my-2"
        id="wd-module-description"
        defaultValue={moduleObj.description}
        onChange={(e) =>
          setModuleObj({ ...moduleObj, description: e.target.value })
        }
      />
      <a
        id="wd-update-module-description"
        className="btn btn-warning me-2"
        href={`${MODULE_API_URL}/description/${moduleObj.description}`}
      >
        Update Module Description
      </a>
      <hr />
    </div>
  );
}
