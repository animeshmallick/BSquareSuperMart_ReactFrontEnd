import React, { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import Header from "../components/header";
import Footer from "../components/footer";
import AuthHelper from "../helpers/AuthHelper";
import {useNavigate} from "react-router-dom";

const AddressBookPage = () => {
    const navigate = useNavigate();
    const [userAddresses, setUserAddresses] = useState([]);
    const [storeAddress, setStoreAddress] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        AOS.init({ duration: 800 });
        const fetchData = async () => {
            const loggedIn = await AuthHelper.isLoggedIn();
            setIsLoggedIn(loggedIn);
            if (!loggedIn) navigate("/login?source=addressBook");

            const token = AuthHelper.getToken();

            try {
                const res = await axios.get("https://api.qa.bsquaresupermart.in/getUserAddresses", {
                    headers: {
                        Accept: "application/json",
                        "x-authorization": `Bearer ${token}`,
                    },
                });
                setUserAddresses(res.data.userAddress);
                setStoreAddress(res.data.storeAddress);
            } catch (err) {
                console.error("Failed to fetch addresses:", err);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 via-white to-emerald-50">
            <Header isLoggedIn={isLoggedIn} />
            <main className="flex-grow px-4 py-2">
                <h2 className="text-3xl font-bold text-center text-green-800 mb-4" data-aos="fade-down">
                    My Address Book
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {userAddresses.map((address) => (
                        <motion.div
                            key={address.address_id}
                            className="bg-white shadow-xl rounded-xl px-4 py-2 border-l-4 border-green-400"
                            data-aos="zoom-in"
                            whileHover={{ scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 100 }}
                        >
                            <h4 className="font-semibold text-lg text-green-700 mb-1">Address ID: {address.address_id}</h4>
                            <p className="text-gray-600">{address.addr_line1}</p>
                            <p className="text-gray-600">{address.addr_line2}</p>
                        </motion.div>
                    ))}

                    {storeAddress && (
                        <motion.div
                            className="bg-yellow-50 shadow-xl rounded-xl px-4 py-2 mt-7 border-l-4 border-yellow-500"
                            data-aos="fade-up"
                            whileHover={{ scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 100 }}
                        >
                            <h4 className="font-semibold text-lg text-yellow-700 mb-1">Store Address</h4>
                            <p className="text-gray-700">{storeAddress.address}</p>
                            <p className="text-gray-700">{storeAddress.city}, {storeAddress.state}</p>
                            <p className="text-gray-700">ZIP: {storeAddress.zip}</p>
                        </motion.div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AddressBookPage;
