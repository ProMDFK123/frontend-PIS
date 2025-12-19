"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const DISCLAIMER_KEY = "disclaimer-accepted";

export function useDisclaimerAcceptance() {
    const [accepted, setAccepted] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load State from localStorage
    useEffect(() => {
        const storedValue = localStorage.getItem(DISCLAIMER_KEY) === "true";
        const cookieValue = Cookies.get(DISCLAIMER_KEY) === "true";
        // Prioriza la cookie si existe
        const finalValue = cookieValue || storedValue;
        localStorage.setItem(DISCLAIMER_KEY, finalValue ? "true" : "false");
        setAccepted(finalValue);
        setIsLoaded(true);
    }, []);

    const manageDisclaimer = (check: boolean) => {
        if (check) {
            localStorage.setItem(DISCLAIMER_KEY, "true");
            Cookies.set(DISCLAIMER_KEY, "true", { 
                expires: 365, 
                path: '/' });
            setAccepted(true);
        } else {
            localStorage.removeItem(DISCLAIMER_KEY);
            Cookies.remove(DISCLAIMER_KEY, { path: '/' });
            setAccepted(false);
        }
    };
    const resetDisclaimer = () => {
        localStorage.removeItem(DISCLAIMER_KEY);
        Cookies.remove(DISCLAIMER_KEY, { path: '/' });
        setAccepted(false);
    };

    return {
        accepted,
        isLoaded,
        manageDisclaimer,
        resetDisclaimer,
    };
}