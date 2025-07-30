// src/pages/LoginPage.jsx
import React, {useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthHelper from "../helpers/AuthHelper";

const LoginPage = () => {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const source = queryParams.get("source");

    useEffect(() => {
        if (AuthHelper.isLoggedIn()) {
            navigate("/" + source || "/");
        }
    }, [navigate, source]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await axios.post("https://qa.api.bsquaresupermart.in/login", {
                phone,
                password,
            });

            if (res.data.authToken) {
                localStorage.setItem("authToken", res.data.authToken);
                navigate("/" + source || "/");
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
                {/* Animated blurred glow backgrounds */}
                <motion.div
                    className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-300 rounded-full filter blur-3xl opacity-20"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 15, 0] }}
                    transition={{ repeat: Infinity, duration: 6 }}
                />
                <motion.div
                    className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-400 rounded-full filter blur-2xl opacity-20"
                    animate={{ scale: [1, 1.3, 1], rotate: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 8 }}
                />

                <h2 className="text-3xl font-extrabold text-emerald-700 text-center mb-6">
                    Welcome Back 👋
                </h2>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Phone Number</label>
                        <input
                            type="text"
                            className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-400 outline-none transition"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">Password</label>
                        <input
                            type="password"
                            className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-400 outline-none transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
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
                        className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl transition duration-300 shadow-md ${
                            isLoading ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Don’t have an account?{" "}
                    <span className="text-emerald-600 hover:underline cursor-pointer">Sign up</span>
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;
