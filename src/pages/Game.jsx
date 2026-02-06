import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { Navigate, Link } from 'react-router-dom';
import { Sword, Heart, RefreshCw, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const Game = () => {
    const { currentQuestion, handleAnswer, gameOver, resetGame, faction, loading, unlockTime, lockedAnswer } = useGame();
    const [answerInput, setAnswerInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);

    // UI State
    const [selectedOption, setSelectedOption] = useState(null); // For Confirmation Modal
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [inputError, setInputError] = useState('');
    const [inputSuccess, setInputSuccess] = useState(''); // "Correct, protocols engaging..."

    // Timer Effect
    useEffect(() => {
        if (!unlockTime) {
            setTimeLeft(0);
            return;
        }

        const checkTimer = () => {
            const now = Date.now();
            const diff = unlockTime - now;
            if (diff <= 0) {
                setTimeLeft(0);
                if (lockedAnswer) {
                    handleAnswer(lockedAnswer, true); // Auto-Proceed
                }
            } else {
                setTimeLeft(diff);
            }
        };

        // Check immediately
        checkTimer();

        const interval = setInterval(checkTimer, 1000);
        return () => clearInterval(interval);
    }, [unlockTime, lockedAnswer]); // Added lockedAnswer dependency

    // Format Time Helper
    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-w-[50vh]">
            <div className="inline-block p-8 glass-panel rounded-full animate-spin-slow">
                <div className="w-8 h-8 border-2 border-ochre border-t-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    );

    if (!faction) {
        return <Navigate to="/select-faction" replace />;
    }

    // --- HANDLERS ---

    // 1. Input Submission
    const submitInput = async () => {
        if (answerInput.trim()) {
            setInputError('');
            // Attempt to submit (or lock if correct)
            // handleAnswer returns success/fail object for inputs
            const result = await handleAnswer(answerInput);

            if (result && !result.success) {
                setInputError(result.message || 'Invalid Input');
            } else if (result && result.success && result.message) {
                // Determine if it was just locked (Timer started) or completed (No timer/ANY)
                // If Timer Started, `unlockTime` will be set by context.
                // We can show the success message.
                setInputSuccess(result.message);
                setAnswerInput('');
            }
        }
    };

    // 2. MCQ Option Click -> Open Modal
    const handleOptionClick = (text) => {
        if (lockedAnswer) return; // Already locked
        setSelectedOption(text);
        setShowConfirmModal(true);
    };

    // 3. Confirm MCQ -> Lock & Start Timer
    const confirmMCQSelection = () => {
        if (selectedOption) {
            // Pass flag isMCQConfirm = true to tell Context to LOCK and START TIMER (5m)
            handleAnswer(selectedOption, false, true);
            setShowConfirmModal(false);
            setSelectedOption(null);
        }
    };

    // 4. Force Proceed (After Timer)
    const handleProceed = () => {
        if (timeLeft > 0) return; // Should be disabled anyway
        if (lockedAnswer) {
            handleAnswer(lockedAnswer, true); // Force Submit
            setInputSuccess(''); // Clear any success msg
        }
    };


    if (gameOver) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in relative z-10 px-4">
                <div className="w-full max-w-2xl glass-panel p-6 md:p-12 text-center rounded-3xl relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-500/10 blur-[100px] rounded-full pointer-events-none"></div>

                    <h1 className="text-3xl md:text-5xl font-heading text-green-500 mb-2 uppercase tracking-tighter text-glow drop-shadow-md">
                        CAMPAIGN COMPLETED
                    </h1>
                    <p className="text-sm md:text-base font-mono text-green-500/60 uppercase tracking-[0.3em] mb-6">
                        Thank you for participating
                    </p>

                    <div className="w-16 md:w-24 h-1 bg-green-500/50 mx-auto mb-6 md:mb-8 rounded-full"></div>

                    <p className="text-base md:text-xl font-body text-white/90 mb-6 md:mb-4 leading-relaxed">
                        Take a screenshot and share it in your stories tagging us to enjoy your success!
                    </p>

                    <p className="text-[10px] md:text-xs font-mono text-white/30 uppercase tracking-[0.2em] mb-8">
                        © GDG LUDHIANA - NIT HAMIRPUR CHAPTER
                    </p>


                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 mb-8 md:mb-10">
                        <p className="text-white text-base md:text-lg font-bold mb-4">Continue Your Conquest:</p>
                        <div className="flex flex-col md:flex-row justify-center gap-4">

                            <Link to="/attack" className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500 border border-red-500/30 hover:border-red-500 text-red-100 hover:text-white rounded-lg transition-all font-heading uppercase tracking-wider text-sm md:text-base group">
                                <Sword size={18} className="group-hover:rotate-12 transition-transform" />
                                Sabotage Rivals
                            </Link>
                            <Link to="/help" className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500/20 hover:bg-green-500 border border-green-500/30 hover:border-green-500 text-green-100 hover:text-white rounded-lg transition-all font-heading uppercase tracking-wider text-sm md:text-base group">
                                <Heart size={18} className="group-hover:scale-110 transition-transform" />
                                Aid Allies
                            </Link>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-6 md:pt-8 mt-4 md:mt-8">
                        <p className="text-xs text-white/30 mb-4 uppercase tracking-widest">Optional: Reset Timeline</p>
                        <button
                            onClick={resetGame}
                            className="flex items-center justify-center gap-2 mx-auto px-6 py-2 bg-transparent hover:bg-white/5 text-white/40 hover:text-white border border-transparent hover:border-white/20 transition-all rounded-lg text-xs font-mono uppercase tracking-widest"
                        >
                            <RefreshCw size={12} />
                            Restart Campaign
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const isMCQ = currentQuestion && (currentQuestion.type === 'option' || currentQuestion.type === 'decision' || currentQuestion.type === 'outcome');
    // If it's Input type, we still show Locked UI if lockedAnswer is set (timer running)

    return (
        <div className="max-w-4xl mx-auto animate-fade-in flex flex-col justify-center min-h-[60vh] relative z-10 w-full px-4 md:px-0">
            {/* Stylish Question Card */}
            {currentQuestion ? (
                <div className="glass-panel p-6 md:p-12 rounded-3xl relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-ochre to-transparent opacity-50"></div>

                    <div className="mb-6 md:mb-8 text-center pt-2 md:pt-4">
                        <h3 className="text-xs md:text-sm font-mono text-ochre uppercase tracking-[0.4em] mb-2 opacity-80">Incoming Transmission</h3>
                        <div className="h-px w-24 md:w-32 bg-white/10 mx-auto"></div>

                        {/* TIMER DISPLAY (Visible if Timer is set) */}
                        {unlockTime && (
                            <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border ${timeLeft > 0 ? 'bg-red-500/10 border-red-500/50 text-red-200' : 'bg-green-500/10 border-green-500/50 text-green-200 animate-pulse'} transition-all`}>
                                <Clock size={16} className={timeLeft > 0 ? 'animate-pulse' : ''} />
                                <span className="font-mono font-bold tracking-widest text-lg">
                                    {timeLeft > 0 ? formatTime(timeLeft) : "READY"}
                                </span>
                            </div>
                        )}
                    </div>

                    <h1 className="text-xl md:text-4xl font-heading text-white text-center leading-tight mb-8 md:mb-12 drop-shadow-md">
                        {currentQuestion.text}
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-2 md:pb-4">
                        {isMCQ && currentQuestion.options.map((option, idx) => {
                            const isSelected = lockedAnswer === option.text; // Locked answer logic
                            // Dim others if locked
                            const isDimmed = lockedAnswer && !isSelected;

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionClick(option.text)}
                                    disabled={!!lockedAnswer} // Disable interaction if locked
                                    className={`group relative p-4 md:p-6 text-left rounded-xl transition-all border 
                                        ${isSelected
                                            ? 'bg-ochre/20 border-ochre shadow-[0_0_30px_rgba(223,158,31,0.2)] scale-[1.02]'
                                            : 'border-white/10 bg-white/5 hover:bg-ochre/20 hover:border-ochre/50 hover:shadow-[0_0_30px_rgba(223,158,31,0.1)] active:scale-[0.98]'
                                        } 
                                        ${isDimmed ? 'opacity-40 grayscale cursor-not-allowed' : 'opacity-100'}
                                    `}
                                >
                                    <div className={`absolute top-2 right-2 md:top-4 md:right-4 font-heading text-2xl md:text-4xl transition-colors ${isSelected ? 'text-ochre' : 'text-white/10 group-hover:text-white/20'}`}>
                                        {idx + 1}
                                    </div>
                                    <span className={`block text-base md:text-xl font-bold transition-colors mb-1 md:mb-2 pr-8 ${isSelected ? 'text-ochre' : 'text-white group-hover:text-ochre'}`}>{option.text}</span>

                                    {option.effects && isSelected && (
                                        <div className="flex flex-wrap gap-2 mt-2 md:mt-4 text-[10px] md:text-xs font-mono opacity-100 transition-opacity">
                                            {Object.entries(option.effects).map(([k, v]) => (
                                                <span key={k} className={`${v > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                    {k.substring(0, 3).toUpperCase()} {v > 0 ? '+' : ''}{v}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </button>
                            );
                        })}

                        {/* CONFIRMATION MODAL (MCQ) */}
                        {showConfirmModal && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
                                <div className="bg-black border border-ochre/50 p-8 rounded-2xl max-w-sm w-full mx-4 relative overflow-hidden shadow-[0_0_50px_rgba(223,158,31,0.3)]">
                                    <div className="mb-6 text-center">
                                        <AlertTriangle size={48} className="mx-auto text-ochre mb-4 animate-pulse" />
                                        <h3 className="text-2xl font-heading text-white uppercase tracking-wider mb-2">Confirm Decision</h3>
                                        <p className="text-white/60 text-sm">
                                            The action is irreversible. Protocols dictate a <strong>60-second cooldown</strong> after confirmation.
                                        </p>
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setShowConfirmModal(false)}
                                            className="flex-1 py-3 border border-white/20 hover:bg-white/10 rounded-lg text-white font-mono uppercase tracking-widest text-xs transition-all"
                                        >
                                            Abort
                                        </button>
                                        <button
                                            onClick={confirmMCQSelection}
                                            className="flex-1 py-3 bg-ochre hover:bg-ochre-light text-black font-bold rounded-lg font-heading uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(223,158,31,0.4)]"
                                        >
                                            Execute
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}


                        {/* INPUT SECTION */}
                        {currentQuestion.type === 'input' && (
                            <div className="col-span-full space-y-4 md:space-y-6 max-w-lg mx-auto w-full">
                                {currentQuestion.correctAnswer === 'ANY' ? (
                                    <button
                                        onClick={() => handleAnswer('ANY')}
                                        className="w-full py-4 md:py-6 bg-green-500 hover:bg-green-600 text-white text-lg md:text-2xl font-heading uppercase tracking-[0.2em] transition-all rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] hover:-translate-y-1 active:scale-95 animate-pulse-slow"
                                    >
                                        Proceed to Next Round
                                    </button>
                                ) : (
                                    <>
                                        {/* Show locked answer if locked, or input if not */}
                                        {lockedAnswer ? (
                                            <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl text-center animate-fade-in">
                                                <CheckCircle size={32} className="mx-auto text-green-500 mb-2" />
                                                <h3 className="text-xl font-heading text-green-400 uppercase tracking-widest mb-1">Access Granted</h3>
                                                <p className="text-white/60 font-mono text-sm leading-relaxed mb-4">
                                                    Code accepted. System compiling results.<br />
                                                    <strong>Cooldown Active: 60 Seconds</strong>
                                                </p>
                                                {/* Show Effects for Input Question */}
                                                {currentQuestion.effects && (
                                                    <div className="flex flex-wrap justify-center gap-2 mt-2 text-xs font-mono">
                                                        {Object.entries(currentQuestion.effects).map(([k, v]) => (
                                                            <span key={k} className={`px-2 py-1 rounded border ${v > 0 ? 'bg-green-500/20 border-green-500/50 text-green-300' : 'bg-red-500/20 border-red-500/50 text-red-300'}`}>
                                                                {k.toUpperCase()} {v > 0 ? '+' : ''}{v}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <>
                                                <input
                                                    type="text"
                                                    className={`w-full bg-black/50 border rounded-xl p-4 md:p-6 text-xl md:text-2xl text-white font-bold outline-none transition-all placeholder:text-white/10 text-center
                                                        ${inputError ? 'border-red-500 ring-1 ring-red-500/50' : 'border-white/20 focus:border-ochre focus:ring-1 focus:ring-ochre/50'}
                                                    `}
                                                    placeholder="TYPE_YOUR_INPUT"
                                                    value={answerInput}
                                                    onChange={(e) => setAnswerInput(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && submitInput()}
                                                    autoFocus
                                                />
                                                {inputError && (
                                                    <p className="text-red-500 text-xs font-mono text-center uppercase tracking-widest animate-shake">
                                                        Error: {inputError}
                                                    </p>
                                                )}
                                                <button
                                                    onClick={submitInput}
                                                    className="w-full py-3 md:py-4 bg-white/10 hover:bg-ochre text-white hover:text-black text-lg md:text-xl font-heading uppercase tracking-widest transition-all rounded-xl border border-white/10 hover:border-ochre"
                                                >
                                                    Transmit
                                                </button>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        )}



                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <div className="inline-block p-8 glass-panel rounded-full animate-spin-slow">
                        <div className="w-8 h-8 border-2 border-ochre border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Game;
