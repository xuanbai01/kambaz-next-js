import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";
import { FaPlus } from "react-icons/fa6";
export default function ModuleControlButtons() {
  return (
    <div className="float-end">
      <GreenCheckmark />{' '}
      <FaPlus size={20} style={{ transform: 'translateY(-1px)' }} />{' '}
      <IoEllipsisVertical className="fs-4" />
    </div> );}