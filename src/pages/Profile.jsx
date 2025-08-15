import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import AuthHelper from "../helpers/AuthHelper";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";

const ProfilePage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({ name: "", phone: "" });
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        AOS.init({ duration: 1000 });

        const token = AuthHelper.getToken();
        const validate = async () => {
            const loggedIn = await AuthHelper.isLoggedIn();
            setIsLoggedIn(loggedIn);
            if (!loggedIn) navigate("/login?source=profile");
        };
        validate();

        axios
            .get("https://api.qa.bsquaresupermart.in/getUserProfile", {
                headers: {
                    "x-authorization": `Bearer ${token}`,
                    Accept: "application/json",
                },
            })
            .then((res) => setProfile(res.data))
            .catch((err) => console.error("Failed to load profile", err));
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 via-white to-emerald-50">
            <Header isLoggedIn={isLoggedIn} />

            <main className="flex-grow px-4 py-8 flex justify-center items-start">
                <motion.div
                    className="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full text-center"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    data-aos="zoom-in"
                >
                    <img
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.fname + profile.lname || "User"}`}
                        alt="avatar"
                        className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-indigo-100"
                    />

                    <h2 className="text-2xl font-bold text-indigo-700">{profile.fname + profile.lname || "Unknown User"}</h2>
                    <p className="text-gray-500 mt-1">{profile.phone || "No phone linked"}</p>

                    <div className="mt-6 space-y-3">
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            className="w-full px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
                        >
                            Edit Profile
                        </motion.button>

                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate("/addressBook")}
                            className="w-full px-6 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-all"
                        >
                            Go to Address Book
                        </motion.button>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default ProfilePage;
