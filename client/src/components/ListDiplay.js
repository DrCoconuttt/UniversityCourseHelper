import { Link } from "react-router-dom";

//display a list of links
const ListDisplay = ({list,type,search}) => {

    //determine which page the list is being displayed on to determine where the link should lead
    if (type === "course"){
        //returns every course name in the given list and turns them into links to the corasponding course page
        //(note all other if statements below do the same thing, just with a different path)
        return (
            <div className = "listDisplay">
                {list.map((val) => {
                    return(
                        <div key={val.course_name} value={val}>
                            {val.course_name.toLowerCase().includes(search.toString().toLowerCase())? 
                            <Link to={`/courses/${val.course_name}`} style={{ textDecoration: 'none' }}> {val.course_name} </Link> : ""}
                        </div>
                    );
                    })}
            </div>
        )
    }
    else if (type === "professor"){
        return (
            <div className = "listDisplay">
                {list.map((val) => {
                    return(
                        <div key={val.prof_name} value={val}>
                            {val.prof_name.toLowerCase().includes(search.toString().toLowerCase())? 
                            <Link to={`/professors/${val.prof_name}`} style={{ textDecoration: 'none' }}>{val.prof_name}</Link> : ""}
                        </div>
                    );
                })}
            </div>
        )
    }
    else if (type === "degree"){
        return (
            <div className = "listDisplay">
                {list.map((val) => {
                    return(
                        <div key={val.degree_name} value={val}>
                            {val.degree_name.toLowerCase().includes(search.toString().toLowerCase())? 
                            <Link to={`/degrees/${val.degree_name}`} style={{ textDecoration: 'none' }}>{val.degree_name}</Link> : ""}
                        </div>
                    );
                })}
            </div>
        )
    }
    else if (type === "report"){
        return (
            <div className = "listDisplay">
                {list.map((val) => {
                    return(
                        <div key={val.report_id} value={val}>
                            <Link to={`/reports/${val.report_id}`} style={{ textDecoration: 'none' }}>Report {val.report_id}</Link>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default ListDisplay