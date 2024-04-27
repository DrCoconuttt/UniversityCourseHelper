import { useState, useEffect } from "react"
import Axios from "axios"
import ListDisplay from '../../components/ListDiplay'


const CourseList = () => {

    // This is the list of courses to be displayed
    const [courseList, setCourseList] = useState([])
    const [search, setSearch] = useState([])

    // This is used to tell ListDisplay which page to render the list (one of /,/professors,/faculties,/reports)
    const type = "course"

    // Update the list of courses
    useEffect(() => {
        const getCourses = async () => {
            const courses = await Axios.get(`https://university-course-helper.herokuapp.com/api/courseList`)
            const data = await courses.data
            setCourseList(data)
        }
        getCourses()
    }, [])

    // Call ListDisplay to render the list
    return(
        <div>
            <h1 className="listTitle">
                University Course Helper
            </h1>
            <div className="listSearch" >
                <input 
                    type="text" 
                    placeholder="Search Courses" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="list" >
                <ListDisplay list = {courseList} type = {type} search = {search} />
            </div>
        </div>
    )
}

export default CourseList