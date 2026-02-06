import React, { useEffect, useState } from 'react';
import api from '../api.js';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext'; // Import useGame
import { Sword, Target, Crosshair, AlertTriangle } from 'lucide-react';

const Attack = () => {
    const [targets, setTargets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const { mongoUser, fetchStats } = useAuth();
    const { power, setPower } = useGame();

    // Confirmation Modal State
    const [confirmTarget, setConfirmTarget] = useState(null);

    // Fetch Targets with Polling
    useEffect(() => {
        let isMounted = true;

        const fetchTargets = async () => {
            try {
                // Use /leaderboard/infrastructure for consistent target list
                const res = await api.get('/leaderboard/infrastructure');
                if (!isMounted) return;

                const list = res.data.leaderboard || [];
                // Filter out current user. Handle both id formats.
                const currentId = mongoUser?._id || mongoUser?.id;
                const filtered = list.filter(u => u.id !== currentId && u._id !== currentId);
                setTargets(filtered);
            } catch (err) {
                console.error('Target acquisition failed:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchTargets(); // Initial fetch

        // Poll every 5 seconds for live updates
        const intervalId = setInterval(fetchTargets, 5000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [mongoUser]);

    const initiateAttack = (user) => {
        // Pre-check Military Power (Frontend)
        if (power.military < 5) {
            setStatus('ERROR: Insufficient Military Power (Need 5)');
            setTimeout(() => setStatus(''), 4000);
            return;
        }
        setConfirmTarget(user);
    };

    const confirmAttack = async () => {
        if (!confirmTarget) return;

        const defenderId = confirmTarget.id;
        // Close modal immediately
        setConfirmTarget(null);

        try {
            setStatus('LAUNCHING_STRIKE...');

            // Optimistic Update: Immediately reflect damage on target in UI
            setTargets(prev => prev.map(u => {
                if (u.id === defenderId) {
                    return { ...u, infrastructure: Math.max(0, (u.infrastructure || 0) - 3) };
                }
                return u;
            }));

            const res = await api.post('/attack', { defenderId });

            // Customized Success Message with Remaining Count
            const attacksLeft = res.data.attacksLeft;
            setStatus(`STRIKE SUCCESSFUL! [REMAINING ATTACKS: ${attacksLeft}]`);

            // Update GameContext State DIRECTLY from API response
            if (res.data.attackerStats) {
                setPower(res.data.attackerStats);
            } else {
                setPower(prev => ({
                    ...prev,
                    military: prev.military - 2,
                    economy: prev.economy + 1
                }));
            }

            // Sync full stats in background (which updates mongoUser.attacksLeft)
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
                <div className="h-2 w-48 bg-ochre/20 overflow-hidden relative">
                    <div className="absolute inset-0 bg-ochre animate-[loading_1.5s_infinite]"></div>
                </div>
                <p className="mt-6 text-xl font-black text-ochre uppercase tracking-[0.5em]">Scanning_For_Hostiles...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 animate-fade-in">
            <div className="mb-10 text-center">
                <h2 className="text-3xl font-heading text-white uppercase tracking-tighter text-glow mb-2">Target Acquisition</h2>
                <div className="w-24 h-1 bg-ochre mx-auto rounded-full"></div>
                <p className="mt-2 text-white/40 text-xs font-mono tracking-widest uppercase">Live Satellite Feed • Auto-Refresh Active</p>
            </div>

            {status && (
                <div className="bg-ochre p-6 border-4 border-black text-black font-black text-2xl text-center animate-pulse shadow-[8px_8px_0px_white] mb-8">
                    {status}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {targets.map(user => (
                    <div key={user.id} className="glass-panel p-6 rounded-2xl relative group hover:bg-ochre/5 transition-all hover:-translate-y-1">
                        <div className="absolute top-4 right-4 text-white/20">
                            <Crosshair size={24} />
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-ochre transition-colors">{user.username}</h3>
                        <div className="text-xs font-mono text-white/40 mb-6 uppercase tracking-widest">
                            ID: {user.id.substring(0, 8)}
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {/* Economy */}
                            <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                                <div className="text-[10px] uppercase text-white/40 font-mono mb-1">Economy</div>
                                <div className="text-lg font-heading text-yellow-500">{user.economy || 0}</div>
                            </div>

                            {/* Military (Defense) */}
                            <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                                <div className="text-[10px] uppercase text-white/40 font-mono mb-1">Military</div>
                                <div className="text-lg font-heading text-blue-500">{user.military || 0}</div>
                            </div>

                            {/* Infrastructure */}
                            <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                                <div className="text-[10px] uppercase text-white/40 font-mono mb-1">Infrastr.</div>
                                <div className="text-lg font-heading text-orange-500">{user.infrastructure || 0}</div>
                            </div>

                            {/* Health */}
                            <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                                <div className="text-[10px] uppercase text-white/40 font-mono mb-1">Health</div>
                                <div className="text-lg font-heading text-green-500">{user.health || 0}</div>
                            </div>
                        </div>

                        <button
                            onClick={() => initiateAttack(user)}
                            disabled={status.includes('LAUNCHING') || (mongoUser?.attacksLeft <= 0)}
                            className={`w-full py-3 border rounded-xl font-bold uppercase text-sm tracking-wider transition-all flex items-center justify-center gap-2 group/btn
                                ${mongoUser?.attacksLeft <= 0
                                    ? 'bg-gray-800/50 text-gray-500 border-gray-700 cursor-not-allowed'
                                    : 'bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white border-red-500/30 hover:border-red-500'
                                }`}
                        >
                            <Sword size={16} className={`transition-transform ${mongoUser?.attacksLeft > 0 ? 'group-hover/btn:rotate-12' : ''}`} />
                            <span>{mongoUser?.attacksLeft > 0 ? 'Sabotage (-1 Attack)' : 'No Attacks Left'}</span>
                        </button>
                    </div>
                ))}
            </div>

            {targets.length === 0 && (
                <div className="text-center py-24 text-white/30 font-mono uppercase tracking-widest">
                    No_Targets_In_Range
                </div>
            )}


            <div className="text-center pt-8 opacity-20">
                <div className="inline-flex items-center gap-4 border-t border-white/20 pt-4 px-12">
                    <span className="text-xs font-black uppercase tracking-widest">Strike_Protocol_Ready</span>
                    <div className="w-2 h-2 bg-ochre rounded-full animate-blink"></div>
                </div>
            </div>

            {/* CONFIRMATION MODAL */}
            {confirmTarget && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4">
                    <div className="bg-black border-2 border-red-500 p-8 rounded-2xl max-w-sm w-full relative overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.3)]">
                        <div className="mb-6 text-center">
                            <AlertTriangle size={48} className="mx-auto text-red-500 mb-4 animate-pulse" />
                            <h3 className="text-2xl font-heading text-white uppercase tracking-wider mb-2">Confirm Strike</h3>
                            <p className="text-white/60 text-sm mb-4">
                                Targeting <strong>{confirmTarget.username}</strong>.
                            </p>
                            <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg inline-block">
                                <p className="text-red-400 font-mono font-bold tracking-widest text-xs uppercase">
                                    Remaining Attacks: {mongoUser?.attacksLeft || 0}
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
                                onClick={confirmAttack}
                                className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg font-heading uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                            >
                                Launch
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Attack;
