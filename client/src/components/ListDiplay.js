import { Link } from "react-router-dom";

//display a list of links
const ListDisplay = ({list,type,search}) => {

  console.log("HELLO IM IN LISTDSIPLAY")
  console.log(list)
  console.log(type)
  console.log(search)

    //determine which page the list is being displayed on to determine where the link should lead
    if (type === "course"){
        //returns every course name in the given list and turns them into links to the corasponding course page
        //(note all other if statements below do the same thing, just with a different path)
        return (
            <div className = "listDisplay">

            </div>
        )
    }
    else if (type === "professor"){
        return (
            <div className = "listDisplay">

            </div>
        )
    }
    else if (type === "degree"){
        return (
            <div className = "listDisplay">

            </div>
        )
    }
    else if (type === "report"){
        return (
            <div className = "listDisplay">

            </div>
        )
    }
}

export default ListDisplay