import React from 'react';
import { Fade } from 'react-awesome-reveal';
import BottomNavigation from "./BottomNavigation";

const AddressSelector = ({ addresses, selected, onSelect, onNext }) => {
    return (
        <div className="pl-5 pr-5">
            <h2 className="text-2xl font-semibold mb-4">📍 Select Delivery Address</h2>
            <Fade cascade>
                <div className="grid gap-4">
                    {addresses.map((addr) => (
                        <div
                            key={addr.address_id}
                            onClick={() => onSelect(addr)}
                            className={`p-4 rounded-xl border shadow-sm cursor-pointer transition-all duration-200 ${
                                selected?.address_id === addr.address_id
                                    ? 'border-green-500 bg-green-50 scale-[1.02]'
                                    : 'hover:bg-gray-100'
                            }`}
                        >
                            <p>{addr.addr_line1}, {addr.addr_line2}</p>
                        </div>
                    ))}
                </div>
            </Fade>

            <BottomNavigation onBack={null} onNext={onNext} selected={selected} />
        </div>
    );
};

export default AddressSelector;
