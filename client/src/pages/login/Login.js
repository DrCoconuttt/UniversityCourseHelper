import { useState } from "react"
import Axios from "axios"
import { Navigate } from "react-router-dom"
import auth from "../../context/Auth";

// onLogin is called when the user succesfully logs in
const Login = ({onLogin}) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loginError, setLoginError] = useState(false) // Used for wrong username/password

    // Authenticates inputed username and password
    const onSubmit = async (e) => {
        e.preventDefault()
        
        if(!username) {
            alert("Please enter a username")
            return
        }

        if (!password) {
            alert("Please enter a password")
            return
        }

        // Fetch whether the password was accurate or not from database
        const check = await Axios.get(`https://universitycoursehelperdeployednetlifyren.onrender.com/api/user/${username}/${password}`)
        const data = await check.data

        // Log in if passowrd is accurate
        if (data === true){
            onLogin({username}) //NOTE this used to be {username,password} is something breaks take a peek
            setLoginError(false)
        }
        else{
            setLoginError(true)
        }
        setUsername("")
        setPassword("")
    }

    return (
        <>
            {/* If already logged in return user to homepage (courselist) */}
            {auth.isAuthenticated() ? (
                <Navigate to={"/"} />
            ) : (
                <div className="accountAlign"> 
                    <form className="account" onSubmit={onSubmit}>
                    {/* If not already logged in create form to rerieve username and password input */}
                        <h1 className="accountText">
                            Sign In
                        </h1>
                        
                        {loginError && (<p className="accountText">Incorrect username or password</p>)}

                        <input 
                            className = "accountInput"
                            type="text" 
                            placeholder="Username" 
                            value={username} 
                            onChange={(e) =>
                                setUsername(e.target.value)}
                        />

                        <input 
                            className = "accountInput"
                            type="password" 
                            placeholder="Password" 
                            value={password} 
                            onChange={(e) =>
                                setPassword(e.target.value)}
                        />

                        <div className="accountButtonAlign">
                            <input type="submit" value="Login" className="accountButton" />
                        </div>
                    </form>
                </div>
            )
        }
        </>
    )
}

export default Login