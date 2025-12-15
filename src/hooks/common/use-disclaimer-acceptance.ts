"use client";
import { useState, useEffect } from "react";

const DISCLAIMER_KEY = "disclaimer-accepted";

export function useDisclaimerAcceptance() {
    const [accepted, setAccepted] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load State from localStorage
    useEffect(() => {
        const storedValue = localStorage.getItem(DISCLAIMER_KEY) === "true";
        setAccepted(storedValue);
        setIsLoaded(true);
    }, []);

    const manageDisclaimer = (check: boolean) => {
        if (check) {
            localStorage.setItem(DISCLAIMER_KEY, "true");
            setAccepted(true);
        } else {
            localStorage.removeItem(DISCLAIMER_KEY);
            setAccepted(false);
        }
    };
    const resetDisclaimer = () => {
        localStorage.removeItem(DISCLAIMER_KEY);
        setAccepted(false);
    };

    return {
        accepted,
        isLoaded,
        manageDisclaimer,
        resetDisclaimer,
    };
}