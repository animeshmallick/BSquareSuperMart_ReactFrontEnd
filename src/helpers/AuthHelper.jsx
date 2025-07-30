class AuthHelper {
    logout() {
        localStorage.removeItem("authToken");
    }

    isLoggedIn() {
        return !!localStorage.getItem("authToken");
    }
    getToken(){
        return localStorage.getItem("authToken");
    }
}
export default new AuthHelper();