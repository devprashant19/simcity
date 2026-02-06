import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, Crown, TrendingUp } from 'lucide-react';
import api from '../api';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { mongoUser } = useAuth();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await api.get('/leaderboard/infrastructure');
                // The backend returns all users sorted by infrastructure
                setUsers(res.data.leaderboard || []);
            } catch (err) {
                console.error("Failed to fetch leaderboard", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
        // Optional: Poll every 30s
        const interval = setInterval(fetchLeaderboard, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 text-white/50 font-mono italic">
                Downloading_Global_Rankings...
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-fade-in p-4">
            <div className="mb-10 text-center">
                <h2 className="text-3xl font-heading text-white uppercase tracking-tighter text-glow mb-2">Global Rankings</h2>
                <div className="w-24 h-1 bg-ochre mx-auto rounded-full"></div>
            </div>

            <div className="glass-panel overflow-hidden rounded-2xl">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                            <th className="p-6 text-sm font-black text-ochre uppercase tracking-wider">Rank</th>
                            <th className="p-6 text-sm font-black text-ochre uppercase tracking-wider">Citizen</th>
                            <th className="p-6 text-sm font-black text-ochre uppercase tracking-wider text-right">Total Power</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users
                            .map((user, index) => (
                                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                    <td className="p-6">
                                        <span className={`font-mono text-xl ${index < 3 ? 'text-ochre font-bold text-glow' : 'text-white/40'}`}>
                                            #{index + 1}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-10 ${index === 0 ? 'bg-ochre' : 'bg-white/10'} rounded-full`}></div>
                                            <div>
                                                <div className="text-lg font-bold text-white group-hover:text-ochre transition-colors">{user.username}</div>
                                                <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{user.id.substring(0, 6)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <span className="text-2xl font-heading text-white">{user.totalPower}</span>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                {users.length === 0 && (
                    <div className="p-12 text-center text-white/30 font-mono uppercase tracking-widest">
                        Data_Stream_Empty
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
