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
                password: password || "firebase_login_placeholder", // Backend requires password
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
                return 'This account has been disabled.';
            case 'auth/user-not-found':
            case 'auth/invalid-credential':
                return 'No account found with these credentials.';
            case 'auth/wrong-password':
                return 'Incorrect password.';
            case 'auth/email-already-in-use':
                return 'An account with this email already exists.';
            case 'auth/weak-password':
                return 'Password should be at least 6 characters.';
            case 'auth/operation-not-allowed':
                return 'Operation not currently allowed.';
            case 'auth/network-request-failed':
                return 'Network error. Please check your connection.';
            case 'auth/too-many-requests':
                return 'Too many attempts. Please try again later.';
            case 'auth/requires-recent-login':
                return 'Please logout and login again to confirm identity.';
            default:
                return 'Authentication failed. Please try again.';
        }
    };

    const login = async (email, password) => {
        setError('');
        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            return await syncWithBackend(cred.user, password);
        } catch (err) {
            console.error("Login Error:", err.code, err.message);
            setError(mapAuthCodeToMessage(err.code));
            throw err; // Re-throw so UI can stop loading state if needed
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
            setError(mapAuthCodeToMessage(err.code));
            throw err;
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
            // If it's a firebase error code, map it. If generic error, show message.
            setError(err.code ? mapAuthCodeToMessage(err.code) : err.message);
            throw err;
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
            if (err.response) {
                // Backend Error
                setError(err.response.data.message || "Registration failed on backend.");
            } else if (err.code) {
                // Firebase Error
                setError(mapAuthCodeToMessage(err.code));
            } else {
                setError(err.message || "Registration failed.");
            }
            throw err;
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
            if (err.response) {
                setError(err.response.data.message || "Signup failed on backend");
            } else if (err.code) {
                setError(mapAuthCodeToMessage(err.code));
            } else {
                setError("Signup failed.");
            }
            // Cleanup if needed
            if (auth.currentUser) await signOut(auth);
            throw err;
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

    const logout = () => {
        localStorage.removeItem('token');
        setMongoUser(null);
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                // Determine if we should sync.
                // If the user is found in Firebase, we try to sync with the backend.
                // We don't have the password here (it's null), so syncWithBackend will use the placeholder.
                // effective for "Login" to the backend if the user already exists there.
                try {
                    await syncWithBackend(user);
                } catch (e) {
                    // Squelch error here, strictly for auto-login attempts.
                    // The error state is already set by syncWithBackend if needed.
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
