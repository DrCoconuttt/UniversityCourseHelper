//import Button from "../../components/Button"
import { useEffect, useState } from "react"
import { useLocation } from "react-router"
import { Link } from "react-router-dom"
import Axios from "axios"

const ReportInfo = () => {

    // Read the URL for the course name
    const location = useLocation()
    const pathname = decodeURI(location.pathname.split("/")[2]);

    const [reportInfo, setReportInfo] = useState([])
    const [ratingInfo, setRatingInfo] = useState([])

    // Fetching the report information from the database
    useEffect(() => {
        const fetchReportInfo = async () => {
            const reports = await Axios.get(`https://universitycoursehelperdeployednetlifyren.onrender.com/api/reportInfo/${pathname}`)
            const data = await reports.data
            setReportInfo(data)
        }
        fetchReportInfo()
    }, [pathname])

    // Fetch the rating information from the database
    useEffect(() => {
        const fetchRatingInfo = async () => {
            const rating = await Axios.get(`https://universitycoursehelperdeployednetlifyren.onrender.com/api/reportInfo/${pathname}/rating`)
            const data = await rating.data
            setRatingInfo(data)
        }
        fetchRatingInfo()
    }, [pathname])

    // Delete a Report
    const deleteReport = async (id) => {
        await Axios.delete(`https://universitycoursehelperdeployednetlifyren.onrender.com/api/reportInfo/${id}`)
        window.location.reload();
    }

    // Delete a Rating
    const deleteRating = async (id) => {
        await Axios.delete(`https://universitycoursehelperdeployednetlifyren.onrender.com/api/rating/${id}`)
        window.location.reload();
    }

    return (
        
        <div className="info">
            {/* Display report info */}
            {reportInfo.map((report) => {
            return(
                <div key={report.Report_id} value={report}>
                    <h1 className="centerText">
                        Report
                    </h1>
                    <div className = "bold">
                        Reported: {' '}
                        {report.Report_date.slice(0, 10)}
                    </div>
                    <div>
                        Reason: {' '}
                        {report.Reason}
                    </div>

                    <hr />

                    {/* Display rating info */}  
                    {ratingInfo.length > 0 ? (
                        <>
                            <h1 className="centerText">
                                Reported Comment
                            </h1>
                            {ratingInfo.map((rating) => {
                                return(
                                    <div key={rating.Rating_id} value={rating}>
                                        {/*list all ratings for the given class*/}                     
                                        <div className = "bold">
                                            Posted: {' '}
                                            {rating.Rating_date.slice(0, 10)}
                                            {!!(rating.Username)? ` By moderator ${rating.Username}` : ''}     
                                        </div>
                                        <div>
                                            Rating: {' '}
                                            {rating.Score}
                                            /5
                                        </div>
                                        <div className="commentWraping">
                                            Comment: {' '}
                                            {rating.Comment}
                                        </div>

                                        <br></br>
                                        
                                        <Link to="/reports">
                                            <button onClick={() => deleteReport(report.Report_id)}
                                                className="modifyButtonBig">
                                                Reject Report
                                            </button>
                                        </Link>
                                        <Link to="/reports">
                                            <button onClick={() => deleteRating(rating.Rating_id)}
                                                className="modifyButtonBig">
                                                Accept Report
                                            </button>
                                        </Link>
                                    </div>
                                )
                            })}
                        </>
                    ) : <p>Comment Removed</p>}                  
                </div>
                );
            })}
        </div>
    )
}

export default ReportInfo