export default function AssignmentEditor() {
    return (
        <div id="wd-assignments-editor">
            <label htmlFor="wd-name">Assignment Name</label><br /><br />
            <input id="wd-name" defaultValue="A1 - ENV + HTML" /><br /><br />
            <textarea id="wd-description" rows={10} style={{ width: "50%" }}
                defaultValue={"The assignment is available online Submit a link to the landing page of your Web application running on Netlify. The landing page should include the following: Your full name and section Links to each of the lab assignments Link to the Kanbas application Links to all relevant source code repositories The Kanbas application should include a link to navigate back to the landing page."}
            />
            <br /><br />
            <table>
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-points">Points</label>
                    </td>
                    <td>
                        <input id="wd-points" defaultValue={100} /><br /><br />
                    </td>
                </tr>
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-group">Assignment Group</label>
                    </td>
                    <td>
                        <select id="wd-group">
                            <option value="ASSIGNMENTS"> ASSIGNMENTS</option>
                        </select><br /><br />
                    </td>
                </tr>
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-display-grade-as">Display Grade as</label>
                    </td>
                    <td>
                        <select id="wd-display-grade-as">
                            <option value="Display Grade as">Percentage</option>
                        </select><br /><br />
                    </td>
                </tr>
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-submission-type">Submission Type</label>
                    </td>
                    <td>
                        <select id="wd-submission-type">
                            <option value="Online">Online</option>
                        </select><br /><br />
                    </td>
                </tr>
                <tr>
                    <td align="right" valign="top">
                    </td>
                    <td>
                        <div>Online Entry Options</div>
                        <input type="checkbox" name="wd-text-entry" id="wd-text-entry"></input>
                        <label htmlFor="wd-text-entry">Text Entry</label><br />
                        <input type="checkbox" name="wd-website-url" id="wd-website-url"></input>
                        <label htmlFor="wd-website-url">Website URL</label><br />
                        <input type="checkbox" name="wd-media-recordings" id="wd-media-recordings"></input>
                        <label htmlFor="wd-media-recordings">Media Recordings</label><br />
                        <input type="checkbox" name="wd-student-annotation" id="wd-student-annotation"></input>
                        <label htmlFor="wd-student-annotation">Student Annotation</label><br />
                        <input type="checkbox" name="wd-file-upload" id="wd-file-upload"></input>
                        <label htmlFor="wd-file-upload">File Uploads</label><br /><br />
                    </td>
                </tr>
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-assign-to">Assign</label>
                    </td>
                    <td>
                        <text> Assign to</text><br />
                        <input id="wd-assign-to" defaultValue={"Everyone"}></input><br /><br />
                    </td>
                </tr>
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-due-date">Due</label>
                    </td>
                    <td>
                        <input type="date" defaultValue="2024-05-13" id="wd-due-date"></input><br /><br />
                    </td>
                </tr>
                <tr>
            <td /> 
            <td>
              <div style={{ display: "flex", gap: 20 }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label htmlFor="wd-available-from">Available from</label>
                  <input type="date" id="wd-available-from" defaultValue="2024-05-06" />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label htmlFor="wd-available-until">Until</label>
                  <input type="date" id="wd-available-until" defaultValue="2024-05-20" />
                </div>
              </div>
            </td>
          </tr>
      </table>
            <hr style={{ border: 0, borderTop: "1px solid #bbb", margin: "12px 0 8px" }} />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                <button>Cancel</button>
                <button>Save</button>
            </div>
        </div>
    );
}

