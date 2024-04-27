import React from 'react'
import { useLocation } from "react-router"
import { useState, useEffect } from "react"
import Axios from "axios"
import { Link } from "react-router-dom";

const ProfInfo = () => {

    // Reads the URL for the course name
    const location = useLocation()
    const name = decodeURI(location.pathname.split("/")[2]);

    // Setup state hooks to store data gotten from api calls
    const [profInfo, setProfInfo] = useState([])
    const [courseInfo, setCourseInfo] = useState([])

    // Call apis (for more info on what each does look at client > index.js)
    useEffect(() => {
        const getProfessors = async () => {
            const professors = await Axios.get(`https://universitycoursehelperdeployednetlifyren.onrender.com/api/profInfo/${name}`)
            const data = await professors.data.rows
            setProfInfo(data)
        }
        getProfessors()
    }, [name])

    useEffect(() => {
        const getCourses = async () => {
            const courses = await Axios.get(`https://universitycoursehelperdeployednetlifyren.onrender.com/api/profInfo/${name}/courses`)
            const data = await courses.data.rows
            setCourseInfo(data)
        }
        getCourses()
    }, [name])

    // Prints out course info
    return (
        <div className = "info">
            {profInfo.map((prof) => {
                return(
                    <div key={prof.prof_name} value={prof}>
                        <h1 className="centerText">
                            {prof.prof_name}
                        </h1> 
                        <div>
                            Rating (rate my professor): {' '}
                            {!!(prof.prof_rating)? prof.prof_rating : 'Not rated'}
                        </div>
                        <div>
                            {!!(prof.rate_my_professor_link)? <a target="_blank" rel="noopener noreferrer" href={prof.rate_my_professor_link} > Rate my professor</a> : ''}
                        </div>
                        <hr />
                        <h2>
                            Has offered
                        </h2>
                        {courseInfo.map((course) => {
                            return(
                                <div key={course.course_name} value={course}>
                                    <Link to={`/courses/${course.course_name}`} style={{ textDecoration: 'none' }}>{course.course_name}</Link>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>   
    )
}

export default ProfInfo