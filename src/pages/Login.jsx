// src/pages/LoginPage.jsx
import React, {useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthHelper from "../helpers/AuthHelper";
import {FaEye, FaEyeSlash} from "react-icons/fa";

const LoginPage = () => {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const queryParams = new URLSearchParams(location.search);
    const source = queryParams.get("source");

    useEffect(() => {
        const checkLogin = async () => {
            const isLoggedIn = await AuthHelper.isLoggedIn();
            if (isLoggedIn) {
                navigate("/" + (source || ""));
            }
        };
        checkLogin();
    }, [navigate, source]);


    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await axios.post("https://api.qa.bsquaresupermart.in/login", {
                phone,
                password,
            });

            if (res.data.authToken) {
                sessionStorage.setItem("authToken", res.data.authToken);
                if(source)
                    navigate("/" + source || "/");
                else
                    navigate("/");
            } else {
                setError("Login failed: No token received.");
            }
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 400) {
                setError("Invalid phone or password.");
            } else {
                setError("Something went wrong. Please try again later.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-200 flex items-center justify-center px-4">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md relative overflow-hidden"
            >
                <h2 className="text-3xl font-extrabold text-emerald-700 text-center mb-3">
                    Welcome, 👋
                </h2>
                <h5 className="font-extrabold text-emerald-700 text-center mb-6">
                    Login to BSquareSuperMart !!
                </h5>
                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Phone Number</label>
                        <input
                            type="number"
                            placeholder="9999988888"
                            className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-400 outline-none transition"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="w-full mt-1 px-4 py-2 pr-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-400 outline-none transition"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <button
                                type="button"
                                onClick={togglePassword}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-500 transition"
                            >
                                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-500 text-sm text-center"
                        >
                            {error}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-emerald-600 hover:bg-emerald-700 font-bold text-white py-2 rounded-xl transition duration-300 shadow-md ${
                            isLoading ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                    >
                        {isLoading ? "Logging in..." : "Login  →"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6 mb-6">
                    Don’t have an account?{" "}
                    <span className="text-lg text-emerald-600 hover:underline cursor-pointer">Sign up</span>
                </p>

                <motion.button
                    onClick={() => navigate("/")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-yellow-300 hover:border-yellow-700 text-gray-900 text-lg font-bold px-6 py-1 rounded-lg shadow-lg transition-all duration-300 border-2 border-yellow-300 hover:shadow-xl ring-2 ring-yellow-200"
                >
                    ← Home
                </motion.button>
            </motion.div>
        </div>
    );
};

export default LoginPage;
