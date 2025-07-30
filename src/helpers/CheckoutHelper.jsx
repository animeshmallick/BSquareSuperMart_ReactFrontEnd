// src/helpers/CheckoutHelper.js

const ADDRESS_KEY = "selectedAddress";
const PAYMENT_KEY = "selectedPayment";

export const saveSelectedAddress = (address) => {
    sessionStorage.setItem(ADDRESS_KEY, JSON.stringify(address));
};

export const getSelectedAddress = () => {
    const addr = sessionStorage.getItem(ADDRESS_KEY);
    return addr ? JSON.parse(addr) : null;
};

export const saveSelectedPayment = (payment) => {
    sessionStorage.setItem(PAYMENT_KEY, JSON.stringify(payment));
};

export const getSelectedPayment = () => {
    const pay = sessionStorage.getItem(PAYMENT_KEY);
    return pay ? JSON.parse(pay) : null;
};

export const clearCheckoutSelections = () => {
    sessionStorage.removeItem(ADDRESS_KEY);
    sessionStorage.removeItem(PAYMENT_KEY);
};
