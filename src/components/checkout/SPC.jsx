import React from 'react';
import {useNavigate} from "react-router-dom";
import BottomNavigation from "./BottomNavigation";

const SPC = ({ address, payment, onBack }) => {
    const navigate = useNavigate();
    return (
        <div className="pl-5 pr-5">
            <h2 className="text-2xl font-semibold mb-4">🧾 Review & Confirm</h2>
            <div className="bg-white p-4 rounded-xl shadow-md space-y-4">
                <div>
                    <h3 className="text-lg font-semibold">📍 Address</h3>
                    <p>{address?.addr_line1}, {address?.addr_line2}</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">💳 Payment</h3>
                    <p>{payment?.name}</p>
                </div>
            </div>
            <BottomNavigation onBack={onBack} onNext={null} selected={null}/>
        </div>
    );
};

export default SPC;
