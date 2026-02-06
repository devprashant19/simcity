import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { useNavigate } from 'react-router-dom';
import { Sword, Anchor, Zap } from 'lucide-react';

const FactionSelect = () => {
    const { selectFaction } = useGame();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSelect = async (faction) => {
        setLoading(true);
        await selectFaction(faction);
        setLoading(false);
        navigate('/game');
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
                <div className="text-2xl font-heading animate-pulse tracking-widest uppercase text-ochre">
                    Initiating_Sequence...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black z-[-1]"></div>

            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-heading text-white uppercase tracking-tighter text-glow mb-4">
                    Choose Your Allegiance
                </h1>
                <p className="text-white/50 font-mono tracking-widest text-sm uppercase">
                    One choice defines your destiny
                </p>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-ochre to-transparent mx-auto mt-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">

                {/* Ninja Faction */}
                <button
                    onClick={() => handleSelect('Ninja')}
                    className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-500 hover:-translate-y-2 flex flex-col items-center text-center overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border border-purple-500/30">
                        <Zap size={40} className="text-purple-400" />
                    </div>

                    <h2 className="text-3xl font-heading text-white mb-4 group-hover:text-purple-400 transition-colors">Ninja</h2>
                    <p className="text-sm text-white/60 leading-relaxed font-body">
                        Masters of stealth and espionage. Prioritize intelligence and swift strikes.
                    </p>

                    <div className="mt-8 py-2 px-6 rounded-full border border-purple-500/30 text-purple-400 text-xs font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                        Select_Class
                    </div>
                </button>

                {/* Dwarfs Faction */}
                <button
                    onClick={() => handleSelect('Dwarfs')}
                    className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all duration-500 hover:-translate-y-2 flex flex-col items-center text-center overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/5 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border border-orange-500/30">
                        <Anchor size={40} className="text-orange-400" />
                    </div>

                    <h2 className="text-3xl font-heading text-white mb-4 group-hover:text-orange-400 transition-colors">Dwarfs</h2>
                    <p className="text-sm text-white/60 leading-relaxed font-body">
                        Builders of impregnable fortresses. Masters of industry and resilience.
                    </p>

                    <div className="mt-8 py-2 px-6 rounded-full border border-orange-500/30 text-orange-400 text-xs font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                        Select_Class
                    </div>
                </button>

                {/* Elves Faction */}
                <button
                    onClick={() => handleSelect('Elves')}
                    className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-green-500/50 hover:bg-green-500/10 transition-all duration-500 hover:-translate-y-2 flex flex-col items-center text-center overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border border-green-500/30">
                        <Sword size={40} className="text-green-400" />
                    </div>

                    <h2 className="text-3xl font-heading text-white mb-4 group-hover:text-green-400 transition-colors">Elves</h2>
                    <p className="text-sm text-white/60 leading-relaxed font-body">
                        Guardians of ancient wisdom. Skilled in diplomacy and ranged warfare.
                    </p>

                    <div className="mt-8 py-2 px-6 rounded-full border border-green-500/30 text-green-400 text-xs font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                        Select_Class
                    </div>
                </button>
            </div>
        </div>
    );
};

export default FactionSelect;
