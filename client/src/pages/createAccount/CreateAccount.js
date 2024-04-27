import { useState } from "react"
import Axios from "axios"

const CreateAccount = () => {
    const [Password, setPassword] = useState("")
    const [Username, setUsername] = useState("")
    const [success, setSuccess] = useState(false)
    const [failure, setFailure] = useState(false)

    // Make sure user submitted a username and password
    const onSubmit = async (e) => {
        e.preventDefault()

        if(!Username) {
            alert("Please enter a username")
            return
        }

        if (!Password) {
            alert("Please enter a password")
            return
        }

        // Attempt to create account using entered username and password
        try {
            // Check if username in database
            const usernameAlreadyDefined = await Axios.get(`https://university-course-helper.herokuapp.com/api/user/${Username}`)
            const data = await usernameAlreadyDefined.data

            if (data) {
                setSuccess(false)
                setFailure(true)
            } else {
                // If username is not already defined create a new account
                Axios.post(`https://university-course-helper.herokuapp.com/api/user/`, {
                    username : Username,
                    password : Password
                })
                setSuccess(true)
                setFailure(false)
            }
        } catch (err) {
            console.log(err.response.data.message)
            setSuccess(false)
            setFailure(true)
        }
        
        // Clear input fields
        setUsername("")
        setPassword("")
    }

    return (
        // Form to retrieve inputed username and password from user
        <div className="accountAlign">
            <form className="account" onSubmit={onSubmit}>
                <br></br>
                <div className="accountHeadingSimulation">
                    Create Account
                </div>
                <div className="accountTextSmall">
                    Being able to freely create an moderator account is for demo purposes
                </div>
                <br></br>
                {success && <p className="accountText"> Account created</p>}
                {failure && <p className="accountText">Username already taken</p>}
                <input
                    className = "accountInput"
                    type="text"
                    placeholder="Username"
                    value={Username}
                    onChange={(e) =>
                        setUsername(e.target.value)}
                />
                <input
                    className = "accountInput"
                    type="password"
                    placeholder="Password"
                    value={Password}
                    onChange={(e) =>
                        setPassword(e.target.value)}
                />
                <div className="accountButtonAlign">
                    <input type="submit" value="Create" className="accountButton" />
                </div>
            </form>
        </div>
    )
}

export default CreateAccount