import {motion} from "framer-motion";
import React from "react";
import {useNavigate} from "react-router-dom";
const ProceedToCheckout = () => {
    const navigate = useNavigate();
    return (
        <motion.button
            onClick={() => navigate("/checkout")}
            whileHover={{ scale: 1.07, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xl font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-300 border-2 border-emerald-500 hover:shadow-xl ring-2 ring-emerald-300"
        >
            Proceed to Checkout →
        </motion.button>
    )
}
export default ProceedToCheckout;