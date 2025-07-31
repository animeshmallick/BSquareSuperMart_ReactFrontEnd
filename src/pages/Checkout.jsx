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
    const [cartData, setCartData] = useState({ products: [], bill: null });
    const [selectedAddress, setSelectedAddress] = useState(() => {
        const saved = sessionStorage.getItem('selectedAddress');
        return saved ? JSON.parse(saved) : null;
    });
    const [selectedPayment, setSelectedPayment] = useState(() => {
        const saved = sessionStorage.getItem('selectedPayment');
        return saved ? JSON.parse(saved) : null;
    });

    const nextStep = () => {
        setStep((prev) => Math.min(prev + 1, steps.length - 1));
    };

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
    const updateCart = (newProducts) => {
        const token = AuthHelper.getToken();
        const cartToSave = newProducts.map(p => ({
            ProductID: p.id,
            Quantity: p.quantity
        }));

        CartHelper.saveCart(cartToSave);

        axios.post('https://qa.api.bsquaresupermart.in/cart', cartToSave, {
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
            if (!loggedIn)
                navigate("/login?source=checkout")
        };
        validate();
        const token = AuthHelper.getToken();

        axios.get('https://qa.api.bsquaresupermart.in/getUserAddresses', {
            headers: { 'x-authorization': `Bearer ${token}` }
        }).then((res) => setAddresses(res.data.userAddress));

        axios.get('https://qa.api.bsquaresupermart.in/getPaymentMethod', {
            headers: { 'x-authorization': `Bearer ${token}` }
        }).then((res) => setPayments(res.data));

        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const cartItems = JSON.parse(savedCart);
            axios.post('https://qa.api.bsquaresupermart.in/cart', cartItems, {
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
                console.error("Cart fetch error:", err);
            });
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
                    />
                );
            case 2:
                return (
                    <SPC
                        address={selectedAddress}
                        payment={selectedPayment}
                        onBack={prevStep}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex flex-col min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50">
            <Header />
            <main className="flex-grow">
                <CartSummary
                    products={cartData.products}
                    bill={cartData.bill}
                    onUpdate={updateCart}
                />
                <div className="p-5 flex justify-between mb-6">
                    {steps.map((label, i) => (
                        <div
                            key={label}
                            className={`flex-1 text-center font-medium pb-2 border-b-4 transition-all duration-300 ${
                                step === i ? 'border-green-500 text-green-600' : 'border-gray-200 text-gray-400'
                            }`}
                            onClick={() => {
                                if (i === 0 && i < step) {
                                    sessionStorage.removeItem('selectedAddress');
                                    setSelectedAddress(null);
                                    setStep(i);
                                } else if (i === 1 && i < step) {
                                    sessionStorage.removeItem('selectedPayment');
                                    setSelectedPayment(null);
                                    setStep(i);
                                }
                            }}
                        >
                            {label}
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 80 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -80 }}
                        transition={{ duration: 0.4 }}
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </main>
            <Footer />
        </div>
    );
};

export default Checkout;
