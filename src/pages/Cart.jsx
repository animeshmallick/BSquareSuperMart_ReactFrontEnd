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

    useEffect(() => {
        validate();
        refreshCart();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50">
            <Header />
            <main className="flex-grow px-2 sm:px-6 md:px-12 py-3">
                <PageTitle title={"🛒 Your Cart"} />
                <div className="max-w-4xl mx-auto space-y-2">
                    {cart.products && cart.products.length > 0 ? (
                        cart.products.map((item, index) => (
                            <motion.div
                                key={`${item.id}-${index}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                onTap={() => navigate(`/product/${item.id}`)}
                                className="bg-white rounded-xl shadow-md p-1 flex items-center gap-2"
                            >
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                                    <p className="text-sm text-gray-500">{item.brand}</p>
                                    <div className="mt-1 text-gray-600">
                                        ₹{item.selling_price} × {item.quantity} =
                                        <span className="font-bold ml-1">
                                            ₹{(item.selling_price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <ProductQuantityContainer productId={item.id} onUpdate={refreshCart} />
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {CartHelper.removeProduct(item.id);refreshCart()}}
                                        className="w-fit group flex items-center text-sm text-red-500 hover:text-red-600 transition-colors font-medium mt-2"
                                    >
                                        <Trash2 className="w-4 h-4 mr-1 transition-transform group-hover:-rotate-6" />
                                        <span className="underline-offset-4 group-hover:underline">Remove</span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="relative text-center py-16"
                        >
                            {/* Watermark / Illustration */}
                            <div className="absolute inset-0 flex justify-center items-center opacity-10">
                                <img
                                    src="/empty-cart-illustration.svg" // You can use any vector illustration here
                                    alt="Empty Cart"
                                    className="w-64 h-64 object-contain"
                                />
                            </div>

                            {/* Main Message */}
                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold text-emerald-600 mb-4">
                                    Your cart is empty 🛒
                                </h3>
                                <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate("/")}
                                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded-full shadow-lg transition"
                                >
                                    ← Back to Home
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {cart.bill && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-xl shadow-lg p-5 mt-6"
                        >
                            <h4 className="text-lg font-bold mb-3 text-emerald-700">Bill Summary</h4>
                            <div className="space-y-1 text-gray-700">
                                <div className="flex justify-between">
                                    <span>Cart Total</span>
                                    <span>₹{cart.bill.cart_items_total}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Fee</span>
                                    <span>₹{cart.bill.delivery_fee}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Packaging Fee</span>
                                    <span>₹{cart.bill.packaging_fee}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Platform Fee</span>
                                    <span>₹{cart.bill.platform_fee}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Small Cart Fee</span>
                                    <span>₹{cart.bill.small_cart_fee}</span>
                                </div>
                                <hr className="my-2" />
                                <div className="flex justify-between text-xl font-bold text-emerald-700">
                                    <span>Total</span>
                                    <span>₹{cart.bill.total_bill}</span>
                                </div>
                            </div>
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

                        </motion.div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CartPage;
