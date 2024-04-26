
// Used to store the username in a local variable to check if the user is logged in (athenticated)
class Auth {

    login(cb, loginInfo) {
        localStorage.setItem("user", loginInfo.username)
        cb()
    }

    logout(cb) {
        localStorage.clear()
        cb()
    }

    isAuthenticated() {
        if (localStorage.getItem("user") == null) {
            return false
        } else {
            return true
        }
    }

}

export default new Auth()