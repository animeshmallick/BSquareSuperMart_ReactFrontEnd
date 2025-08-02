import React, { useState, useEffect } from 'react';
import AddressSelector from '../components/checkout/AddressStep';
import PaymentSelector from '../components/checkout/PaymentStep';
import SPC from '../components/checkout/SPC';
import { AnimatePresence, motion } from 'framer-motion';
import AuthHelper from '../helpers/AuthHelper';
import axios from 'axios';
import Header from "../components/header";
import Footer from "../components/footer";
import CartSummary from "../components/checkout/CartSummary";
import CartHelper from "../helpers/CartHelper";
import {useNavigate} from "react-router-dom";

const steps = ['Address', 'Payment', 'Review'];

const Checkout = () => {
    const getInitialStep = () => {
        const hasAddress = sessionStorage.getItem('selectedAddress');
        const hasPayment = sessionStorage.getItem('selectedPayment');
        if (hasAddress && hasPayment) return 2;
        if (hasAddress) return 1;
        return 0;
    };

    const navigate = useNavigate();
    const [step, setStep] = useState(getInitialStep);
    const [addresses, setAddresses] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState("");
    const [cartData, setCartData] = useState({ products: CartHelper.getStoredCart(), bill: null });

    const [selectedAddress, setSelectedAddress] = useState(() => {
        const saved = sessionStorage.getItem('selectedAddress');
        return saved ? JSON.parse(saved) : null;
    });

    const [selectedPayment, setSelectedPayment] = useState(() => {
        const saved = sessionStorage.getItem('selectedPayment');
        return saved ? JSON.parse(saved) : null;
    });

    const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
    const prevStep = () => {
        if (step === 2) {
            sessionStorage.removeItem('selectedPayment');
            setSelectedPayment(null);
        } else if (step === 1) {
            sessionStorage.removeItem('selectedAddress');
            setSelectedAddress(null);
        }
        setStep((prev) => Math.max(prev - 1, 0));
    };

    const placeOrder = async () => {
        setLoading(true);
        setError("");

        try {
            const token = AuthHelper.getToken();
            const { data: purchaseRes } = await axios.get("https://api.qa.bsquaresupermart.in/getPurchaseID", {
                headers: {
                    "x-authorization": `Bearer ${token}`,
                    "accept": "application/json"
                }
            });
            const purchaseId = purchaseRes.purchaseID;

            const payload = {
                purchase_id: purchaseId,
                address: selectedAddress.address_id,
                payment: selectedPayment.id,
                cart: cartData.products.map(item => ({
                    ProductID: item.id,
                    Quantity: item.quantity
                }))
            };

            const response = await axios.post(
                "https://api.qa.bsquaresupermart.in/placeOrder",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-authorization": `Bearer ${token}`
                    }
                }
            );

            if (response.data?.signed === true) {
                localStorage.removeItem("cart");
                sessionStorage.removeItem("selectedAddress");
                sessionStorage.removeItem("selectedPayment");
            }

            navigate("/thankyou/" + purchaseId);
        } catch (err) {
            console.error("Order placement failed:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
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
            setCartData({
                products: res.data.products,
                bill: res.data.bill
            });
        }).catch((err) => {
            console.error("Cart update failed", err);
        });
    };

    useEffect(() => {
        const validate = async () => {
            const loggedIn = await AuthHelper.isLoggedIn();
            setIsLoggedIn(loggedIn);
            if (!loggedIn) navigate("/login?source=checkout");
        };
        validate();
        if(cartData.products.length === 0)
            navigate("/cart");

        const token = AuthHelper.getToken();

        axios.get('https://api.qa.bsquaresupermart.in/getUserAddresses', {
            headers: { 'x-authorization': `Bearer ${token}` }
        }).then((res) => setAddresses(res.data.userAddress));

        axios.get('https://api.qa.bsquaresupermart.in/getPaymentMethod', {
            headers: { 'x-authorization': `Bearer ${token}` }
        }).then((res) => setPayments(res.data));

        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const cartItems = JSON.parse(savedCart);
            axios.post('https://api.qa.bsquaresupermart.in/cart', cartItems, {
                headers: {
                    'x-authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                setCartData({
                    products: res.data.products,
                    bill: res.data.bill
                });
            }).catch((err) => console.error("Cart fetch error:", err));
        }
    }, []);

    const handleSelectAddress = (address) => {
        setSelectedAddress(address);
        sessionStorage.setItem('selectedAddress', JSON.stringify(address));
    };

    const handleSelectPayment = (payment) => {
        setSelectedPayment(payment);
        sessionStorage.setItem('selectedPayment', JSON.stringify(payment));
    };

    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <AddressSelector
                        addresses={addresses}
                        selected={selectedAddress}
                        onSelect={handleSelectAddress}
                        onNext={nextStep}
                        placeOrder={placeOrder}
                    />
                );
            case 1:
                return (
                    <PaymentSelector
                        methods={payments}
                        selected={selectedPayment}
                        onSelect={handleSelectPayment}
                        onNext={nextStep}
                        onBack={prevStep}
                        placeOrder={placeOrder}
                    />
                );
            case 2:
                return (
                    <SPC
                        address={selectedAddress}
                        payment={selectedPayment}
                        onBack={prevStep}
                        placeOrder={placeOrder}
                        loading={loading}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 via-white to-emerald-50">
            <Header isLoggedIn={isLoggedIn}/>
            <main className="flex-grow px-3 py-3 flex justify-center items-start">
                <h2 className="text-3xl font-bold text-center text-emerald-600 m-2">
                    🛒 Checkout
                </h2>
                <CartSummary
                    products={cartData.products}
                    bill={cartData.bill}
                    onUpdate={updateCart}
                />
                <div className="p-5 flex justify-between mb-6">
                    {steps.map((label, i) => (
                        <motion.div
                            key={label}
                            whileHover={{ scale: i < step ? 1.05 : 1 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex-1 text-center cursor-pointer font-medium pb-2 border-b-4 transition-all duration-300 ${
                                step === i ? 'border-green-500 text-green-600' : 'border-gray-200 text-gray-400'
                            }`}
                            onClick={() => {
                                if (i < step) {
                                    if (i === 0) {
                                        sessionStorage.removeItem('selectedAddress');
                                        setSelectedAddress(null);
                                    } else if (i === 1) {
                                        sessionStorage.removeItem('selectedPayment');
                                        setSelectedPayment(null);
                                    }
                                    setStep(i);
                                }
                            }}
                        >
                            {label}
                        </motion.div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>

                {error && (
                    <motion.div
                        className="text-red-500 text-center mt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {error}
                    </motion.div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Checkout;
