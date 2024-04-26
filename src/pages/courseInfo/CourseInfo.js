import { useLocation } from "react-router"
import { useState, useEffect } from "react"
import Axios from "axios"
import SemesterProf from '../../components/SemesterProf'
import { Link } from "react-router-dom";

const CourseInfo = () => {

    // Read the URL for the course name
    const location = useLocation()
    const name = decodeURI(location.pathname.split("/")[2]);
    const date = new Date();

    // Setup state hooks to store data gotten from api calls
    const [courseInfo, setCourseInfo] = useState([])
    const [semesterInfo, setSemesterInfo] = useState([])
    const [degreeRequiredInfo, setDegreeRequiredInfo] = useState([])
    const [degreeOptionalInfo, setDegreeOptionalInfo] = useState([])
    const [score, setScore] = useState("")
    const [comment, setComment] = useState("")
    const [getRatings, setGetRatings] = useState([])
    const [isEditRating, setIsEditRating] = useState("")
    const [ratingIdEdit, setRatingIdEdit] = useState("")
    const [scoreEdit, setScoreEdit] = useState("")
    const [commentEdit, setCommentEdit] = useState("")
    const [isCreateReport, setIsCreateReport] = useState("")
    const [ratingIdReport, setRatingIdReport] = useState("")
    const [reportReason, setReportReason] = useState("")

    // Call get apis (for more info on what each does look at client > index.js)
    useEffect(() => {
        const getCourses = async () => {
            const courses = await Axios.get(`https://university-course-helper.herokuapp.com/api/courseInfo/${name}`)
            const data = await courses.data
            setCourseInfo(data)
        }
        getCourses()
    }, [name])

    useEffect(() => {
        const getSemester = async () => {
            const courses = await Axios.get(`https://university-course-helper.herokuapp.com/api/courseInfo/${name}/semester`)
            const data = await courses.data
            setSemesterInfo(data)
        }
        getSemester()
    }, [name])

    useEffect(() => {
        const getDegreeRequired = async () => {
            const courses = await Axios.get(`https://university-course-helper.herokuapp.com/api/courseInfo/${name}/degreeRequired`)
            const data = await courses.data
            setDegreeRequiredInfo(data)
        }
        getDegreeRequired()
    }, [name])

    useEffect(() => {
        const getDegreeOptional = async () => {
            const courses = await Axios.get(`https://university-course-helper.herokuapp.com/api/courseInfo/${name}/degreeOptional`)
            const data = await courses.data
            setDegreeOptionalInfo(data)
        }
        getDegreeOptional()
    }, [name])

    useEffect(() => {
        const getRatings = async () => {
            const ratings = await Axios.get(`https://university-course-helper.herokuapp.com/api/rating/${name}`)
            const data = await ratings.data
            setGetRatings(data)
        }
        getRatings()
    }, [name])

    // Handling submission of new comment
    const createRating = async (e) => {

        // Prevents the post request and reload if no score selected
        if(!score) {
            e.preventDefault();
            alert("Please select a rating")

        }
        else{
            if(!localStorage.getItem("user")){
                try{
                    await Axios.post(`https://university-course-helper.herokuapp.com/api/rating/${name}`, {
                        score,
                        comment,
                        rating_date: new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 10),
                        username: null,
                        course_name: name
                    }).then(() => {
                        window.location.reload();
                    });
                }
                catch(err) {
                }
            }
            else{
                try{
                    await Axios.post(`https://university-course-helper.herokuapp.com/api/rating/${name}`, {
                        score,
                        comment,
                        rating_date: new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 10),
                        username: localStorage.getItem("user"),
                        course_name: name
                    }).then(() => {
                        window.location.reload();
                    });
                }
                catch(err) {
                }
            }
        }
    }

    //used to save the rating id so edit rating knows what to edit
    const SaveRatingIdEdit = (prop) => {
        useEffect(() => {
            setRatingIdEdit(prop.ratingIdEdit)
        })
        return(
            
            <></>
        )
    }


    // Handling submission of new comment
    const editRating = async (e) => {

        //stops prevents the post request and reload if no score selected
        if(!scoreEdit) {
            e.preventDefault();
            alert("Please select a score")
        }
        else{
            try{
                await Axios.put(`https://university-course-helper.herokuapp.com/api/rating/${ratingIdEdit}`, {
                    username: localStorage.getItem("user"),
                    score: scoreEdit,
                    comment: commentEdit,
                    rating_date: new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 10),
                }).then(() => {
                    window.location.reload();
                });
            }
            catch(err) {
            }
        }
    }

    const deleteRating = async (id) => {
        await Axios.delete(`https://university-course-helper.herokuapp.com/api/rating/${id}`).then(() => {
            window.location.reload();
        });
    }

    const SaveRatingIdReport = (prop) => {
        useEffect(() => {
            setRatingIdReport(prop.ratingIdReport)
        })
        return(    
            <></>
        )
    }

    const createReport = async (e) => {

        //prevents the post request and reload if no score selected
        if(!reportReason) {
            e.preventDefault();
            alert("Please select a reason for the report")
        }
        else{
            e.preventDefault();
            try{
                alert("Report Submitted")
                await Axios.post(`https://university-course-helper.herokuapp.com/api/reportInfo`, {
                    reason: reportReason,
                    report_date: new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 10),
                    rating_id: ratingIdReport,
                })
            }
            catch(err) {
            }
        }
    }

    //Print out course info
    return(
        <div className = "info">
            {/*generic course info */}
            {courseInfo.map((course) => {
                return(
                    <div key={course.Course_name} value={course}>
                        <h1 className="centerText">
                            {course.Course_name}
                        </h1>
                        <div>
                            {course.Course_description}
                        </div>
                        <br>
                        </br>
                        <div>
                            - Hours: {course.Hours}
                        </div>
                        <div>
                            - Prerequisites: {' '}
                            {!!(course.Prerequisites)? course.Prerequisites : 'No prerequisites listed'}
                        </div>
                        <div>
                            - Antirequisites: {' '}
                            {!!(course.Antirequisites)? course.Antirequisites : 'No antirequisites listed'}
                        </div>

                        <hr />

                        <h2>
                            Offered in
                        </h2>
                        {/*course info for each semester taught*/}
                        <div>
                            {semesterInfo.map((sem) => {
                                return(
                                    <span className = "semesterInline" key={[sem.Sem_start_year, sem.Sem_start_term]} value={sem}>
                                        <div className = "headingSimulation">
                                            {sem.Sem_start_year} {' '}
                                            {sem.Sem_start_term}
                                        </div>
                                        <div className = "smallText">
                                            Duration: {sem.Duration} months
                                        </div>
                                        <div>
                                            {/* semesterProf returns information on further info on semester (related to prof) as well as prof info*/}
                                            {<SemesterProf name = {course.Course_name} startYear = {sem.Sem_start_year} startTerm = {sem.Sem_start_term} />}
                                        </div>
                                    </span>
                                );
                            })}
                        </div>

                        <hr />

                        <h2>
                            Degrees relevant to
                        </h2>
                        <div className = "headingSimulation">
                            Required for:
                        </div>
                        <div className = "smallText">
                            *note some required courses may not actually be manditory to complete the degree,
                            and instead may be replaced with a different required course to complete the degree
                        <div></div>
                            check detailed degree information on the corasponding degree page for more details
                        </div>
                        <br></br>
                        {/*info on how the course related to degrees*/}
                        {degreeRequiredInfo.map((required) => {
                            return(
                                <div key={required.Degree_name} value={required}>
                                    <Link to={`/degrees/${required.Degree_name}`} style={{ textDecoration: 'none' }}>{required.Degree_name}</Link>
                                </div>
                            );
                        })}
                        <br></br>
                        <div className = "headingSimulation">
                            Optional for:
                        </div>
                        <br></br>
                        {degreeOptionalInfo.map((optional) => {
                            return(
                                <div key={optional.Degree_name} value={optional}>
                                    <Link to={`/degrees/${optional.Degree_name}`} style={{ textDecoration: 'none' }}>{optional.Degree_name}</Link>
                                </div>
                            );
                        })}
                        <hr />

                        <h2>
                            Add Rating
                        </h2>
                        {/*form to submit rating*/}
                        <div className="ratingCreateAlign">
                            <form className="rating" onSubmit={createRating}>

                                <label className="ratingDropdown">
                                    <select value={score || ""} onChange={(e) => {setScore(e.target.value || "" )}}>  
                                        <option value = ""> Rate this class </option>          
                                        <option value = "1"> 1 </option>
                                        <option value = "2"> 2 </option>
                                        <option value = "3"> 3 </option>
                                        <option value = "4"> 4 </option>
                                        <option value = "5"> 5 </option>
                                    </select>
                                </label>
                                <textarea 
                                    className="ratingComment"
                                    type="text" 
                                    maxLength="255"
                                    placeholder="Additional Comments" 
                                    value={comment}
                                    onChange={(e) =>
                                        setComment(e.target.value)}
                                />
                                <div className="ratingButtonAlign">
                                    <input type="submit" value="Add Rating" className="ratingButton" />
                                </div>
                            </form>
                        </div>

                        <hr />

                        <h2>
                            Ratings
                        </h2>

                        {getRatings.map((rating) => {
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
                                        {!rating.Comment? (<></>) : (<>
                                            Comment: {' '}
                                            {rating.Comment}
                                        </>)}
                                    </div>
                                    {isEditRating === rating.Rating_id? ( <div> 
                                        <SaveRatingIdEdit ratingIdEdit = {rating.Rating_id}/>
                                        {/*form for editing ratings when edit button is pressed*/}
                                        <div className="ratingPostedAlign"> 
                                            <form className="rating" onSubmit={editRating}>  
                                                <label className="ratingDropdown">
                                                    <select value={scoreEdit || ""} onChange={(e) => {setScoreEdit(e.target.value || "" )}}>  
                                                    <option value = ""> Rate this class </option>          
                                                        <option value = "1"> 1 </option>
                                                        <option value = "2"> 2 </option>
                                                        <option value = "3"> 3 </option>
                                                        <option value = "4"> 4 </option>
                                                        <option value = "5"> 5 </option>
                                                    </select>
                                                </label>

                                                <textarea  
                                                    className="ratingComment"
                                                    type="text" 
                                                    maxLength="255"
                                                    placeholder="New Comments" 
                                                    value={commentEdit}
                                                    onChange={(e) =>
                                                        setCommentEdit(e.target.value)}
                                                />
                                                <div className="ratingButtonAlign">
                                                    <input type="submit" value="Edit Rating" className="ratingButton" />
                                                </div>
                                            </form>
                                        </div>
                                        <div>
                                            <button className="modifyButton" type="submit" onClick={() => setIsEditRating(null)}> Cancel </button>
                                        </div>
                                    </div> ) : ( <div> 
                                        {isCreateReport === rating.Rating_id? ( <div> 
                                            <SaveRatingIdReport ratingIdReport = {rating.Rating_id}/>
                                            {/*form for creating reports when report button is pressed*/} 
                                            <div className="ratingPostedAlign"> 
                                                <form className="rating" onSubmit={createReport}>  
                                                    <label className="reportDropdown">
                                                        <select value={reportReason || ""} onChange={(e) => {setReportReason(e.target.value || "" )}}>  
                                                            <option value = ""> Reason for report </option>          
                                                            <option value = "Inappropriate Language"> Inappropriate Language </option>
                                                            <option value = "Spam"> Spam </option>
                                                            <option value = "Harassment"> Harassment </option>
                                                            <option value = "Misinformation"> Misinformation </option>
                                                            <option value = "Sharing Personal Information"> Sharing Personal Information </option>
                                                            <option value = "Other"> Other </option>
                                                        </select>
                                                    </label>
                                                    <div className="ratingButtonAlign">
                                                        <input type="submit" value="Submit" className="ratingButton"/>
                                                    </div>
                                                </form>
                                            </div>
                                            <button className="modifyButton" type="submit" onClick={() => setIsCreateReport(null)}> Cancel </button>
                                        </div> ):( <>
                                            {/*display buttons if not editing or reporting and ratings */}
                                            <div>
                                                {/*check user is logged in as well as if they are the one who posted the rating to see if they can edit the rating*/}
                                                {!localStorage.getItem("user") ? '' : <>
                                                    {localStorage.getItem("user") === rating.Username ? <button className="modifyButton" type="submit" onClick={() => setIsEditRating(rating.Rating_id)}> Edit </button> : '' }
                                                </> }
                                                {/*check user is logged in to see if they can delete the rating*/}
                                                {!localStorage.getItem("user") ? '' : <button className="modifyButton" type="submit" onClick={() => deleteRating(rating.Rating_id)}> Delete </button>}

                                                <button className="modifyButton" type="submit" onClick={() => setIsCreateReport(rating.Rating_id)}> Report </button>
                                            </div>
                                        </>)}
                                    </div>)}  
                                    <br>
                                    </br>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    )    
}

export default CourseInfo


