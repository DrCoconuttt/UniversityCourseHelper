import { useState, useEffect } from "react"
import Axios from "axios"
import ListDisplay from '../../components/ListDiplay';

const ProfessorList = () => {

    // State hooks are used to list professors and what is being searched
    const [professorList, setProfessorList] = useState([])
    const [search, setSearch] = useState([])

    // This is used to tell ListDisplay which page to render the list (one of /,/professors,/faculties,/reports)
    const type = "professor"

    // Updates the list of professors
    useEffect(() => {
        const getProfessors = async () => {
            const Professors = await Axios.get("https://universitycoursehelperdeployednetlifyren.onrender.com/api/profList")
            const data = await Professors.data
            setProfessorList(data)
        }
        getProfessors()
    }, [])

    //Call Listdisplay to render the list
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
            <div className="list">
                <ListDisplay list = {professorList} type = {type} search = {search} />
            </div>
        </div>
    )
}

export default ProfessorList