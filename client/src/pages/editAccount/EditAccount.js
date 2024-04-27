import { useState } from "react"
import Axios from "axios"

const EditAccount = () => {
    const [newPassword, setNewPassword] = useState("")
    const [newUsername, setNewUsername] = useState("")
    const [success, setSuccess] = useState(false)
    const [failure, setFailure] = useState(false)

    // Make sure user submitted a username and password
    const onSubmit = async (e) => {
        e.preventDefault()
        let successfulUpdate = false // Keeps track of whether the update was successful

        if(!newUsername) {
            alert("Please enter a username")
            return
        }

        if (!newPassword) {
            alert("Please enter a password")
            return
        }

        // Attempt to edit account using entered new username and new password
        try {
            await Axios.put(`https://university-course-helper.herokuapp.com/api/user/${localStorage.getItem("user")}`, {newUsername, newPassword})
            successfulUpdate = true
        } catch (err) {   
            console.log(err.response.data.message)
        }
        
        // If the update was successful, set the new username in local storage
        if (successfulUpdate) {
            localStorage.setItem("user", newUsername) // Update username in local storage
            setSuccess(true)
            setFailure(false)
        } else {
            setSuccess(false)
            setFailure(true)
        }

        // Clear input fields
        setNewUsername("")
        setNewPassword("")
    }

    return (
        <div className="accountAlign">
            {/* Form to retrieve inputed username and password from user */}
            <form className="account" onSubmit={onSubmit}>
                    <h1 className="accountText">
                        Edit Account
                    </h1>
                {success && <p className="accountText"> Account Updated</p>}
                {failure && <p className="accountText">Username already taken</p>}
                <input
                    className = "accountInput"
                    type="text"
                    placeholder="New Username"
                    value={newUsername}
                    onChange={(e) =>
                        setNewUsername(e.target.value)}
                />
                <input
                    className = "accountInput"
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) =>
                        setNewPassword(e.target.value)}
                />
                <div className="accountButtonAlign">
                    <input type="submit" value="Edit" className="accountButton" />
                </div>
            </form>
        </div>
    )
}

export default EditAccount