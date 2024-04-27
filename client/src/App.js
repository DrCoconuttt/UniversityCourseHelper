import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Navbar from './components/Navbar';
import About from "./pages/about/About";
import CourseList from "./pages/courseList/CourseList";
import ProfessorList from "./pages/professorList/ProfessorList";
import DegreeList from "./pages/degreeList/DegreeList";
import ReportList from "./pages/reportList/ReportList";
import Login from "./pages/login/Login";
import CreateAccount from "./pages/createAccount/CreateAccount";
import EditAccount from "./pages/editAccount/EditAccount";
import CourseInfo from "./pages/courseInfo/CourseInfo";
import DegreeInfo from "./pages/degreeInfo/DegreeInfo";
import ReportInfo from "./pages/reportInfo/ReportInfo";
import ProfessorInfo from "./pages/professorInfo/ProfessorInfo";
import auth from "./context/Auth";
import { Navigate } from "react-router-dom";

const App = () => {
    const [loggedInAsModerator, setLoggedInAsModerator] = useState(false) // Keep track of whether the user is logged in as moderator

    // Updates whether user is logged in
    useEffect(() => {
        auth.isAuthenticated() ? setLoggedInAsModerator(true): setLoggedInAsModerator(false)
    }, [])

    // Login a user
    const login = (loginInfo) => {
        setLoggedInAsModerator(true) 
        auth.login(() => {
            // Redirects to home page upon login
            <Navigate to={"/"} />
        }, loginInfo);
    }

    // Logout a user
    const logout = (loginInfo) => {
        auth.logout(() => {
            // Redirects to home page upon logout
            <Navigate to={"/"} />
        })
        setLoggedInAsModerator(false) 
    }

    // Renders current page as well as persistent elements, such as navbar
    return ( 
        <Router>
            <div className="container">
                <Navbar onLogout={logout} loggedIn={loggedInAsModerator}/>
                <Routes>
                    <Route path="/" element={<CourseList />}></Route>
                    <Route path="/about" element={<About />}></Route>
                    <Route path="/professors" element={<ProfessorList />}></Route>
                    <Route path="/degrees" element={<DegreeList />}></Route>
                    <Route path="/reports" element={
                        <RequireAuth redirectTo="/login"> <ReportList /> </RequireAuth> } />
                    <Route path="/login" element={<Login onLogin={login}/> } />
                    <Route path="/create-account" element={
                        loggedInAsModerator ? <CourseList /> : <CreateAccount />}></Route>
                    <Route path="/edit-account" element={
                        <RequireAuth redirectTo="/"> <EditAccount /> </RequireAuth> } />
                    <Route path="/courses/:courseId" element={<CourseInfo />}></Route>
                    <Route path="/degrees/:degreeId" element={<DegreeInfo />}></Route>
                    <Route path="/reports/:reportId" element={loggedInAsModerator ? <ReportInfo /> : <Login onLogin={login}/>}></Route>
                    <Route path="/professors/:professorId" element={<ProfessorInfo />}></Route>
                </Routes>
            </div>
        </Router>
    )
}

// Makes sure a user is authenticated before allowing them to access a route
function RequireAuth({ children, redirectTo } ) {
    let isAuthenticated = auth.isAuthenticated()
    return isAuthenticated ? children : <Navigate to={redirectTo} />;
}

export default App;
