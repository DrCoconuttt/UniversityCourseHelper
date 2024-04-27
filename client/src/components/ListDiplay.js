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
                        <div key={val.Course_name} value={val}>
                            {val.Course_name.toLowerCase().includes(search.toString().toLowerCase())? 
                            <Link to={`/courses/${val.Course_name}`} style={{ textDecoration: 'none' }}> {val.Course_name} </Link> : ""}
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
                        <div key={val.Prof_name} value={val}>
                            {val.Prof_name.toLowerCase().includes(search.toString().toLowerCase())? 
                            <Link to={`/professors/${val.Prof_name}`} style={{ textDecoration: 'none' }}>{val.Prof_name}</Link> : ""}
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
                        <div key={val.Degree_name} value={val}>
                            {val.Degree_name.toLowerCase().includes(search.toString().toLowerCase())? 
                            <Link to={`/degrees/${val.Degree_name}`} style={{ textDecoration: 'none' }}>{val.Degree_name}</Link> : ""}
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
                        <div key={val.Report_id} value={val}>
                            <Link to={`/reports/${val.Report_id}`} style={{ textDecoration: 'none' }}>Report {val.Report_id}</Link>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default ListDisplay