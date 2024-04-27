import { useState, useEffect } from "react"
import Axios from "axios"
import ListDisplay from '../../components/ListDiplay';

const DegreeList = () => {

    // State hooks are used to list of fauculties to be displayed and what is being searched
    const [degreeListMajor, setDegreeListMajor] = useState([])
    const [degreeListMinor, setDegreeListMinor] = useState([])
    const [degreeListOther, setDegreeListOther] = useState([])
    const [search, setSearch] = useState([])

    // This is used to tell ListDisplay which page to render the list (one of /,/professors,/faculties,/reports)
    const type = "degree"

    // Updates the list of degrees, storing types major, minor and other seperatly
    useEffect(() => {
        const getDegreesMajor = async () => {
            const DegreesMajor = await Axios.get("https://universitycoursehelperdeployednetlifyren.onrender.com/api/degreeList/major")
            const data = await DegreesMajor.data
            setDegreeListMajor(data)
        }
        getDegreesMajor()
    }, [])

        
    useEffect(() => {
        const getDegreesMinor = async () => {
            const DegreesMinor = await Axios.get("https://universitycoursehelperdeployednetlifyren.onrender.com/api/degreeList/minor")
            const data = await DegreesMinor.data
            setDegreeListMinor(data)
        }
        getDegreesMinor()
    }, [])

    useEffect(() => {
        const getDegreesOther = async () => {
            const DegreesOther = await Axios.get("https://universitycoursehelperdeployednetlifyren.onrender.com/api/degreeList/other")
            const data = await DegreesOther.data
            setDegreeListOther(data)
        }
        getDegreesOther()
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
                <h1 className="list">
                    Majors
                </h1>
                <div className="list">
                    <ListDisplay list = {degreeListMajor} type = {type} search = {search} />
                </div>
                <h1 className="list">
                    Minors
                </h1>
                <div className="list">
                    <ListDisplay list = {degreeListMinor} type = {type} search = {search} />
                </div>
                <h1 className="list">
                    Other
                </h1>
                <div className="list">
                    <ListDisplay list = {degreeListOther} type = {type} search = {search} />
                </div>
        </div>
    )
}

export default DegreeList