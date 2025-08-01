import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CategoryPage from "./pages/Category";
import LoginPage from "./pages/Login";
import ThankYouPage from "./pages/ThankYouPage";

export default function App() {
    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/Category/:categoryName" element={<CategoryPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/thankyou/:purchaseId" element={<ThankYouPage />} />
            </Routes>
        </Router>
    );
}