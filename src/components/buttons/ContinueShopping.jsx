import {motion} from "framer-motion";
import React from "react";
import {useNavigate} from "react-router-dom";
const ContinueShopping = () => {
    const navigate = useNavigate();
    return (
        <motion.button
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white hover:bg-gray-100 text-emerald-700 border border-emerald-300 font-medium px-6 py-1 rounded-lg shadow-md transition-all duration-300 ring-1 ring-emerald-100"
        >
            ← Continue Shopping
        </motion.button>
    )
}
export default ContinueShopping;