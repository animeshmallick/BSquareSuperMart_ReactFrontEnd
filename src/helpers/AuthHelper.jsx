import axios from "axios";

class AuthHelper {
    logout() {
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("selectedAddress");
        sessionStorage.removeItem("selectedPayment")
    }

    async isLoggedIn() {
        try {
            const token = sessionStorage.getItem("authToken") || "";
            if (!token){
                this.logout()
                return false;
            }
            const res = await axios.post(
                "https://api.qa.bsquaresupermart.in/isvalidToken",
                {},
                {
                    headers: {
                        'x-authorization': `Bearer ${token}`
                    }
                }
            );

            if (res.data?.is_valid_user) {
                return true;
            } else {
                this.logout();
                return false;
            }
        } catch (error) {
            console.error("Token validation failed:", error);
            this.logout();
            return false;
        }
    }

    getToken(){
        return sessionStorage.getItem("authToken");
    }
}
export default new AuthHelper();