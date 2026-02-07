/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink,
    updatePassword,
    sendEmailVerification
} from 'firebase/auth';
import { auth } from '../firebase';
import api from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [mongoUser, setMongoUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Sync with Backend
    const syncWithBackend = async (firebaseUser, password = null) => {
        if (!firebaseUser) {
            setMongoUser(null);
            localStorage.removeItem('token');
            return;
        }

        try {
            const payload = {
                firebaseUid: firebaseUser.uid,
                email: firebaseUser.email,
                username: firebaseUser.displayName || firebaseUser.email.split('@')[0], // Fallback username
                password: password || "system_auth_placeholder", // System Auth
                emailVerified: firebaseUser.emailVerified
            };

            const res = await api.post('/auth/firebase-auth', payload);

            localStorage.setItem('token', res.data.token);
            setMongoUser(res.data.user);
        } catch (err) {
            console.error("Backend Sync Error:", err);
            // Determine if it's a login or register error and set appropriately
            const msg = err.response?.data?.message || "Failed to sync with backend";
            setError(msg);

            // If Forbidden (Email not verified) or Unauthorized, force logout from Firebase
            if (err.response?.status === 403 || err.response?.status === 401) {
                await signOut(auth);
            }
            throw new Error(msg); // Throw so login() knows it failed
        }
    };

    // Error Mapping Helper
    const mapAuthCodeToMessage = (errorCode) => {
        switch (errorCode) {
            case 'auth/invalid-email':
                return 'Invalid email address format.';
            case 'auth/user-disabled':
                return 'Access denied. Account disabled.';
            case 'auth/user-not-found':
            case 'auth/invalid-credential':
                return 'Invalid credentials. Please verify your email and passcode.';
            case 'auth/wrong-password':
                return 'Incorrect passcode.';
            case 'auth/email-already-in-use':
                return 'This email is already registered within the system.';
            case 'auth/weak-password':
                return 'Passcode is too weak. Minimum 6 characters required.';
            case 'auth/operation-not-allowed':
                return 'System operation denied.';
            case 'auth/network-request-failed':
                return 'Connection interrupted. Check your network status.';
            case 'auth/too-many-requests':
                return 'Too many attempts. Access temporarily locked.';
                return 'Too many attempts. Access temporarily locked.';
            case 'auth/requires-recent-login':
                return 'Session expired. Please re-authenticate.';
            default:
                return 'Authentication failed. Access denied.';
        }
    };

    const login = async (email, password) => {
        setError('');
        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            return await syncWithBackend(cred.user, password);
        } catch (err) {
            console.error("Login Error:", err.code, err.message);
            const cleanMsg = mapAuthCodeToMessage(err.code);
            setError(cleanMsg);
            throw new Error(cleanMsg);
        }
    };

    /**
     * Sends a sign-in link to the provided email.
     * This is Step 1 of the new registration flow.
     */
    const sendSignupLink = async (email) => {
        setError('');
        try {
            const actionCodeSettings = {
                url: `${window.location.origin}/finish-signup`,
                handleCodeInApp: true,
            };
            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            window.localStorage.setItem('emailForSignIn', email);
        } catch (err) {
            console.error("Send Link Error:", err.code);
            const cleanMsg = mapAuthCodeToMessage(err.code);
            setError(cleanMsg);
            throw new Error(cleanMsg);
        }
    };

    /**
     * Completes the sign-in with the email link.
     * This is Step 2 of the new registration flow.
     */
    const signInWithLink = async (email, href) => {
        setError('');
        try {
            if (isSignInWithEmailLink(auth, href)) {
                let emailToUse = email;
                if (!emailToUse) {
                    throw new Error("Email is required to complete sign in.");
                }
                const result = await signInWithEmailLink(auth, emailToUse, href);
                return result.user;
            }
            throw new Error("Invalid sign-in link.");
        } catch (err) {
            console.error("Sign In Link Error:", err.code || err.message);
            const cleanMsg = err.code ? mapAuthCodeToMessage(err.code) : err.message;
            setError(cleanMsg);
            throw new Error(cleanMsg);
        }
    };

    /**
     * Updates the user's password and profile (username), and then syncs with backend.
     * This is Step 3 of the new registration flow.
     */
    const completeRegistration = async (username, password) => {
        setError('');
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("No authenticated user found.");

            // 1. Update Password
            await updatePassword(user, password);

            // 2. Sync with Backend
            const payload = {
                firebaseUid: user.uid,
                email: user.email,
                username: username,
                password: password
            };

            const res = await api.post('/auth/firebase-auth', payload);
            localStorage.setItem('token', res.data.token);
            setMongoUser(res.data.user);
        } catch (err) {
            console.error("Registration Completion Error:", err);
            let cleanMsg = "Registration failed.";
            if (err.response) {
                // Backend Error
                cleanMsg = err.response.data.message || "Registration failed on system.";
            } else if (err.code) {
                // Firebase Error
                cleanMsg = mapAuthCodeToMessage(err.code);
            } else {
                cleanMsg = err.message || "Registration failed.";
            }
            setError(cleanMsg);
            throw new Error(cleanMsg);
        }
    };

    const signup = async (username, email, password) => {
        setError('');
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);

            // Send Verification Email
            await sendEmailVerification(cred.user);

            const payload = {
                firebaseUid: cred.user.uid,
                email,
                username,
                password,
                emailVerified: false // Initially false
            };

            await api.post('/auth/firebase-auth', payload);
            await signOut(auth);
        } catch (err) {
            console.error("Signup Error", err);
            let cleanMsg = "Signup failed.";
            if (err.response) {
                cleanMsg = err.response.data.message || "Signup failed on system";
            } else if (err.code) {
                cleanMsg = mapAuthCodeToMessage(err.code);
            }
            setError(cleanMsg);

            // Cleanup if needed
            if (auth.currentUser) await signOut(auth);
            throw new Error(cleanMsg);
        }
    };

    const resendVerification = async () => {
        if (currentUser) {
            await sendEmailVerification(currentUser);
        }
    };

    const fetchStats = async () => {
        if (currentUser) {
            await syncWithBackend(currentUser);
        }
    };

    const logout = async () => {
        localStorage.removeItem('token');
        setMongoUser(null);
        setCurrentUser(null);
        await signOut(auth);
        window.location.href = '/login';
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                // Determine if we should sync.
                try {
                    await syncWithBackend(user);
                } catch (e) {
                    console.log("Auto-sync failed:", e.message);
                }
            } else {
                setMongoUser(null);
                localStorage.removeItem('token');
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        mongoUser,
        login,
        signup,
        sendSignupLink,
        signInWithLink,
        completeRegistration,
        logout,
        resendVerification,
        fetchStats,
        loading,
        error
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
