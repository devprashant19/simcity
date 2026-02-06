import React, { useEffect, useState } from 'react';
import api from '../api.js';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext'; // Import GameContext
import { Heart, Globe, AlertTriangle } from 'lucide-react';

const Help = () => {
    const [targets, setTargets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [warEnabled, setWarEnabled] = useState(false); // War State
    const { mongoUser, fetchStats } = useAuth();
    const { power, setPower } = useGame(); // Get power and setter from context

    // Confirmation Modal State
    const [confirmTarget, setConfirmTarget] = useState(null);

    // Fetch War Status & Targets with Polling
    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                // 1. Check War Status
                const warRes = await api.get('/war/status');
                const isWarActive = warRes.data.warEnabled;

                if (isMounted) setWarEnabled(isWarActive);

                // If War is OFF, stop here
                if (!isWarActive) {
                    if (isMounted) setLoading(false);
                    return;
                }

                // 2. Fetch Targets (Only if War is Active)
                // Use /leaderboard/infrastructure for consistent target list
                const res = await api.get('/leaderboard/infrastructure');
                if (!isMounted) return;

                const list = res.data.leaderboard || [];
                // Filter out current user
                const currentId = mongoUser?._id || mongoUser?.id;
                const filtered = list.filter(u => u.id !== currentId && u._id !== currentId);
                setTargets(filtered);
            } catch (err) {
                console.error('Data acquisition failed:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();
        // Poll every 5 seconds
        const intervalId = setInterval(fetchData, 5000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        }
    }, [mongoUser]);

    const initiateHelp = (user) => {
        if (power.economy < 2) {
            setStatus('ERROR: Insufficient Economy (Need 2)');
            setTimeout(() => setStatus(''), 4000);
            return;
        }
        setConfirmTarget(user);
    };

    const confirmHelp = async () => {
        if (!confirmTarget) return;

        const targetId = confirmTarget.id;
        setConfirmTarget(null);

        try {
            setStatus('SENDING_AID...');

            // Optimistic Update: Immediately reflect +1 Economy on target
            setTargets(prev => prev.map(u => {
                if (u.id === targetId) {
                    return { ...u, economy: (u.economy || 0) + 1 };
                }
                return u;
            }));

            // Call Backend
            const res = await api.post('/power/aid', { targetId });

            // Customized Success Message with Remaining Count
            const helpLeft = res.data.helpLeft;
            setStatus(`AID DELIVERED! [REMAINING AID: ${helpLeft}]`);

            // Update Local Stats from Response
            if (res.data.attackerStats) {
                setPower(res.data.attackerStats);
            } else {
                // Fallback optimistic local update
                setPower(prev => ({ ...prev, economy: prev.economy - 2 }));
            }

            // Sync full stats in background (which updates mongoUser.helpLeft)
            fetchStats();

            setTimeout(() => setStatus(''), 4000);
        } catch (err) {
            setStatus(`ERROR: ${err.response?.data?.message || err.message}`);
            setTimeout(() => setStatus(''), 4000);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
                <div className="h-2 w-48 bg-green-500/20 overflow-hidden relative">
                    <div className="absolute inset-0 bg-green-500 animate-[loading_1.5s_infinite]"></div>
                </div>
                <p className="mt-6 text-xl font-black text-green-500 uppercase tracking-[0.5em]">Locating_Allies...</p>
            </div>
        );
    }

    // WAR ZONE INACTIVE STATE (Gates Aid too)
    if (!warEnabled) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4 animate-fade-in">
                <div className="bg-black/50 border border-white/10 p-12 rounded-2xl backdrop-blur-md max-w-2xl w-full">
                    <div className="mb-6 flex justify-center">
                        <AlertTriangle size={80} className="text-white/20" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-heading text-white uppercase tracking-tighter text-glow mb-4">
                        Aid Routes Closed
                    </h2>
                    <p className="text-white/40 font-mono uppercase tracking-widest text-sm md:text-base">
                        Global Protocols dictate that Aid can only be dispatched during Active War Status.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 animate-fade-in">
            <div className="mb-10 text-center">
                <h2 className="text-3xl font-heading text-white uppercase tracking-tighter text-glow mb-2">Humanitarian Aid</h2>
                <div className="w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
                <p className="mt-2 text-white/40 text-xs font-mono tracking-widest uppercase">Live Aid Channel • Auto-Refresh Active</p>
            </div>

            {status && (
                <div className="bg-green-500 p-6 border-4 border-black text-black font-black text-2xl text-center animate-pulse shadow-[8px_8px_0px_white] mb-8">
                    {status}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {targets.map(user => (
                    <div key={user.id} className="glass-panel p-6 rounded-2xl relative group hover:bg-green-500/5 transition-all hover:-translate-y-1">
                        <div className="absolute top-4 right-4 text-white/20">
                            <Globe size={24} />
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-green-500 transition-colors">{user.username}</h3>
                        <div className="text-xs font-mono text-white/40 mb-6 uppercase tracking-widest">
                            ID: {user.id.substring(0, 8)}
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {/* Display ALL 4 Stats */}
                            <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                                <div className="text-[10px] uppercase text-white/40 font-mono mb-1">Economy</div>
                                <div className="text-lg font-heading text-yellow-500">{user.economy || 0}</div>
                            </div>
                            <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                                <div className="text-[10px] uppercase text-white/40 font-mono mb-1">Defense</div>
                                <div className="text-lg font-heading text-blue-500">{user.military || 0}</div>
                            </div>
                            <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                                <div className="text-[10px] uppercase text-white/40 font-mono mb-1">Infrastr.</div>
                                <div className="text-lg font-heading text-orange-500">{user.infrastructure || 0}</div>
                            </div>
                            <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                                <div className="text-[10px] uppercase text-white/40 font-mono mb-1">Health</div>
                                <div className="text-lg font-heading text-green-500">{user.health || 0}</div>
                            </div>
                        </div>

                        <button
                            onClick={() => initiateHelp(user)}
                            disabled={status.includes('SENDING') || (mongoUser?.helpLeft <= 0)}
                            className={`w-full py-3 border rounded-xl font-bold uppercase text-sm tracking-wider transition-all flex items-center justify-center gap-2 group/btn
                                ${mongoUser?.helpLeft <= 0
                                    ? 'bg-gray-800/50 text-gray-500 border-gray-700 cursor-not-allowed'
                                    : 'bg-green-500/20 hover:bg-green-500 text-green-200 hover:text-white border-green-500/30 hover:border-green-500'
                                }`}
                        >
                            <Heart size={16} className={`transition-transform ${mongoUser?.helpLeft > 0 ? 'group-hover/btn:scale-110' : ''}`} />
                            <span>{mongoUser?.helpLeft > 0 ? 'Send Aid (-1 Aid)' : 'No Aid Left'}</span>
                        </button>
                    </div>
                ))}
            </div>

            {targets.length === 0 && (
                <div className="text-center py-24 text-white/30 font-mono uppercase tracking-widest">
                    No_Allies_Found
                </div>
            )}


            <div className="text-center pt-8 opacity-20">
                <div className="inline-flex items-center gap-4 border-t border-white/20 pt-4 px-12">
                    <span className="text-xs font-black uppercase tracking-widest">Aid_Protocol_Active</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-blink"></div>
                </div>
            </div>

            {/* CONFIRMATION MODAL */}
            {confirmTarget && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4">
                    <div className="bg-black border-2 border-green-500 p-8 rounded-2xl max-w-sm w-full relative overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                        <div className="mb-6 text-center">
                            <Heart size={48} className="mx-auto text-green-500 mb-4 animate-pulse" />
                            <h3 className="text-2xl font-heading text-white uppercase tracking-wider mb-2">Confirm Aid</h3>
                            <p className="text-white/60 text-sm mb-4">
                                Dispatching relief to <strong>{confirmTarget.username}</strong>.
                            </p>
                            <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg inline-block">
                                <p className="text-green-400 font-mono font-bold tracking-widest text-xs uppercase">
                                    Remaining Aid: {mongoUser?.helpLeft || 0}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setConfirmTarget(null)}
                                className="flex-1 py-3 border border-white/20 hover:bg-white/10 rounded-lg text-white font-mono uppercase tracking-widest text-xs transition-all"
                            >
                                Abort
                            </button>
                            <button
                                onClick={confirmHelp}
                                className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg font-heading uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                            >
                                Dispatch
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Help;
