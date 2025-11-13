"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { ListGroup, ListGroupItem, FormControl } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";

import ModulesControls from "./ModulesControls";
import LessonControlButtons from "./LessonControlButtons";
import ModuleControlButtons from "./ModuleControlButtons";

import {
  editModule,
  updateModule as updateModuleAction,
  setModules,
} from "./reducer";

import * as coursesClient from "../../client";

export default function Modules() {
  const { cid } = useParams();
  const dispatch = useDispatch();
  const { modules } = useSelector((state: any) => state.modulesReducer);

  const [moduleName, setModuleName] = useState("");

  const fetchModules = async () => {
    if (!cid) return;
    const serverModules = await coursesClient.findModulesForCourse(cid as string);
    dispatch(setModules(serverModules));
  };

  useEffect(() => {
    fetchModules();
  }, [cid]);

  const onCreateModuleForCourse = async () => {
    if (!cid || !moduleName.trim()) return;
    const newModuleReq = { name: moduleName.trim() };
    const created = await coursesClient.createModuleForCourse(
      cid as string,
      newModuleReq
    );

    dispatch(setModules([...modules, created]));
    setModuleName("");
  };

  const onUpdateModule = async (module: any) => {
    await coursesClient.updateModule(module);
    const updated = modules.map((m: any) => (m._id === module._id ? module : m));
    dispatch(setModules(updated));
  };

  const onRemoveModule = async (moduleId: string) => {
    await coursesClient.deleteModule(moduleId);
    dispatch(setModules(modules.filter((m: any) => m._id !== moduleId)));
  };

  return (
    <div className="wd-modules">
      <ModulesControls
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={onCreateModuleForCourse}
      />

      <ListGroup id="wd-modules" className="rounded-0">
        {modules.map((module: any) => (
          <ListGroupItem
            key={module._id}
            className="wd-module p-0 mb-5 fs-5 border-gray"
          >
            <div className="wd-title p-3 ps-2 bg-secondary">
              <BsGripVertical className="me-2 fs-3" />

              {!module.editing && module.name}

              {module.editing && (
                <FormControl
                  className="w-50 d-inline-block"
                  value={module.name ?? ""}
                  onChange={(e) =>
                    dispatch(
                      updateModuleAction({ ...module, name: e.target.value })
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onUpdateModule({ ...module, editing: false });
                    }
                  }}
                />
              )}

              <ModuleControlButtons
                moduleId={module._id}
                deleteModule={(moduleId) => onRemoveModule(moduleId)}
                editModule={(moduleId) => dispatch(editModule(moduleId))}
              />
            </div>

            {module.lessons && (
              <ListGroup className="wd-lessons rounded-0">
                {module.lessons.map((lesson: any) => (
                  <ListGroupItem key={lesson._id} className="wd-lesson p-3 ps-1">
                    <BsGripVertical className="me-2 fs-3" /> {lesson.name}
                    <LessonControlButtons />
                  </ListGroupItem>
                ))}
              </ListGroup>
            )}
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
}
