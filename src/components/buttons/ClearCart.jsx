import React from "react";
import { motion } from "framer-motion";
import CartHelper from "../../helpers/CartHelper";

const CartClearButton = ({ onClear }) => {
    const handleClearCart = () => {
        CartHelper.clearCart();
        if (onClear) onClear(); // Call refreshCart or UI update from parent
    };

    return (
        <motion.button
            onClick={handleClearCart}
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-rose-500 hover:bg-rose-600 text-white text-lg font-semibold px-6 py-1 rounded-lg shadow-md transition-all duration-300 border-2 border-rose-400 hover:shadow-lg ring-2 ring-rose-300"
        >
            🗑️ Clear Cart
        </motion.button>
    );
};

export default CartClearButton;
