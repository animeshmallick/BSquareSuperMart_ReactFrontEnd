import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import CartHelper from "../helpers/CartHelper";
import {useProducts} from "../hooks/useProducts";

const CartFooter = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState(CartHelper.getStoredCart());
    const { data: allProducts, isLoading, error } = useProducts();

    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        setInterval(() => {setCart(CartHelper.getStoredCart());}, 500);
        setTotalPrice(CartHelper.getTotalPrice(allProducts, cart));
    }, [cart]);

    if (cart.length === 0) return null;

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 160, damping: 18 }}
            className="fixed bottom-6 ml-[10%] transform -translate-x-1/2 z-50 w-[80%] sm:w-[90%] md:w-[70%] max-w-md
               bg-emerald-600 text-white rounded-2xl px-4 py-3 shadow-xl flex items-center justify-between"
            onClick={() => navigate("/cart")}
        >
            <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2}
                     viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 7M7 13l-2 5m14-5l2 5m-12 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm10 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
                </svg>
                <div className="flex flex-col text-sm leading-tight">
                    <span className="font-medium">{cart.length} item{cart.length > 1 ? "s" : ""}</span>
                    <span className="text-white/90 font-semibold">₹{totalPrice}</span>
                </div>
            </div>
            <button className="text-sm font-semibold hover:scale-105 transition-all duration-200">
                View Cart →
            </button>
        </motion.div>
    );
};

export default CartFooter;
