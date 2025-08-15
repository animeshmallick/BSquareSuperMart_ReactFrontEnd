import React, { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import Header from "../components/header";
import Footer from "../components/footer";
import AuthHelper from "../helpers/AuthHelper";
import { useNavigate } from "react-router-dom";

const AddressBookPage = () => {
    const navigate = useNavigate();
    const [userAddresses, setUserAddresses] = useState([]);
    const [storeAddress, setStoreAddress] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleSetDefault = (addressId) => {
        console.log(`Setting address with ID: ${addressId} as default...`);
    };


    useEffect(() => {
        AOS.init({ duration: 800 });
        const fetchData = async () => {
            const loggedIn = await AuthHelper.isLoggedIn();
            setIsLoggedIn(loggedIn);
            if (!loggedIn) {
                navigate("/login?source=addressBook");
                return;
            }

            const token = AuthHelper.getToken();
            const res = await axios.get("https://api.qa.bsquaresupermart.in/getUserAddresses", {
                headers: {
                    Accept: "application/json",
                    "x-authorization": `Bearer ${token}`,
                }
            });
            if(res.data.hasOwnProperty('userAddress') && res.data.hasOwnProperty('storeAddress')) {
                setUserAddresses(res.data.userAddress);
                setStoreAddress(res.data.storeAddress);
            }
        };

        fetchData();
    }, [navigate]);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50">
            <Header />
            <main className="flex-grow px-2 sm:px-6 md:px-12 py-3">
                <h2 className="text-3xl font-bold text-center text-green-800 mb-4" data-aos="fade-down">
                    My Address Book 🏠
                </h2>

                <div className="flex justify-center mb-3">
                    <motion.button
                        onClick={() => navigate("/add-address")}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        data-aos="fade-up"
                    >
                        + Add New Address
                    </motion.button>
                </div>

                <motion.div
                    className="bg-gray-300 rounded-lg mx-3 p-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {userAddresses.length > 0 && userAddresses.map((address) => (
                            <motion.div
                                key={address.address_id}
                                className={`bg-white shadow-xl rounded-xl px-3 py-2 relative transition-all duration-300 ${address.isDefault ? 'border-4 border-blue-500 shadow-2xl' : 'border-l-4 border-green-400'}`}
                                data-aos="zoom-in"
                                whileHover={{ scale: 1.03 }}
                                transition={{ type: "spring", stiffness: 100 }}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-semibold text-lg text-green-700">{address.address_label}</h4>
                                    {address.isDefault && (
                                        <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                                            Default
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-600">{address.addr_line1}, {address.addr_line2}</p>
                                <p className="text-gray-600">{address.city}, {address.state} - <span className="font-medium text-gray-800">{address.pincode}</span></p>
                                <div className="mt-2 flex justify-between">
                                    <button className="text-green-600 hover:text-green-800 font-medium">Edit</button>
                                    {!address.isDefault && (
                                        <button
                                            onClick={() => handleSetDefault(address.address_id)}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                        >
                                            Set as Default
                                        </button>
                                    )}
                                    <button className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {storeAddress && (
                    <motion.div
                        className="bg-yellow-50 shadow-xl rounded-xl px-4 py-1 border-l-4 border-yellow-500 mt-4"
                        data-aos="fade-up"
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 100 }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-lg text-yellow-700">{storeAddress.store_name} 🏪</h4>
                            <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                                Pickup Location
                            </span>
                        </div>
                        <p className="text-gray-700">{storeAddress.addr_line1}, {storeAddress.addr_line2}</p>
                        <p className="text-gray-700">{storeAddress.city}, {storeAddress.state} - <span className="font-medium text-gray-800">{storeAddress.pincode}</span></p>
                    </motion.div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default AddressBookPage;