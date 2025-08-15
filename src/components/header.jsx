import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthHelper from "../helpers/AuthHelper";
import {useProducts} from "../hooks/useProducts";

const Header = () => {
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filtered, setFiltered] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const drawerRef = useRef(null);
    const searchRef = useRef(null);

    const {data: products, isLoading, error} = useProducts();

    const fetchAndFilter = async () => {
        if (searchTerm.length < 2) {
            setFiltered([]);
            return;
        }
        setFiltered(products.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    };

    useEffect(() => {
        AuthHelper.isLoggedIn().then(setIsLoggedIn);
    }, []);

    useEffect(() => {
        fetchAndFilter();
    }, [searchTerm]);

    useEffect(() => {
        const handleClickOutside = e => {
            if (drawerRef.current && !drawerRef.current.contains(e.target)) {
                setDrawerOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSearchOpen(false);
            }
        };
        if (drawerOpen || searchOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [drawerOpen, searchOpen]);

    const closeButtonVariants = {
        initial: { rotate: 0, scale: 0.8, opacity: 0 },
        animate: { rotate: 180, scale: 1, opacity: 1 },
        exit: { rotate: -90, scale: 0.8, opacity: 0 },
    };

    const navLinks = [
        { label: "\ud83c\udfe0 Home", path: "/" },
        { label: "\ud83d\uded2 Cart", path: "/cart" },
        { label: "\u2139\ufe0f About Us", path: "/about" },
    ];

    const loggedInLinks = [
        { label: "\ud83d\udc64 Profile", path: "/profile" },
        { label: "\ud83d\udce6 Orders", path: "/orders" },
    ];

    return (
        <header className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-4 sticky top-0 z-50 shadow-xl">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="md:hidden"
                    onClick={() => setDrawerOpen(true)}
                >
                    <Menu className="w-7 h-7 cursor-pointer" />
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="text-2xl font-bold cursor-pointer tracking-wide"
                    onClick={() => navigate("/")}
                >
                    BSquareSuperMart
                </motion.div>

                <div className="flex items-center gap-4">
                    <motion.div whileTap={{ scale: 0.95 }}>
                        <Search
                            className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
                            onClick={() => setSearchOpen(true)}
                        />
                    </motion.div>
                    {isLoggedIn && (
                        <motion.div whileTap={{ scale: 0.95 }}>
                            <User
                                className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
                                onClick={() => navigate("/profile")}
                            />
                        </motion.div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-md z-50 flex justify-center items-start pt-20 px-4"
                    >
                        <motion.div
                            ref={searchRef}
                            initial={{ y: -80, opacity: 0, scale: 0.9 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: -80, opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 280, damping: 20 }}
                            className="w-full max-w-xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 relative"
                        >
                            {/* Close Button on Top Center */}
                            <motion.button
                                variants={closeButtonVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="absolute -top-14 left-1/2 transform -translate-x-1/2 p-3 rounded-full bg-white/70 backdrop-blur-sm text-gray-500 hover:text-gray-900 transition-colors duration-200 shadow-lg"
                                whileHover={{ scale: 1.2, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setSearchOpen(false)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </motion.button>
                            <div className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    placeholder="Search for products..."
                                    className="w-full p-4 text-lg border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-inner bg-white/80 text-gray-800 placeholder-gray-400"
                                />
                                <div className="max-h-80 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-transparent">
                                    {filtered.length > 0 ? (
                                        filtered.map((p, i) => (
                                            <motion.div
                                                key={p.id}
                                                initial={{ opacity: 0, y: -15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.02 * i, type: "spring", stiffness: 200, damping: 15 }}
                                                className="flex items-center gap-4 bg-gray-50 hover:bg-emerald-100 rounded-xl p-3 cursor-pointer shadow-sm transition-all duration-200 ease-in-out"
                                                whileHover={{ scale: 1.02, x: 5, boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => {
                                                    setSearchOpen(false);
                                                    navigate(`/product/${p.id}`);
                                                }}
                                            >
                                                <div className="relative w-14 h-14 overflow-hidden rounded-lg shadow-md">
                                                    <img
                                                        src={p.image_url}
                                                        alt={p.name}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800">{p.name}</div>
                                                    <div className="text-md text-gray-600 font-medium">₹{p.selling_price}</div>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500 py-6">
                                            {searchTerm.length < 2
                                                ? "Start typing to search for products..."
                                                : "No matching products found"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {drawerOpen && (
                    <motion.div
                        className="fixed inset-0 z-40 bg-black bg-opacity-40 backdrop-blur-sm flex"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <motion.div
                            ref={drawerRef}
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="w-72 sm:w-80 bg-gradient-to-br from-white via-emerald-50 to-emerald-100 p-6 rounded-tr-3xl rounded-br-3xl shadow-2xl relative"
                        >
                            <motion.div
                                variants={closeButtonVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.4 }}
                                className="absolute top-4 right-4"
                            >
                                <X
                                    className="w-6 h-6 cursor-pointer text-gray-400 hover:text-gray-800 transition-all transform hover:scale-125 hover:rotate-90"
                                    onClick={() => setDrawerOpen(false)}
                                />
                            </motion.div>

                            {!isLoggedIn && (
                                <motion.button
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setDrawerOpen(false);
                                        navigate("/login");
                                    }}
                                    className="mt-8 w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded-xl font-medium shadow-md transition-all duration-300"
                                >
                                    Login to Proceed
                                </motion.button>
                            )}

                            <nav className="mt-10 space-y-5">
                                {[...navLinks, ...(isLoggedIn ? loggedInLinks : [])].map((link, i) => (
                                    <motion.div
                                        key={link.label}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.05 * i }}
                                        className="text-lg font-medium text-gray-700 hover:text-emerald-600 cursor-pointer transition duration-300"
                                        onClick={() => {
                                            setDrawerOpen(false);
                                            navigate(link.path);
                                        }}
                                    >
                                        {link.label}
                                    </motion.div>
                                ))}
                            </nav>

                            {isLoggedIn && (
                                <motion.button
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        AuthHelper.logout();
                                        setDrawerOpen(false);
                                        navigate("/login");
                                    }}
                                    className="mt-8 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-medium shadow-md transition-all duration-300"
                                >
                                    Logout
                                </motion.button>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
