import { Link } from "react-router-dom";
import {BsInfoSquareFill} from "react-icons/bs"


const Navbar = ({onLogout, loggedIn}) => {

    // Return a list of links to be displayed on the navbar
    return (
        <div className="navbar">
            <span className="navbarLeft">
                <Link to="/about" className="aboutIcon">
                    <BsInfoSquareFill />
                </Link>
            </span>
            <span className="navbarCenter">
                <Link to="/">Courses</Link>
                <Link to="/professors">Professors</Link>
                <Link to="/degrees">Degrees</Link>
            </span>
            <span className="navbarRight">
                {loggedIn && <Link to="/reports">Reports</Link>}   
                {/* Logout button is displayed only when user is logged in */}
                {loggedIn ? <Link to="/"><button className="shortButton" type="submit" onClick={onLogout}> Logout </button></Link>
                : <Link to="/login"><button className="shortButton" type="submit"> Login </button></Link>}

                {/* Edit Account button is displayed wen logged in and create account button is displayed when logged out */}
                {loggedIn ? <Link to="/edit-account"><button className="longButton" type="submit"> Edit Account </button></Link>
                : <Link to="/create-account"><button className="longButton" type="submit"> Create Account </button></Link>}
            </span>  
        </div>
    )
}

export default Navbar