import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tilt from "react-parallax-tilt";
import CartHelper from "../helpers/CartHelper";
import confetti from "canvas-confetti";

const ProductQuantityContainer = ({ productId, onUpdate }) => {
    const [productQuantity, setProductQuantity] = useState(CartHelper.getQuantity(productId) || 0);

    const vibrate = () => {
        if ("vibrate" in navigator) {
            navigator.vibrate(50);
        }
    };

    const celebrate = () => {
        confetti({
            particleCount: 60,
            spread: 90,
            origin: { y: 0.6 },
            scalar: 0.8,
        });
    };

    const handleAdd = (e) => {
        e.stopPropagation();
        e.preventDefault();
        CartHelper.addToCart(productId);
        setProductQuantity(1);
        vibrate();
        celebrate();
        onUpdate?.();
    };

    const handleIncrease = (e) => {
        e.stopPropagation();
        e.preventDefault();
        CartHelper.updateQuantity(productId, 1);
        setProductQuantity(productQuantity + 1);
        vibrate();
        onUpdate?.();
    };

    const handleDecrease = (e) => {
        e.stopPropagation();
        e.preventDefault();
        CartHelper.updateQuantity(productId, -1);
        setProductQuantity(productQuantity - 1);
        vibrate();
        onUpdate?.();
    };

    return (
        <AnimatePresence mode="wait" initial={false}>
            {productQuantity === 0 ? (
                <motion.div
                    key="add"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="mt-2"
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
                >
                    <Tilt
                        glareEnable={true}
                        glareMaxOpacity={0.25}
                        glareColor="#ffffff"
                        glarePosition="bottom"
                        tiltMaxAngleX={12}
                        tiltMaxAngleY={12}
                        perspective={1000}
                        className="w-fit inline-block"
                    >
                        <motion.button
                            onClick={handleAdd}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative text-m bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-xl font-semibold shadow-xl ring-2 ring-emerald-300 hover:ring-4 focus:outline-none animate-floating animate-pulse overflow-hidden"
                        >
                            <span className="glow-text z-10 relative">ADD</span>
                            <span className="absolute top-0 left-0 w-full h-full rounded-xl blur-[6px] bg-emerald-500 opacity-20 animate-ping z-0" />
                        </motion.button>
                    </Tilt>
                </motion.div>
            ) : (
                <motion.div
                    key="quantity"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="w-fit flex items-center space-x-1 mt-2 px-1 py-1 rounded-full bg-white shadow-xl ring-2 ring-emerald-200 backdrop-blur-md"
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
                >
                    <motion.button
                        whileHover={{ scale: 1.15, rotate: -12 }}
                        whileTap={{ scale: 0.85 }}
                        transition={{ type: "spring", stiffness: 250 }}
                        onClick={handleDecrease}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 text-xl font-bold shadow-md transition-all ring-1 ring-white"
                    >
                        −
                    </motion.button>

                    <motion.span
                        key={productQuantity}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.05, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="p-1.5 text-l font-bold"
                    >
                        {productQuantity}
                    </motion.span>

                    <motion.button
                        whileHover={{ scale: 1.15, rotate: 12 }}
                        whileTap={{ scale: 0.85 }}
                        transition={{ type: "spring", stiffness: 250 }}
                        onClick={handleIncrease}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full w-8 h-8 text-2xl font-bold shadow-md transition-all ring-1 ring-white"
                    >
                        +
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProductQuantityContainer;
