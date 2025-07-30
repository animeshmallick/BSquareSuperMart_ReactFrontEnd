import React, { useState, useEffect } from 'react';
import AddressSelector from '../components/checkout/AddressStep';
import PaymentSelector from '../components/checkout/PaymentStep';
import SPC from '../components/checkout/SPC';
import { AnimatePresence, motion } from 'framer-motion';
import AuthHelper from '../helpers/AuthHelper';
import axios from 'axios';

const steps = ['Address', 'Payment', 'Review'];

const Checkout = () => {
    const getInitialStep = () => {
        const hasAddress = sessionStorage.getItem('selectedAddress');
        const hasPayment = sessionStorage.getItem('selectedPayment');
        if (hasAddress && hasPayment) return 2;
        if (hasAddress) return 1;
        return 0;
    };

    const [step, setStep] = useState(getInitialStep);
    const [addresses, setAddresses] = useState([]);
    const [payments, setPayments] = useState([]);
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

    useEffect(() => {
        const token = AuthHelper.getToken();
        if (!token) return;

        axios.get('https://qa.api.bsquaresupermart.in/getUserAddresses', {
            headers: { 'x-authorization': `Bearer ${token}` }
        }).then((res) => setAddresses(res.data.userAddress));

        axios.get('https://qa.api.bsquaresupermart.in/getPaymentMethod', {
            headers: { 'x-authorization': `Bearer ${token}` }
        }).then((res) => setPayments(res.data));
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
        <div className="max-w-3xl mx-auto p-6">
            {/* Progress Bar */}
            <div className="flex justify-between mb-6">
                {steps.map((label, i) => (
                    <div
                        key={label}
                        className={`flex-1 text-center font-medium pb-2 border-b-4 transition-all duration-300 ${
                            step === i ? 'border-green-500 text-green-600' : 'border-gray-200 text-gray-400'
                        }`}
                    >
                        {label}
                    </div>
                ))}
            </div>

            {/* Animated Step */}
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
        </div>
    );
};

export default Checkout;
