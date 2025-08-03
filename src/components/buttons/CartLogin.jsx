import {motion} from "framer-motion";
import React from "react";
import {useNavigate} from "react-router-dom";
const CartLogin = () => {
    const navigate = useNavigate();
    return (
        <motion.button
            onClick={() => navigate("/login?source=cart")}
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-lg font-bold px-6 py-2 rounded-lg shadow-lg transition-all duration-300 border-2 border-yellow-300 hover:shadow-xl ring-2 ring-yellow-200"
        >
            Login to Proceed →
        </motion.button>
    )
}
export default CartLogin;