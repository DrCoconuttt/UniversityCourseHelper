import { useState, useEffect } from "react"
import Axios from "axios";
import ListDisplay from '../../components/ListDiplay';

const ReportList = () => {

    // This is the list of reports to be displayed and if the report list has been loaded yet
    const [reportList, setReportList] = useState([])
    const [reportLoaded, setReportLoaded] = useState(false)

    // This is used to tell ListDisplay which page to render the list (one of /,/professors,/faculties,/reports)
    const type = "report"

    // Updates the list of courses
    useEffect(() => {
        const getReports = async () => {
            const reports = await Axios.get("https://universitycoursehelperdeployednetlifyren.onrender.com/api/reportList")
            const data = await reports.data.rows
            setReportList(data)
            setReportLoaded(true)
        }
        getReports()
    }, [])

    //Call Listdisplay to render the list
    return(
        <div>
            {/* waiting for reports to load because page will flicker with "All Reports Resolved" text if not */}
            {reportLoaded === true? (<>
                {reportList.length > 0 ? (
                <div className="list">
                    <ListDisplay list = {reportList} type = {type} />
                </div>
                ) : (
                <h1 className="list">
                    All Reports Resolved
                </h1>
                )}
            </>) : (<></>)}
        </div>
    )
}

export default ReportList