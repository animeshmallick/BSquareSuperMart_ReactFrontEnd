import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CartHelper from "../helpers/CartHelper";

const ProductQuantityContainer = ({ productId, onUpdate }) => {
    const [productQuantity, setProductQuantity] = useState(CartHelper.getQuantity(productId) || 0);

    const handleAdd = (e) => {
        e.stopPropagation();
        e.preventDefault();
        CartHelper.addToCart(productId);
        setProductQuantity(1);
        onUpdate?.();
    };

    const handleIncrease = (e) => {
        e.stopPropagation();
        e.preventDefault();
        CartHelper.updateQuantity(productId, 1);
        setProductQuantity(productQuantity + 1);
        onUpdate?.();
    };

    const handleDecrease = (e) => {
        e.stopPropagation();
        e.preventDefault();
        CartHelper.updateQuantity(productId, -1);
        const newQty = productQuantity - 1;
        setProductQuantity(newQty);
        onUpdate?.();
    };

    return (
        <AnimatePresence mode="wait" initial={false}>
            {productQuantity === 0 ? (
                <motion.button
                    key="add"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAdd}
                    className="w-full mt-2 text-[13px] font-semibold text-emerald-600 border border-emerald-600 rounded-full py-1.5 transition-all hover:bg-emerald-50"
                >
                    ADD
                </motion.button>
            ) : (
                <motion.div
                    key="quantity"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center justify-between px-2 mt-2 w-[100px] h-[36px] border border-emerald-600 rounded-full bg-white text-emerald-600 font-bold text-[15px] shadow-sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                >
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleDecrease}
                        className="w-6 h-6 flex items-center justify-center rounded-full text-xl"
                    >
                        −
                    </motion.button>

                    <span className="text-sm">{productQuantity}</span>

                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleIncrease}
                        className="w-6 h-6 flex items-center justify-center rounded-full text-xl"
                    >
                        +
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProductQuantityContainer;
