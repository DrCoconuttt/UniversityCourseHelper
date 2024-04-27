import { useState, useEffect } from "react"
import Axios from "axios"
import { Link } from "react-router-dom";

//The reason semsterProf exists is to allow for a GET command from the database for each semester (startYear+startTerm)
//(Cannot do this in CourseInfo because info needed to read from the database for this call is only gotten part of the way through the return)
const SemesterProf = ({name, startYear, startTerm}) => {

    // Setup state hooks to store data gotten from api calls
    const [semesterProfInfo, setSemesterProfInfo] = useState([])

    // Call apis (for more info on what each does look at client > index.js) 
    useEffect(() => {
            const getSemesterProf = async () => {
                const courses = await Axios.get(`https://universitycoursehelperdeployednetlifyren.onrender.com/api/courseInfo/${name}/${startYear}/${startTerm}/professor`)
                const data = await courses.data
                setSemesterProfInfo(data)
            }
            getSemesterProf()
    }, [name,startYear,startTerm])

    // Print out information specific to the semester and prof being examinined
    return(
        <div>
            {semesterProfInfo.map((semProf) => {
                return(
                    <div key={semProf.Prof_name} value={semProf}>
                        <div>
                            <br>
                            </br>
                            <div>
                                <Link to={`/professors/${semProf.Prof_name}`} style={{ textDecoration: 'none' }}>{semProf.Prof_name}</Link>
                            </div>
                            <div>
                                Rating (rate my professor): {' '}
                                {!!(semProf.Prof_rating)? semProf.Prof_rating : 'Not rated'}
                            </div>
                            <div>
                                Mode of delivery: {' '}
                                {!!(semProf.Mode_of_delivery)? semProf.Mode_of_delivery : 'Not listed'}
                            </div>
                            <div>
                                {!!(semProf.Rate_my_professor_link)? <a target="_blank" rel="noopener noreferrer" href={semProf.Rate_my_professor_link} > Rate my professor</a> : ''}
                            </div>
                            <div>
                                {!!(semProf.Syllabus_link)? <a target="_blank" rel="noopener noreferrer" href={semProf.Syllabus_link} > Syllabus</a> : 'No syllabus provided'}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    )

}  

export default SemesterProf