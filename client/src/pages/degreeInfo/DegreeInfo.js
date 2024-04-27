import React from 'react'
import { useLocation } from "react-router"
import { useState, useEffect } from "react"
import Axios from "axios"
import { Link } from "react-router-dom";

const DegreeInfo = () => {
    
    // Read the URL to retrive the course name
    const location = useLocation()
    const name = decodeURI(location.pathname.split("/")[2]);

    // Setup state hooks to store data gotten from api calls
    const [degreeInfo, setDegreeInfo] = useState([])
    const [requiredCourseInfo, setRequiredCourseInfo] = useState([])
    const [optionalCourseInfo, setOptionalCourseInfo] = useState([])

    // Call get apis (for more info on what each does look at client > index.js)
    useEffect(() => {
        const getDegrees = async () => {
            const degrees = await Axios.get(`https://universitycoursehelperdeployednetlifyren.onrender.com/api/degreeInfo/${name}`)
            const data = await degrees.data
            setDegreeInfo(data)
        }
        getDegrees()
    }, [name])

    useEffect(() => {
        const getRequiredCourses = async () => {
            const requiredCourses = await Axios.get(`https://universitycoursehelperdeployednetlifyren.onrender.com/api/degreeInfo/${name}/coursesRequired`)
            const data = await requiredCourses.data
            setRequiredCourseInfo(data)
        }
        getRequiredCourses()
    }, [name])

    useEffect(() => {
        const getOptionalCourses = async () => {
            const optionalCourses = await Axios.get(`https://universitycoursehelperdeployednetlifyren.onrender.com/api/degreeInfo/${name}/coursesOptional`)
            const data = await optionalCourses.data
            setOptionalCourseInfo(data)
        }
        getOptionalCourses()
    }, [name])

    // Print out degree info
    return (
        <div className = "info">
            {degreeInfo.map((degree) => {
                return(
                    <div key={degree.Degree_name} value={degree}>
                        <h1 className="centerText">
                            {degree.Degree_name}
                        </h1> 
                        <div>
                            <a target="_blank" rel="noopener noreferrer" href={degree.Degree_link} > Detailed degree information</a>
                        </div>
                        <hr />
                        {/* only print courses if looking at major or minor degree, not other (other has flag 3) */}
                        {degree.Flag === 3?
                            <h2>
                                Courses not listed for other degrees
                            </h2> :
                            <>
                                <br></br>
                                <div className = "headingSimulationLarge">
                                    Required courses
                                </div>
                                <div className = "smallText">
                                    *note some required courses may not actually be manditory to complete the degree,
                                    and instead may be replaced with a different required course to complete the degree
                                <div></div>
                                    check detailed degree information for more details
                                </div>
                                <br></br>
                            </>
                        }
                        {requiredCourseInfo.map((course) => { 
                            return(
                                <div key={course.Course_name} value={course}>
                                    <Link to={`/courses/${course.Course_name}`} style={{ textDecoration: 'none' }}>{course.Course_name}</Link>
                                </div>
                            );
                        })}
                        {degree.Flag === 3?
                        <> </> :
                        <>
                        <hr />
                            <br></br>
                            <div className = "headingSimulationLarge">
                                Optional courses
                            </div>
                            <br></br>
                        </>
                        }
                        {optionalCourseInfo.map((course) => {
                            return(
                                <div key={course.Course_name} value={course}>
                                    <Link to={`/courses/${course.Course_name}`} style={{ textDecoration: 'none' }}>{course.Course_name}</Link>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    )
}

export default DegreeInfo


