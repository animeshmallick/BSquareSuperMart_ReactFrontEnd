// src/components/Footer.jsx
import React from "react";

const Footer = () => {
    return (
        <footer className="bg-emerald-700 text-white py-6 mt-10 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} BSquare SuperMart. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
