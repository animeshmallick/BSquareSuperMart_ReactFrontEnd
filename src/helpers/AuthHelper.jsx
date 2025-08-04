// src/helpers/AuthHelper.js
import axios from "axios";

const TOKEN_KEY = "authToken";
const ADDRESS_KEY = "selectedAddress";
const PAYMENT_KEY = "selectedPayment";
const ALL_PRODUCT_KEY = "allProducts";
const ALL_PRODUCT_TIMESTAMP_KEY = "allProducts_timestamp";

class AuthHelper {
    /**
     * Removes session storage items on logout.
     */
    logout() {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(ADDRESS_KEY);
        sessionStorage.removeItem(PAYMENT_KEY);
        sessionStorage.removeItem(ALL_PRODUCT_KEY);
        sessionStorage.removeItem(ALL_PRODUCT_TIMESTAMP_KEY);
    }

    /**
     * Gets the saved auth token.
     * @returns {string|null}
     */
    getToken() {
        return sessionStorage.getItem(TOKEN_KEY);
    }

    /**
     * Saves a new auth token.
     * @param {string} token
     */
    setToken(token) {
        sessionStorage.setItem(TOKEN_KEY, token);
    }

    /**
     * Validates the token with backend.
     * @returns {Promise<boolean>}
     */
    async isLoggedIn() {
        const token = this.getToken();
        if (!token) {
            this.logout();
            return false;
        }

        try {
            const response = await axios.post(
                `https://api.qa.bsquaresupermart.in/isvalidToken`,
                {},
                {
                    headers: {
                        "x-authorization": `Bearer ${token}`,
                    },
                    timeout: 5000,
                }
            );

            if (response.status === 200 && response.data?.is_valid_user) {
                return true;
            } else {
                this.logout();
                return false;
            }
        } catch (error) {
            console.error("Token validation failed:", error.message);
            this.logout();
            return false;
        }
    }
}

export default new AuthHelper();
