import React, {useState} from 'react';
import {AnimatePresence, motion} from "framer-motion";
import BottomNavigation from "./BottomNavigation";
import Divider from "../Divider";

const SPC = ({ address, payment, onBack, placeOrder, amount = 0}) => {
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [error, setError] = useState('');
    const placeOrderIfTnCAccepted = () => {
        if (!isTermsAccepted) {
            setError("Please agree to the terms and conditions to place your order.");
            return;
        }
        placeOrder();
    }
    const checkboxVariants = {
        checked: {
            scale: 1,
            opacity: 1,
            transition: { type: "spring", stiffness: 500, damping: 25 }
        },
        unchecked: {
            scale: 0,
            opacity: 0
        }
    };
    return (
        <div className="p-2">
            <h2 className="text-2xl font-semibold mb-4">🧾 Review & Confirm</h2>
            <div className="bg-white p-3 rounded-xl shadow-md space-y-2">
                <div>
                    <h3 className="text-lg font-semibold">📍 Address</h3>
                    <p className="font-semibold">{address?.addr_line1}, {address?.addr_line2}</p>
                    <p>{address?.city}, {address?.state}, {address?.pincode}</p>
                </div>
                <Divider />
                <div>
                    <p className="text-lg font-semibold">💳 Payment</p>
                    <p>{payment?.name}</p>
                </div>
                <Divider />
                <div className="text-lg font-bold text-gray-900">
                    Total Bill : ₹{amount.toFixed(2)}
                </div>
                <Divider />
                <div className="my-8 flex justify-center" data-aos="fade-up">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={isTermsAccepted}
                            onChange={() => {
                                setIsTermsAccepted(!isTermsAccepted);
                                if (error)
                                    setError('');
                            }}
                        />
                        <motion.div
                            className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors duration-200 ease-in-out ${isTermsAccepted ? 'bg-green-600 border-green-600' : 'bg-gray-200 border-gray-400'}`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            data-testid="custom-checkbox"
                        >
                            <motion.svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                variants={checkboxVariants}
                                initial="unchecked"
                                animate={isTermsAccepted ? "checked" : "unchecked"}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </motion.svg>
                        </motion.div>
                        <span className="ml-3 text-gray-700">I agree to the pay ₹{amount.toFixed(2)} to the delivery agent (Cash Or UPI only)</span>
                    </label>
                </div>
                {error && (
                    <motion.div
                        className="mb-3 text-red-500 text-sm font-semibold text-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        {error}
                    </motion.div>
                )}
                <AnimatePresence>
                    <motion.div
                        className="flex justify-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <motion.button
                            onTap={placeOrderIfTnCAccepted}
                            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-700 text-white py-3 px-8 md:px-10 rounded-full shadow-xl font-bold text-lg transition-all duration-300 ease-in-out"
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(34, 197, 94, 0.5)" }}
                            whileTap={{ scale: 0.98, backgroundColor: "#15803d" }}
                            animate={{
                                boxShadow: [
                                    "0 0px 10px rgba(34, 197, 94, 0.4)",
                                    "0 0px 20px rgba(34, 197, 94, 0.6)",
                                    "0 0px 10px rgba(34, 197, 94, 0.4)",
                                ],
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Place Order</span>
                        </motion.button>
                    </motion.div>
                </AnimatePresence>
            </div>
            <BottomNavigation onBack={onBack} onNext={null} selected={null} placeOrder={placeOrder}/>
        </div>
    );
};

export default SPC;
