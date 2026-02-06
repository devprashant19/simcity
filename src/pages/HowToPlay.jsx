import React from 'react';
import { BookOpen, Shield, Heart, Coins, Anchor, Sword, AlertTriangle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowToPlay = () => {
    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 animate-fade-in relative z-10">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-heading text-white uppercase tracking-tighter text-glow mb-4">
                    Field Manual
                </h1>
                <div className="w-32 h-1 bg-ochre mx-auto rounded-full mb-4"></div>
                <p className="text-white/60 font-mono uppercase tracking-widest text-sm md:text-base">
                    SimCity Kingdom Management • Protocol v1.0
                </p>
            </div>

            {/* Objective */}
            <section className="mb-12 glass-panel p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-ochre"></div>
                <h2 className="text-2xl font-heading text-white uppercase tracking-wider mb-4 flex items-center gap-3">
                    <BookOpen className="text-ochre" />
                    Core Objective
                </h2>
                <p className="text-white/80 leading-relaxed font-body text-lg">
                    Lead your chosen faction to prosperity by managing four key resources while competing against other players globally. Your success is measured by your survival time, resource management skills, and leaderboard ranking.
                </p>
            </section>

            {/* Mechanics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Auth */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                    <h3 className="text-xl font-heading text-white uppercase mb-4 flex items-center gap-2">
                        <span className="text-green-500">01.</span> Entry
                    </h3>
                    <ul className="space-y-3 text-white/70 text-sm font-mono list-disc pl-4">
                        <li>Register with email.</li>
                        <li><strong className="text-white">Verify email</strong> (Check Spam).</li>
                        <li>Log in to access the Question Portal.</li>
                    </ul>
                </div>

                {/* Questions */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                    <h3 className="text-xl font-heading text-white uppercase mb-4 flex items-center gap-2">
                        <span className="text-ochre">02.</span> Decisions
                    </h3>
                    <p className="text-white/70 text-sm mb-4">
                        MCQ & Input Challenges affect your stats.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-2 text-yellow-400"><Coins size={14} /> Economy</div>
                        <div className="flex items-center gap-2 text-red-500"><Shield size={14} /> Military</div>
                        <div className="flex items-center gap-2 text-green-500"><Heart size={14} /> Health</div>
                        <div className="flex items-center gap-2 text-cyan-400"><Anchor size={14} /> Infra</div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-red-400 bg-red-500/10 p-2 rounded">
                        <AlertTriangle size={14} />
                        Avoid 0 in any stat!
                    </div>
                </div>
            </div>

            {/* Timers & War */}
            <section className="mb-12">
                <h2 className="text-2xl font-heading text-white uppercase tracking-wider mb-6 text-center">System Mechanics</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Timer */}
                    <div className="bg-black/40 border border-white/10 p-6 rounded-xl text-center">
                        <Clock size={32} className="mx-auto text-blue-400 mb-4" />
                        <h4 className="font-heading text-white uppercase mb-2">Cool-down</h4>
                        <p className="text-white/50 text-sm">2 Minutes wait time after every decision or riddle.</p>
                    </div>

                    {/* War */}
                    <div className="bg-black/40 border border-white/10 p-6 rounded-xl text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors"></div>
                        <Sword size={32} className="mx-auto text-red-500 mb-4" />
                        <h4 className="font-heading text-white uppercase mb-2">War Zone</h4>
                        <ul className="text-white/50 text-sm space-y-1">
                            <li>Opens daily by Admin</li>
                            <li>Max <strong className="text-white">5 Attacks</strong> / day</li>
                            <li>Loot resources from rivals</li>
                        </ul>
                    </div>

                    {/* Aid */}
                    <div className="bg-black/40 border border-white/10 p-6 rounded-xl text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors"></div>
                        <Heart size={32} className="mx-auto text-green-500 mb-4" />
                        <h4 className="font-heading text-white uppercase mb-2">Aid Network</h4>
                        <ul className="text-white/50 text-sm space-y-1">
                            <li>Help allies under attack</li>
                            <li>Max <strong className="text-white">5 Packages</strong> / day</li>
                            <li>Restore their Economy</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Faction Guide */}
            <section className="border-t border-white/10 pt-12">
                <h2 className="text-2xl font-heading text-white uppercase tracking-wider mb-8 text-center">Faction Strategy</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-emerald-900/20 border border-emerald-500/30">
                        <h4 className="text-emerald-400 font-heading uppercase text-lg mb-2">🧝 Elves</h4>
                        <p className="text-white/60 text-xs leading-relaxed">Focus on <strong>Health</strong> & <strong>Infrastructure</strong>. Nature protects, but Economy is fragile.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-orange-900/20 border border-orange-500/30">
                        <h4 className="text-orange-400 font-heading uppercase text-lg mb-2">⚒️ Dwarfs</h4>
                        <p className="text-white/60 text-xs leading-relaxed">Masters of <strong>Military</strong> & <strong>Infrastructure</strong>. Mining risks Health hazards.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-purple-900/20 border border-purple-500/30">
                        <h4 className="text-purple-400 font-heading uppercase text-lg mb-2">🥷 Ninja</h4>
                        <p className="text-white/60 text-xs leading-relaxed">Balance <strong>Military</strong> & <strong>Economy</strong>. High risk, high reward stealth operations.</p>
                    </div>
                </div>
            </section>

            <div className="mt-12 text-center">
                <Link to="/" className="inline-block px-8 py-3 bg-ochre hover:bg-ochre-light text-black font-bold rounded-lg font-heading uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(223,158,31,0.4)]">
                    Enter Simulation
                </Link>
            </div>
        </div>
    );
};

export default HowToPlay;
