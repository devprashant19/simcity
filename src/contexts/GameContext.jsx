/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';


const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    const { mongoUser } = useAuth();
    // Use local questions data directly. Initializing as null, loading in effect.
    const [questionsData, setQuestionsData] = useState(null);
    const [currentQuestionKey, setCurrentQuestionKey] = useState(null);
    const [faction, setFaction] = useState(null);

    // Restored State Variables
    const [power, setPower] = useState({
        economy: 10,
        military: 10,
        health: 10,
        infrastructure: 10
    });
    const [loading, setLoading] = useState(true);
    const [gameOver, setGameOver] = useState(false);

    // Timer Logic
    const [unlockTime, setUnlockTime] = useState(null);
    const [lockedAnswer, setLockedAnswer] = useState(null);

    // Loaded qData references
    const [qData, setQData] = useState(null);

    // Flag to prevent saving to localStorage before we have loaded from it
    const [isInitialized, setIsInitialized] = useState(false);

    // Helper to load specific faction data
    const loadFactionData = async (factionName) => {
        let data;
        switch (factionName) {
            case 'Ninja':
                data = await import('../data/ninja.json');
                break;
            case 'Dwarfs':
                data = await import('../data/dwarfs.json');
                break;
            case 'Elves':
                data = await import('../data/elves.json');
                break;
            default:
                // Fallback or default questions if needed, though we want forced selection
                data = await import('../data/questions.json');
        }
        return data.default || data;
    };

    // Initialize Game Data and State
    useEffect(() => {
        // Safe check for ID, supporting both _id and id (Mongoose default vs virtuals)
        const userId = mongoUser?._id || mongoUser?.id;

        // Ensure loading is set to false if no user, so we don't get stuck on spinner forever if auth fails/delays
        if (!userId) {
            setLoading(false);
            return;
        }

        const initGame = async () => {
            try {
                // Check Local Storage for Faction
                const storageKey = `simcity_${userId}`;
                const savedFaction = localStorage.getItem(`${storageKey}_faction`);
                const savedQIdx = localStorage.getItem(`${storageKey}_currentQ`);
                const savedPower = localStorage.getItem(`${storageKey}_power`);
                const savedGameOver = localStorage.getItem(`${storageKey}_gameOver`);
                const savedUnlockTime = localStorage.getItem(`${storageKey}_unlockTime`);
                const savedLockedAnswer = localStorage.getItem(`${storageKey}_lockedAnswer`);

                if (savedUnlockTime) setUnlockTime(parseInt(savedUnlockTime, 10));
                if (savedLockedAnswer) setLockedAnswer(savedLockedAnswer);

                // PRIORITIZE BACKEND DATA
                // mongoUser is the source of truth if it has data
                const backendFaction = mongoUser.faction;
                const backendQIdx = mongoUser.currentQuestion;

                const effectiveFaction = backendFaction || savedFaction;

                let finalData = null;

                if (effectiveFaction) {
                    setFaction(effectiveFaction);
                    finalData = await loadFactionData(effectiveFaction);
                    setQData(finalData);
                    setQuestionsData(finalData);
                }

                // Restore State
                if (finalData) {
                    if (backendQIdx) {
                        setCurrentQuestionKey(backendQIdx);
                    } else if (savedQIdx && !backendQIdx) {
                        setCurrentQuestionKey(savedQIdx);
                    } else {
                        setCurrentQuestionKey(finalData.startQid);
                    }
                }

                if (savedPower) {
                    try {
                        const parsed = JSON.parse(savedPower);
                        if (parsed) setPower(parsed);
                    } catch (e) {
                        console.error("Failed to parse saved power", e);
                        // Fallback
                        if (mongoUser.power) setPower(prev => ({ ...prev, ...mongoUser.power }));
                    }
                } else if (mongoUser.power) {
                    // Start fresh from DB (or default)
                    setPower(prev => ({ ...prev, ...mongoUser.power }));
                }

                if (savedGameOver === 'true') {
                    setGameOver(true);
                } else {
                    setGameOver(false);
                }

            } catch (err) {
                console.error("Failed to init game", err);
            } finally {
                setLoading(false);
                setIsInitialized(true);
            }
        };
        initGame();
    }, [mongoUser]); // Re-run when user changes

    // Save State on Updates - GUARDED & SCOPED
    useEffect(() => {
        const userId = mongoUser?._id || mongoUser?.id;
        if (!isInitialized || !userId) return;

        const storageKey = `simcity_${userId}`;
        if (faction) localStorage.setItem(`${storageKey}_faction`, faction);
        if (currentQuestionKey) localStorage.setItem(`${storageKey}_currentQ`, currentQuestionKey);
        if (power) localStorage.setItem(`${storageKey}_power`, JSON.stringify(power));
        localStorage.setItem(`${storageKey}_gameOver`, gameOver);

        if (unlockTime) localStorage.setItem(`${storageKey}_unlockTime`, unlockTime);
        else localStorage.removeItem(`${storageKey}_unlockTime`);

        if (lockedAnswer) localStorage.setItem(`${storageKey}_lockedAnswer`, lockedAnswer);
        else localStorage.removeItem(`${storageKey}_lockedAnswer`);


    }, [currentQuestionKey, power, gameOver, isInitialized, mongoUser, faction, unlockTime, lockedAnswer]);


    // Find current question object
    const currentQuestion = (qData && qData.questions && currentQuestionKey)
        ? qData.questions[currentQuestionKey]
        : null;

    const updatePower = async (impact) => {
        try {
            // Optimistic update
            const newPower = { ...power };
            Object.keys(impact).forEach(key => {
                if (newPower[key] !== undefined) {
                    newPower[key] += impact[key];
                }
            });
            setPower(newPower);

            // Backend Sync
            await api.post('/point/update', newPower);
        } catch (err) {
            console.error("Failed to sync power stats", err);
        }
    };

    /**
     * Locks the answer and starts a timer.
     * @param {string} answer - The selected answer.
     * @param {number} minutes - Duration in minutes.
     */
    const lockWithTimer = (answer, minutes) => {
        setLockedAnswer(answer);
        const duration = minutes * 60 * 1000;
        setUnlockTime(Date.now() + duration);
    };

    const handleAnswer = async (answer, forceSubmit = false, isMCQConfirm = false) => {
        if (!currentQuestion) return;

        // --- PREPARE LOGIC ---
        // Calc Next QID and Effects *before* checking phase, so we can use them in Phase 1 (Sync)
        const isMCQ = (currentQuestion.type === 'decision' || currentQuestion.type === 'option');
        let nextQid = currentQuestion.nextQid;
        let effects = {};

        if (currentQuestion.type === 'input') {
            // Input Check logic
            const isCorrect = currentQuestion.correctAnswer === "ANY" ||
                (currentQuestion.correctAnswer && answer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase());

            if (!isCorrect && !forceSubmit) {
                // Only return false if we are in Phase 1 attempt
                return { success: false, message: "Incorrect passkey." };
            }
            // If Input Correct:
            effects = currentQuestion.effects || {};
        } else if (isMCQ) {
            const selectedOption = currentQuestion.options.find(o => o.text === answer);
            if (selectedOption) {
                effects = selectedOption.effects || {};
                if (selectedOption.nextQid) {
                    nextQid = selectedOption.nextQid;
                }
            }
        }

        // --- PHASE 1: START TIMER + IMMEDIATE SYNC ---
        // Triggered by Modal Confirm (MCQ) or Correct Input
        if ((isMCQConfirm) || (currentQuestion.type === 'input' && !lockedAnswer && !forceSubmit)) {

            // 1. Lock Local Timer
            const duration = isMCQConfirm ? 2 : 2;
            lockWithTimer(answer, duration);

            // 2. IMMEDIATE SYNC to Backend
            // Allow user to "move forward" on other devices right away
            if (effects && Object.keys(effects).length > 0) {
                updatePower(effects); // Syncs power
            }

            if (nextQid && !currentQuestion.isEnd) {
                try {
                    await api.post('/game/update-progress', { currentQuestion: nextQid });
                } catch (err) {
                    console.error("Failed to sync progress early", err);
                }
            }

            // Return early. Local UI waits.
            return { success: true, message: " Protocols engaging..." };
        }

        // --- PHASE 2: PROCEED (Force Submit) ---
        // Triggered by "Proceed" button after timer
        if (forceSubmit) {
            // Backend is already updated. Just catch up Local State.
            setUnlockTime(null);
            setLockedAnswer(null);

            if (currentQuestion.isEnd) {
                setGameOver(true);
            } else if (nextQid) {
                setCurrentQuestionKey(nextQid);
                // Note: We don't sync again here, mostly.
            }
            return { success: true };
        }
    };

    const selectFaction = async (selectedFaction) => {
        const userId = mongoUser?._id || mongoUser?.id;
        if (!userId) return;

        setLoading(true);
        try {
            const data = await loadFactionData(selectedFaction);
            const finalData = data.default || data;

            setFaction(selectedFaction);
            setQData(finalData);
            setQuestionsData(finalData);
            setCurrentQuestionKey(finalData.startQid);
            setGameOver(false);

            // Clear any old timer state
            setUnlockTime(null);
            setLockedAnswer(null);

            // Force save immediately to avoid race conditions with unmount/reload
            const storageKey = `simcity_${userId}`;
            localStorage.setItem(`${storageKey}_faction`, selectedFaction);
            localStorage.setItem(`${storageKey}_currentQ`, finalData.startQid);

            // Sync Faction to Backend
            await api.post('/game/update-progress', {
                faction: selectedFaction,
                currentQuestion: finalData.startQid
            });

        } catch (err) {
            console.error("Error selecting faction:", err);
        } finally {
            setLoading(false);
        }
    };

    const resetGame = () => {
        const userId = mongoUser?._id || mongoUser?.id;
        if (!userId) return;

        const start = qData?.startQid || 'Q1';
        setCurrentQuestionKey(start);
        const initialPower = { economy: 10, military: 10, health: 10, infrastructure: 10 };
        setPower(initialPower);
        setGameOver(false);
        setUnlockTime(null);
        setLockedAnswer(null);

        // Clear Storage (Scoped) but KEEP faction
        const storageKey = `simcity_${userId}`;
        localStorage.setItem(`${storageKey}_currentQ`, start);
        localStorage.setItem(`${storageKey}_power`, JSON.stringify(initialPower));
        localStorage.setItem(`${storageKey}_gameOver`, false);
        localStorage.removeItem(`${storageKey}_unlockTime`);
        localStorage.removeItem(`${storageKey}_lockedAnswer`);

        // Ensure faction remains
        if (faction) localStorage.setItem(`${storageKey}_faction`, faction);

        // Sync reset to backend
        api.post('/point/update', initialPower);
        api.post('/game/update-progress', { currentQuestion: start });
    };

    const value = {
        currentQuestion,
        power,
        handleAnswer,
        gameOver,
        resetGame,
        loading,
        setPower, // Exported for Help.jsx simulation
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
