import React from 'react';
import { 
    BookOpen, Shield, Heart, Coins, Anchor, Sword, AlertTriangle, Clock,
    Users, Trophy, Store, Target, Settings, Zap, ShieldAlert, Building2,
    Users2, ScrollText, Swords, Crown, Gem, Mail, LogIn
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HowToPlay = () => {
    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 animate-fade-in relative z-10">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-block p-3 bg-ochre/20 rounded-full mb-4">
                    <Crown className="text-ochre" size={32} />
                </div>
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
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                    <Building2 size={128} className="text-white" />
                </div>
                <h2 className="text-2xl font-heading text-white uppercase tracking-wider mb-4 flex items-center gap-3">
                    <BookOpen className="text-ochre" />
                    Core Objective
                </h2>
                <p className="text-white/80 leading-relaxed font-body text-lg mb-4">
                    Lead your chosen faction to prosperity by managing four key resources while competing against other players globally. Your success is measured by your survival time, resource management skills, and leaderboard ranking.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {[
                        { icon: Trophy, label: "Global Rankings", color: "text-yellow-400" },
                        { icon: Target, label: "Survival Time", color: "text-blue-400" },
                        { icon: Gem, label: "Resource Mastery", color: "text-purple-400" },
                        { icon: Swords, label: "PvP Victory", color: "text-red-400" }
                    ].map((item, idx) => (
                        <div key={idx} className="text-center">
                            <item.icon className={`${item.color} mx-auto mb-2`} size={24} />
                            <span className="text-white/70 text-xs font-mono">{item.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Authentication & Entry Section */}
            <section className="mb-12">
                <h2 className="text-2xl font-heading text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Mail className="text-green-500" size={24} />
                    Entry Protocol
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                        <div className="absolute -right-6 -top-6 opacity-10">
                            <LogIn size={80} className="text-green-500" />
                        </div>
                        <h3 className="text-xl font-heading text-white uppercase mb-4 flex items-center gap-2">
                            <span className="text-green-500">01.</span> Registration
                        </h3>
                        <ul className="space-y-3 text-white/70 text-sm font-mono">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">•</span>
                                <span>Register with college <strong className="text-white">email address</strong></span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">•</span>
                                <span><strong className="text-white">Verify email</strong> - Check spam folder</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">•</span>
                                <span><strong className="text-white">Secure authentication</strong> - Password encryption</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">•</span>
                                <span>Access <strong className="text-white">Question Portal</strong> after login</span>
                            </li>
                        </ul>
                    </div>
                    
                    <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-blue-500/5 to-transparent">
                        <h3 className="text-xl font-heading text-white uppercase mb-4 flex items-center gap-2">
                            <span className="text-blue-400">02.</span> First Steps
                        </h3>
                        <div className="space-y-4">
                            <p className="text-white/70 text-sm">
                                Upon entering the simulation, you'll need to:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {['Choose Faction', 'Name Your City', 'Initial Stats', 'Tutorial'].map((step, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/70">
                                        {step}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Decision Making & Resources */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Questions/Decisions */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-ochre/30 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-heading text-white uppercase flex items-center gap-2">
                            <span className="text-ochre">03.</span> Decisions
                        </h3>
                        <ScrollText className="text-ochre/50 group-hover:text-ochre transition-colors" size={20} />
                    </div>
                    <p className="text-white/70 text-sm mb-4">
                        MCQ & Input Challenges affect your kingdom's vital stats. Every choice matters!
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-xs font-bold uppercase tracking-wider mb-4">
                        <div className="flex items-center gap-2 p-2 bg-yellow-400/10 rounded border border-yellow-400/20">
                            <Coins size={14} className="text-yellow-400" /> 
                            <span className="text-yellow-400">Economy</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-red-400/10 rounded border border-red-400/20">
                            <Shield size={14} className="text-red-400" /> 
                            <span className="text-red-400">Military</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-green-400/10 rounded border border-green-400/20">
                            <Heart size={14} className="text-green-400" /> 
                            <span className="text-green-400">Health</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-cyan-400/10 rounded border border-cyan-400/20">
                            <Anchor size={14} className="text-cyan-400" /> 
                            <span className="text-cyan-400">Infra</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-red-400 bg-red-500/10 p-3 rounded border border-red-500/20">
                        <AlertTriangle size={14} className="flex-shrink-0" />
                        <span className="font-mono">Critical: Any stat reaching 0 results in <strong>KINGDOM COLLAPSE</strong></span>
                    </div>
                </div>

                {/* City Building */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-blue-400/30 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-heading text-white uppercase flex items-center gap-2">
                            <span className="text-blue-400">04.</span> Development
                        </h3>
                        <Building2 className="text-blue-400/50 group-hover:text-blue-400 transition-colors" size={20} />
                    </div>
                    <p className="text-white/70 text-sm mb-4">
                        Build and upgrade your city infrastructure. Expand your kingdom's capabilities.
                    </p>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-white/60">Economy Level</span>
                            <span className="text-yellow-400 font-mono">🏭 Production Rate</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-white/60">Infrastructure Level</span>
                            <span className="text-cyan-400 font-mono">🏛️ Building Capacity</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-white/60">Military Level</span>
                            <span className="text-red-400 font-mono">⚔️ Attack Power</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Mechanics - Enhanced */}
            <section className="mb-12">
                <h2 className="text-2xl font-heading text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Settings className="text-purple-400" size={24} />
                    System Mechanics
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Timer */}
                    <div className="bg-black/40 border border-white/10 p-5 rounded-xl text-center hover:border-blue-400/30 transition-all">
                        <Clock size={28} className="mx-auto text-blue-400 mb-3" />
                        <h4 className="font-heading text-white uppercase mb-1 text-sm">Cool-down</h4>
                        <p className="text-white/50 text-xs">1 minute between decisions</p>
                        <span className="text-blue-400/50 text-[10px] uppercase mt-2 block">Strategic Planning</span>
                    </div>

                    {/* War */}
                    <div className="bg-black/40 border border-white/10 p-5 rounded-xl text-center hover:border-red-400/30 transition-all relative overflow-hidden group">
                        <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors"></div>
                        <Sword size={28} className="mx-auto text-red-500 mb-3" />
                        <h4 className="font-heading text-white uppercase mb-1 text-sm">War Zone</h4>
                        <p className="text-white/50 text-xs">5 Attacks / day</p>
                        <span className="text-red-400/50 text-[10px] uppercase mt-2 block">Loot Resources</span>
                    </div>

                    {/* Aid */}
                    <div className="bg-black/40 border border-white/10 p-5 rounded-xl text-center hover:border-green-400/30 transition-all relative overflow-hidden group">
                        <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors"></div>
                        <Heart size={28} className="mx-auto text-green-500 mb-3" />
                        <h4 className="font-heading text-white uppercase mb-1 text-sm">Aid Network</h4>
                        <p className="text-white/50 text-xs">5 Packages / day</p>
                        <span className="text-green-400/50 text-[10px] uppercase mt-2 block">Restore Economy</span>
                    </div>

                    {/* Shop */}
                    <div className="bg-black/40 border border-white/10 p-5 rounded-xl text-center hover:border-yellow-400/30 transition-all">
                        <Store size={28} className="mx-auto text-yellow-400 mb-3" />
                        <h4 className="font-heading text-white uppercase mb-1 text-sm">Merchant Guild</h4>
                        <p className="text-white/50 text-xs">Buy upgrades & items</p>
                        <span className="text-yellow-400/50 text-[10px] uppercase mt-2 block">Boost Progress</span>
                    </div>
                </div>
            </section>

            {/* War State Control */}
            <section className="mb-12 p-6 bg-gradient-to-r from-red-950/20 to-orange-950/20 rounded-2xl border border-red-500/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMCwwLDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <ShieldAlert className="text-red-500" size={28} />
                        <h3 className="text-xl font-heading text-white uppercase">Global War State</h3>
                    </div>
                    <p className="text-white/80 text-sm mb-4">
                        Admin-controlled war state determines when battles can occur. Stay alert for war declarations!
                    </p>
                    <div className="flex gap-3">
                        <span className="px-3 py-1 bg-red-500/20 border border-red-500/40 rounded-full text-xs text-red-400 font-mono">
                            ⚔️ War Active
                        </span>
                        <span className="px-3 py-1 bg-green-500/20 border border-green-500/40 rounded-full text-xs text-green-400 font-mono">
                            🕊️ Peace Treaty
                        </span>
                    </div>
                </div>
            </section>

            {/* Faction Strategy - Enhanced */}
            <section className="border-t border-white/10 pt-12 mb-12">
                <h2 className="text-2xl font-heading text-white uppercase tracking-wider mb-8 text-center flex items-center justify-center gap-2">
                    <Users2 className="text-ochre" />
                    Faction Strategy Guide
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 rounded-lg bg-gradient-to-br from-emerald-900/30 to-emerald-900/10 border border-emerald-500/30 hover:border-emerald-500/60 transition-all group">
                        <h4 className="text-emerald-400 font-heading uppercase text-lg mb-3 flex items-center gap-2">
                            <span className="text-2xl">🧝</span> Elves
                        </h4>
                        <p className="text-white/60 text-xs leading-relaxed mb-3">
                            Focus on <strong className="text-emerald-400">Health</strong> & <strong className="text-emerald-400">Infrastructure</strong>. 
                            Nature protects, but Economy is fragile.
                        </p>
                        <div className="flex gap-1 mt-2">
                            <span className="px-2 py-1 bg-emerald-500/20 rounded text-[10px] text-emerald-400">+Healing</span>
                            <span className="px-2 py-1 bg-emerald-500/20 rounded text-[10px] text-emerald-400">+Defense</span>
                        </div>
                    </div>
                    <div className="p-5 rounded-lg bg-gradient-to-br from-orange-900/30 to-orange-900/10 border border-orange-500/30 hover:border-orange-500/60 transition-all group">
                        <h4 className="text-orange-400 font-heading uppercase text-lg mb-3 flex items-center gap-2">
                            <span className="text-2xl">⚒️</span> Dwarfs
                        </h4>
                        <p className="text-white/60 text-xs leading-relaxed mb-3">
                            Masters of <strong className="text-orange-400">Military</strong> & <strong className="text-orange-400">Infrastructure</strong>. 
                            Mining risks Health hazards.
                        </p>
                        <div className="flex gap-1 mt-2">
                            <span className="px-2 py-1 bg-orange-500/20 rounded text-[10px] text-orange-400">+Production</span>
                            <span className="px-2 py-1 bg-orange-500/20 rounded text-[10px] text-orange-400">+Combat</span>
                        </div>
                    </div>
                    <div className="p-5 rounded-lg bg-gradient-to-br from-purple-900/30 to-purple-900/10 border border-purple-500/30 hover:border-purple-500/60 transition-all group">
                        <h4 className="text-purple-400 font-heading uppercase text-lg mb-3 flex items-center gap-2">
                            <span className="text-2xl">🥷</span> Ninja
                        </h4>
                        <p className="text-white/60 text-xs leading-relaxed mb-3">
                            Balance <strong className="text-purple-400">Military</strong> & <strong className="text-purple-400">Economy</strong>. 
                            High risk, high reward stealth operations.
                        </p>
                        <div className="flex gap-1 mt-2">
                            <span className="px-2 py-1 bg-purple-500/20 rounded text-[10px] text-purple-400">+Stealth</span>
                            <span className="px-2 py-1 bg-purple-500/20 rounded text-[10px] text-purple-400">+Crit</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Leaderboard & Progress */}
            <section className="mb-12 p-6 glass-panel rounded-2xl border border-white/5">
                <div className="flex items-center gap-3 mb-6">
                    <Trophy className="text-yellow-400" size={28} />
                    <h3 className="text-xl font-heading text-white uppercase">Real-Time Rankings</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-bold">
                            1
                        </div>
                        <div>
                            <p className="text-white text-sm font-bold">Top Commander</p>
                            <p className="text-white/40 text-[10px]">Global Leader</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-bold">
                            2
                        </div>
                        <div>
                            <p className="text-white text-sm font-bold">Elite Strategist</p>
                            <p className="text-white/40 text-[10px]">Faction Leader</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-white font-bold">
                            3
                        </div>
                        <div>
                            <p className="text-white text-sm font-bold">War Hero</p>
                            <p className="text-white/40 text-[10px]">Rising Star</p>
                        </div>
                    </div>
                </div>
                <p className="text-white/50 text-xs mt-4 text-center font-mono">
                    Leaderboards update in real-time • Compete for glory • Earn exclusive rewards
                </p>
            </section>

            {/* CTA */}
            <div className="mt-12 text-center relative">
                <div className="absolute inset-0 bg-ochre/20 blur-3xl rounded-full"></div>
                <Link 
                    to="/" 
                    className="relative inline-block px-10 py-4 bg-ochre hover:bg-ochre-light text-black font-bold rounded-lg font-heading uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(223,158,31,0.6)] hover:scale-105 group"
                >
                    <span className="flex items-center gap-2">
                        <Zap size={20} className="group-hover:animate-pulse" />
                        Enter Simulation
                        <Zap size={20} className="group-hover:animate-pulse" />
                    </span>
                </Link>
                <p className="text-white/40 text-xs mt-4 font-mono">
                    Protocol v1.0 • Ready for deployment • Join thousands of commanders
                </p>
            </div>
        </div>
    );
};

export default HowToPlay;