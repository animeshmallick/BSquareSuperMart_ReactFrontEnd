import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CartHelper from "../helpers/CartHelper";
import Header from "../components/header";
import Footer from "../components/footer";
import AuthHelper from "../helpers/AuthHelper";
import PageTitle from "../components/PageTitle";
import ProductQuantityContainer from "../components/ProductQuantityContainer";
import ContinueShopping from "../components/buttons/ContinueShopping";
import ProceedToCheckout from "../components/buttons/ProceedToCheckout";
import CartLogin from "../components/buttons/CartLogin";
import ClearCart from "../components/buttons/ClearCart";
import CartSummary from "../components/checkout/CartSummary";

const CartPage = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cart, setCart] = useState({});

    const refreshCart = () => {
        const currentCart = CartHelper.getStoredCart();
        if (currentCart.length > 0) {
            axios.post("https://api.qa.bsquaresupermart.in/cart", currentCart)
                .then((res) => {setCart(res.data);})
                .catch((err) => console.error(err));
        }else{
            setCart({products: [], bill: null});
        }
    };
    const validate = async () => {
        const loggedIn = await AuthHelper.isLoggedIn();
        setIsLoggedIn(loggedIn);
    };
    const updateCart = (newProducts) => {
        const token = AuthHelper.getToken();
        const cartToSave = newProducts.map(p => ({
            ProductID: p.id,
            Quantity: p.quantity
        }));

        CartHelper.saveCart(cartToSave);

        axios.post('https://api.qa.bsquaresupermart.in/cart', cartToSave, {
            headers: {
                'x-authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            setCart({
                products: res.data.products,
                bill: res.data.bill
            });
        }).catch((err) => {
            console.error("Cart update failed", err);
        });
    };

    useEffect(() => {
        validate();
        refreshCart();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50">
            <Header />
            <main className="flex-grow px-2 sm:px-6 md:px-12 py-3">
                <PageTitle title={"🛒 Your Cart"} size={"small"} />
                <CartSummary
                    products={cart.products}
                    bill={cart.bill}
                    onUpdate={updateCart}
                    showBillFlag={true}
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
                        <ClearCart onClear={refreshCart} />
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CartPage;
