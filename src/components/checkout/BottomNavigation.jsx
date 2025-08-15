import {motion} from "framer-motion";
import React from "react";
import {useNavigate} from "react-router-dom";

const BottomNavigation = ({onBack, onNext, selected, placeOrder}) => {
    const navigate = useNavigate();
    return (
        <motion.div
            className="mt-6 flex flex-wrap justify-between items-center gap-3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Back Button */}
            {onBack !== null && (
                <button
                    onClick={onBack}
                    className="text-gray-600 hover:text-black text-sm md:text-base transition-colors duration-300"
                >
                    ← Back
                </button>
            )}

            {/* Go to Cart Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/cart")}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-4 md:px-6 rounded-lg shadow-md transition-colors duration-300"
            >
                🛒 Go to Cart
            </motion.button>

            {/* Next Button */}
            {onNext !== null && (
                <button
                    onClick={onNext}
                    disabled={!selected}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg shadow-lg transition"
                >
                    Next →
                </button>
            )}
        </motion.div>
    );
}
export default BottomNavigation;