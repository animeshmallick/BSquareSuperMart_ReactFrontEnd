import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import CartHelper from "../helpers/CartHelper";
import Header from "../components/header";
import Footer from "../components/footer";
import AuthHelper from "../helpers/AuthHelper";
import PageTitle from "../components/PageTitle";
import ContinueShopping from "../components/buttons/ContinueShopping";
import ProceedToCheckout from "../components/buttons/ProceedToCheckout";
import CartLogin from "../components/buttons/CartLogin";
import ClearCart from "../components/buttons/ClearCart";
import CartSummary from "../components/checkout/CartSummary";

const CartPage = () => {
    const [localCart, setLocalCart] = useState(CartHelper.getStoredCart());
    const [cart, setCart] = useState({ products: [], bill: null });
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const fetchCartData = async () => {
            if (localCart && localCart.length > 0) {
                try {
                    const res = await axios.post("https://api.qa.bsquaresupermart.in/cart", localCart);
                    setCart(res.data);
                } catch (err) {
                    console.error("Error fetching cart data:", err);
                    setCart({ products: [], bill: null });
                }
            } else {
                setCart({ products: [], bill: null });
            }
        };

        fetchCartData();
    }, [localCart]);

    useEffect(() => {
        const validateIsLoggedIn = async () => {
            const loggedIn = await AuthHelper.isLoggedIn();
            setIsLoggedIn(loggedIn);
        };
        validateIsLoggedIn();
    }, []);

    const onUpdate = () => {
        setLocalCart(CartHelper.getStoredCart());
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50">
            <Header />
            <main className="flex-grow px-2 sm:px-6 md:px-12 py-3">
                <PageTitle title={"🛒 Your Cart"} size={"small"} />
                <CartSummary
                    products={cart.products}
                    bill={cart.bill}
                    showBillFlag={true}
                    onUpdate={onUpdate}
                />

                <div className="flex justify-center mt-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md"
                    >
                        {!isLoggedIn ? (
                            <CartLogin />
                        ) : (
                            <ProceedToCheckout />
                        )}
                        <ContinueShopping />
                        <ClearCart onClear={onUpdate} />
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CartPage;