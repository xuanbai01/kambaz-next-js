"use client";
import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";
import { FaPlus } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";

export default function ModuleControlButtons({
  moduleId,
  deleteModule,
  editModule
}: {
  moduleId: string;
  deleteModule: (moduleId: string) => void;
  editModule: (moduleId: string) => void;
}) {
  return (
    <div className="float-end">
      <FaPencil
        onClick={(e) => { e.stopPropagation(); editModule(moduleId); }}
        className="text-primary me-3"
        style={{ cursor: "pointer" }}
        aria-label="Edit module"
      />
      <FaTrash
        className="text-danger me-2 mb-1"
        style={{ cursor: "pointer" }}
        aria-label="Delete module"
        onClick={(e) => { e.stopPropagation(); deleteModule(moduleId); }}
      />{" "}
      <GreenCheckmark />{" "}
      <FaPlus size={20} style={{ transform: "translateY(-1px)" }} />{" "}
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}
