import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import api from '../api';
import { ShoppingCart, Shield, Activity, Anchor, ArrowUp, Coins, AlertOctagon } from 'lucide-react';

const Shop = () => {
    const { power, setPower } = useGame();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const COST_PER_POINT = 5;

    const handleBuy = async (type) => {
        setError('');
        setSuccess('');

        if (power.economy < COST_PER_POINT) {
            setError(`Insufficient Economy. Need ${COST_PER_POINT} Economy.`);
            return;
        }

        setLoading(true);

        const payload = {
            military: type === 'military' ? 1 : 0,
            health: type === 'health' ? 1 : 0,
            infrastructure: type === 'infrastructure' ? 1 : 0
        };

        try {
            const res = await api.post('/point/upgrade', payload);
            if (res.data && res.data.power) {
                setPower(res.data.power);
                setSuccess(`Successfully upgraded ${type.toUpperCase()}!`);
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Purchase failed");
        } finally {
            setLoading(false);
        }
    };

    const UpgradeCard = ({ type, icon: Icon, currentVal, color, label }) => (
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:bg-white/5 transition-all w-full">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
                <Icon size={100} />
            </div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-xl bg-white/5 ${color} text-white`}>
                        <Icon size={24} />
                    </div>
                    <div>
                        <h3 className="font-heading text-xl text-white uppercase tracking-wider">{label}</h3>
                        <p className="text-xs font-mono text-white/40">Current Level: {currentVal}</p>
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-mono text-white/60">Cost</span>
                        <div className="flex items-center gap-1 text-yellow-400 font-bold">
                            <Coins size={14} />
                            <span>{COST_PER_POINT}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => handleBuy(type)}
                        disabled={loading || power.economy < COST_PER_POINT}
                        className={`w-full py-3 rounded-xl font-heading uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all
                            ${loading ? 'bg-white/5 text-white/20' :
                                power.economy < COST_PER_POINT ? 'bg-red-500/10 text-red-500 cursor-not-allowed border border-red-500/30' :
                                    'bg-ochre hover:bg-ochre-light text-black hover:scale-[1.02] shadow-[0_0_20px_rgba(223,158,31,0.2)]'
                            }
                        `}
                    >
                        {loading ? 'Processing...' : (
                            <>
                                <ArrowUp size={16} />
                                Upgrade
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto py-8 animate-fade-in relative z-10">
            <div className="mb-12 text-center">
                <div className="inline-flex items-center gap-3 mb-4 px-4 py-1 rounded-full bg-ochre/10 border border-ochre/30 text-ochre">
                    <ShoppingCart size={16} />
                    <span className="text-xs font-mono uppercase tracking-widest">Black Market Exchange</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-heading text-white mb-4">Resource Upgrades</h1>
                <p className="text-white/60 max-w-2xl mx-auto">
                    Convert your surplus <span className="text-yellow-400 font-bold">Economy</span> into strategic assets.
                    Rates are fixed but subject to unseen market forces.
                </p>

                <div className="mt-8 inline-flex flex-col items-center bg-black/40 border border-yellow-500/30 p-4 rounded-xl backdrop-blur-sm">
                    <span className="text-xs font-mono text-white/40 uppercase tracking-widest mb-1">Available Funds</span>
                    <div className="flex items-center gap-3 text-3xl font-heading text-yellow-400">
                        <Coins size={28} />
                        {power.economy}
                    </div>
                </div>

                {error && (
                    <div className="mt-6 flex items-center justify-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-lg max-w-md mx-auto animate-shake">
                        <AlertOctagon size={18} />
                        <span className="text-sm font-mono uppercase">{error}</span>
                    </div>
                )}

                {success && (
                    <div className="mt-6 flex items-center justify-center gap-2 text-green-400 bg-green-500/10 p-3 rounded-lg max-w-md mx-auto animate-fade-in">
                        <ArrowUp size={18} />
                        <span className="text-sm font-mono uppercase">{success}</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <UpgradeCard
                    type="military"
                    icon={Shield}
                    currentVal={power.military}
                    color="text-red-500" // Red for Military
                    label="Military Defenses"
                />
                <UpgradeCard
                    type="infrastructure"
                    icon={Anchor}
                    currentVal={power.infrastructure}
                    color="text-cyan-400" // Cyan for Infra
                    label="Infrastructure"
                />
                <UpgradeCard
                    type="health"
                    icon={Activity}
                    currentVal={power.health}
                    color="text-emerald-400" // Green for Health
                    label="Public Health"
                />
            </div>
        </div>
    );
};

export default Shop;
