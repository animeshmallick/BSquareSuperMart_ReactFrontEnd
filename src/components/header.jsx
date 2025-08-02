import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthHelper from "../helpers/AuthHelper";
import ProductHelper from "../helpers/ProductHelper";

const Header = () => {
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const drawerRef = useRef(null);
    const searchRef = useRef(null);

    const fetchAndFilter = async () => {
        if (searchTerm.length < 2) {
            setFiltered([]);
            return;
        }
        ProductHelper.getAllProducts().then(products => {
            setFiltered(products.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            ));
        });
    };

    useEffect(() => {
        AuthHelper.isLoggedIn().then(setIsLoggedIn);
        ProductHelper.getAllProducts().then(setProducts);
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
        { label: "🏠 Home", path: "/" },
        { label: "🛒 Cart", path: "/cart" },
        { label: "ℹ️ About Us", path: "/about" },
    ];

    const loggedInLinks = [
        { label: "👤 Profile", path: "/profile" },
        { label: "📦 Orders", path: "/orders" },
    ];

    return (
        <header className="bg-emerald-600 text-white p-4 sticky top-0 z-50 shadow-xl">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div
                    className="text-2xl font-bold cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    BSquare SuperMart
                </div>
                <div className="flex items-center gap-4">
                    <Search
                        className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => setSearchOpen(true)}
                    />
                    {isLoggedIn && (
                        <User
                            className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
                            onClick={() => navigate("/profile")}
                        />
                    )}
                    <Menu
                        className="w-7 h-7 cursor-pointer md:hidden"
                        onClick={() => setDrawerOpen(true)}
                    />
                </div>
            </div>

            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-start pt-20 px-4"
                    >
                        <motion.div
                            ref={searchRef}
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-4 relative"
                        >
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Search for products..."
                                className="w-full p-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            <div className="mt-4 max-h-80 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-emerald-400">
                                {filtered.length > 0 ? (
                                    filtered.map((p, i) => (
                                        <motion.div
                                            key={p.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.02 * i }}
                                            className="flex items-center gap-4 bg-gray-100 hover:bg-emerald-100 rounded-xl p-3 cursor-pointer shadow-sm transition-all duration-200"
                                            onClick={() => {
                                                setSearchOpen(false);
                                                navigate(`/product/${p.id}`);
                                            }}
                                        >
                                            <img
                                                src={p.image_url}
                                                alt={p.name}
                                                className="h-12 w-12 object-cover rounded-lg shadow-md"
                                            />
                                            <div>
                                                <div className="font-semibold text-gray-800">{p.name}</div>
                                                <div className="text-sm text-gray-600">₹{p.selling_price}</div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500">
                                        {searchTerm.length < 2
                                            ? "Type at least 2 characters to search"
                                            : "No matching products found"}
                                    </p>
                                )}
                            </div>
                            <motion.div
                                variants={closeButtonVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.4 }}
                                className="absolute top-4 right-4"
                            >
                                <X
                                    className="w-6 h-6 cursor-pointer text-gray-500 hover:text-gray-800 transition-all transform hover:scale-125 hover:rotate-90"
                                    onClick={() => setSearchOpen(false)}
                                />
                            </motion.div>
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
                                    🔐 Login to Proceed
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
                                    🚪 Logout
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
