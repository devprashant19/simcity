/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';


const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    const { mongoUser } = useAuth();

    // Core Game Data
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [faction, setFaction] = useState(null);
    const [power, setPower] = useState({
        economy: 10,
        military: 10,
        health: 10,
        infrastructure: 10
    });

    // UI State
    const [loading, setLoading] = useState(true);
    const [gameOver, setGameOver] = useState(false);

    // Timer / Progression Logic
    const [unlockTime, setUnlockTime] = useState(null);
    const [lockedAnswer, setLockedAnswer] = useState(null);

    // Holds the next question ID/Data while the timer is running
    const [pendingNextQid, setPendingNextQid] = useState(null);

    const [isInitialized, setIsInitialized] = useState(false);

    // Fetch the detailed question object from server
    const fetchCurrentQuestion = async () => {
        try {
            const res = await api.get('/game/current-question');
            setCurrentQuestion(res.data);
            return res.data;
        } catch (err) {
            console.error("Failed to fetch question:", err);
            return null;
        }
    };

    // Initialize Game
    useEffect(() => {
        const userId = mongoUser?._id || mongoUser?.id;

        if (!userId) {
            // Reset on logout
            setPower({ economy: 10, military: 10, health: 10, infrastructure: 10 });
            setCurrentQuestion(null);
            setFaction(null);
            setGameOver(false);
            setUnlockTime(null);
            setLockedAnswer(null);
            setPendingNextQid(null);
            setLoading(false);
            return;
        }

        const initGame = async () => {
            try {
                setLoading(true);

                // 1. Restore minimal state from LocalStorage (Timer/UI only)
                const storageKey = `simcity_${userId}`;
                const savedUnlockTime = localStorage.getItem(`${storageKey}_unlockTime`);
                const savedLockedAnswer = localStorage.getItem(`${storageKey}_lockedAnswer`);
                const savedPendingNext = localStorage.getItem(`${storageKey}_pendingNextQid`);

                if (savedUnlockTime) setUnlockTime(parseInt(savedUnlockTime, 10));
                if (savedLockedAnswer) setLockedAnswer(savedLockedAnswer);
                if (savedPendingNext) setPendingNextQid(savedPendingNext);

                // 2. Load Core Data from Backend (Truth)
                // mongoUser should have latest power/faction provided by AuthContext/VerifyToken
                if (mongoUser.faction) setFaction(mongoUser.faction);
                if (mongoUser.power) setPower(mongoUser.power);

                // 3. Fetch Question
                await fetchCurrentQuestion();

            } catch (err) {
                console.error("Failed to init game", err);
            } finally {
                setLoading(false);
                setIsInitialized(true);
            }
        };

        if (mongoUser) initGame();
    }, [mongoUser]);


    // Save ephemeral UI state (Timers) to LocalStorage
    useEffect(() => {
        const userId = mongoUser?._id || mongoUser?.id;
        if (!isInitialized || !userId) return;

        const storageKey = `simcity_${userId}`;

        if (unlockTime) localStorage.setItem(`${storageKey}_unlockTime`, unlockTime);
        else localStorage.removeItem(`${storageKey}_unlockTime`);

        if (lockedAnswer) localStorage.setItem(`${storageKey}_lockedAnswer`, lockedAnswer);
        else localStorage.removeItem(`${storageKey}_lockedAnswer`);

        if (pendingNextQid) localStorage.setItem(`${storageKey}_pendingNextQid`, pendingNextQid);
        else localStorage.removeItem(`${storageKey}_pendingNextQid`);

    }, [unlockTime, lockedAnswer, pendingNextQid, isInitialized, mongoUser]);


    const updatePower = (newPower) => {
        setPower(newPower);
        // We assume backend handles persistence on /answer, preventing double-writes here
    };

    /**
     * Locks the answer and starts a timer.
     */
    const lockWithTimer = (answer, minutes) => {
        setLockedAnswer(answer);
        const duration = minutes * 60 * 1000;
        setUnlockTime(Date.now() + duration);
    };

    const handleAnswer = async (answer, forceSubmit = false, isMCQConfirm = false) => {

        // --- PHASE 2: FORCE SUBMIT (Timer Ended or User Skipped) ---
        if (forceSubmit) {
            console.log("[DEBUG] Force Proceed. Pending QID:", pendingNextQid);
            setUnlockTime(null);
            setLockedAnswer(null);

            if (pendingNextQid) {
                if (pendingNextQid === 'END') {
                    setGameOver(true);
                } else {
                    // Start next question
                    // We need to tell backend we are "ready" or just fetch next?
                    // Actually, submitAnswer (Phase 1) already updated backend "currentQuestion" to the new one.
                    // So we just fetch it.
                    await fetchCurrentQuestion();
                }
                setPendingNextQid(null);
            } else {
                // Fallback if state lost? Fetch current should resolve it.
                await fetchCurrentQuestion();
            }
            return { success: true };
        }

        // --- PHASE 1: SUBMIT & LOCK ---
        // User clicked an option or submitted text.
        try {
            // 1. Determine local input type for simple index handling if needed
            // But API expects: { answer: stringOrIndex }
            // Frontend passes 'text' for MCQ usually, let's convert to index if needed? 
            // The previous code passed text. The backend logic I wrote expects INDEX for decision.
            // Let's fix that mismatch.

            let payloadAnswer = answer;
            if (currentQuestion.type === 'decision' || currentQuestion.type === 'option') {
                // Find index
                const idx = currentQuestion.options.findIndex(o => o.text === answer);
                if (idx === -1) return { success: false, message: "Invalid option" };
                payloadAnswer = idx;
            }

            console.log("[DEBUG] Submitting Answer:", payloadAnswer);

            const res = await api.post('/game/answer', { answer: payloadAnswer });
            const { success, isCorrect, effects, nextQid, newPower, message } = res.data;

            if (!success) {
                return { success: false, message: message || "Incorrect answer" };
            }

            // Correct Answer Process:

            // 2. Start Timer (Visual)
            // Use 2 minutes for standard loop
            lockWithTimer(answer, 2);

            // 3. Store Next QID pending release
            setPendingNextQid(nextQid);

            // 4. Update Power (Immediate Feedback)
            if (newPower) updatePower(newPower);

            return { success: true, message: message };

        } catch (err) {
            console.error("Answer submission failed", err);
            return { success: false, message: err.response?.data?.message || "Communication failed" };
        }
    };

    const selectFaction = async (selectedFaction) => {
        const userId = mongoUser?._id || mongoUser?.id;
        if (!userId) return;

        setLoading(true);
        try {
            // Set faction on backend
            // We can use update-progress even though we are "starting"
            // Or rely on a seed? update-progress is fine.
            await api.post('/game/update-progress', { faction: selectedFaction });

            setFaction(selectedFaction);

            // Fetch first question (backend logic ensures startQid if currentQuestion null)
            const q = await fetchCurrentQuestion();

            setGameOver(false);
            setUnlockTime(null);
            setLockedAnswer(null);
            setPendingNextQid(null);

        } catch (err) {
            console.error("Error selecting faction:", err);
        } finally {
            setLoading(false);
        }
    };

    const resetGame = async () => {
        // Not fully implemented on backend yet for "Hard Reset", but we can clear progress
        // For now, simple manual reset
        try {
            setLoading(true);
            const initialPower = { economy: 10, military: 10, health: 10, infrastructure: 10 };

            // Reset backend state (Assuming we add a reset endpoint or just update manually)
            // Since we don't have a clear /reset, we use update-progress with manual values
            // We assume Data StartQid is Q1.
            await api.post('/game/update-progress', {
                currentQuestion: 'Q1',
                faction: faction
            });
            await api.post('/point/update', initialPower);

            setPower(initialPower);
            setGameOver(false);
            setUnlockTime(null);
            setLockedAnswer(null);
            setPendingNextQid(null);

            await fetchCurrentQuestion(); // Load Q1

        } catch (err) {
            console.error("Reset failed", err);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        currentQuestion,
        power,
        handleAnswer,
        gameOver,
        resetGame,
        loading,
        setPower,
        faction,
        selectFaction,
        unlockTime,
        lockedAnswer
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};
