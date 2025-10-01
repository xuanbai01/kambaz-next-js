import Link from "next/link";
import TOC from "./TOC";
export default function Labs() {
 return (
   <div id="wd-labs">
     <h1>Labs</h1>
     <h3>By Xuan Bai</h3>
     <a 
        id="wd-github" 
        href="https://github.com/xuanbai01/kambaz-next-js"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub Repository
      </a>
      <TOC />
   </div>
);}
