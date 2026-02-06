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
            setError(err.response?.data?.message || "Failed to sync with backend");
        }
    };

    const login = async (email, password) => {
        setError('');
        const cred = await signInWithEmailAndPassword(auth, email, password);
        return syncWithBackend(cred.user, password); // Sync likely needs password or update backend to not require it for login
    };

    /**
     * Sends a sign-in link to the provided email.
     * This is Step 1 of the new registration flow.
     */
    const sendSignupLink = async (email) => {
        const actionCodeSettings = {
            // URL you want to redirect back to. The domain (www.example.com) for this
            // URL must be in the authorized domains list in the Firebase Console.
            // Using window.location.origin to adapt to localhost or prod.
            url: `${window.location.origin}/finish-signup`,
            handleCodeInApp: true,
        };

        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        // Save the email locally so we don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem('emailForSignIn', email);
    };

    /**
     * Completes the sign-in with the email link.
     * This is Step 2 of the new registration flow.
     */
    const signInWithLink = async (email, href) => {
        if (isSignInWithEmailLink(auth, href)) {
            let emailToUse = email;
            if (!emailToUse) {
                // User opened link on different device/browser, ask for email
                // Ideally this should be handled by the UI before calling this, but as a fallback:
                // emailToUse = window.prompt('Please provide your email for confirmation');
                throw new Error("Email is required to complete sign in.");
            }

            const result = await signInWithEmailLink(auth, emailToUse, href);
            // You can access result.user here
            // Note: User is now signed in, but might not have a password or username yet.
            // We do NOT sync with backend yet because we need the username/password form filled out first.
            return result.user;
        }
        throw new Error("Invalid sign-in link.");
    };

    /**
     * Updates the user's password and profile (username), and then syncs with backend.
     * This is Step 3 of the new registration flow.
     */
    const completeRegistration = async (username, password) => {
        const user = auth.currentUser;
        if (!user) throw new Error("No authenticated user found.");

        // 1. Update Password
        await updatePassword(user, password);

        // 2. Update Profile (DisplayName)
        // Note: updateProfile is imported from 'firebase/auth' - need to make sure it's available or use the object method
        // But since we are inside a hook, let's use the modular import.
        // Wait, I need to check imports.
        // Assuming updateProfile is imported below or I need to import it.
        // Let's add it to imports first.

        // 3. Sync with Backend
        // We construct the payload manually since syncWithBackend expects firebaseUser + password
        // But let's just reuse syncWithBackend logic here to be safe

        // Actually, let's just do it directly here for clarity
        const payload = {
            firebaseUid: user.uid,
            email: user.email,
            username: username,
            password: password
        };

        const res = await api.post('/auth/firebase-auth', payload);
        localStorage.setItem('token', res.data.token);
        setMongoUser(res.data.user);
    };

    const signup = async (username, email, password) => {
        // Legacy signup - keeping it or removing? 
        // Required by interface but we are changing the flow.
        // Let's leave it but it shouldn't be used in the new flow.
        setError('');
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
        try {
            await api.post('/auth/firebase-auth', payload);
            // Don't auto-login here. Backend now requires verification.
            // localStorage.setItem('token', res.data.token);
            // setMongoUser(res.data.user);

            // Force Firebase signout so they aren't "logged in" in the background
            // waiting for sync that will fail.
            // Actually, we can leave them Firebase-logged-in but the UI should block them.
            // But to be safe and force them to click the link/re-login:
            await signOut(auth);
        } catch (err) {
            console.error("Signup Backend Error", err);
            setError(err.response?.data?.message || "Signup failed on backend");
            await signOut(auth); // Cleanup if backend fails
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
                await syncWithBackend(user);
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
