import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext'; // Import context
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Map, User, Trophy, Sword, LogOut, Coins, Shield, Activity, Anchor, Heart, BookOpen, Home } from 'lucide-react';

const Layout = ({ children }) => {
    const { currentUser, mongoUser, logout } = useAuth();
    const { power, faction } = useGame(); // Get faction from context
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    // Mobile Detection
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Dynamic Background Logic
    const getBackgroundImage = () => {
        const suffix = isMobile ? '_mob.jpeg' : '.jpeg';
        let base = 'home'; // Default to home

        if (faction) {
            // Handle "Dwarfs" vs "Dwarves" if needed, assuming simple lowercase for now
            base = faction.toLowerCase();
        }

        return `url("/${base}${suffix}")`;
    };

    const StatusBarItem = ({ icon: Icon, value, color, label }) => (
        <div className="flex flex-col items-center justify-center min-w-[80px] md:min-w-[100px] flex-1 border-r border-white/5 last:border-0 hover:bg-white/5 transition-colors duration-300 py-2">
            <span className="text-[9px] md:text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-1">{label}</span>
            <div className="flex items-center gap-2 md:gap-3">
                <Icon size={16} className={`${color} opacity-80 md:w-5 md:h-5`} />
                <span className={`text-2xl md:text-3xl font-heading font-black tracking-tight text-white drop-shadow-md`}>
                    {value}
                </span>
            </div>
        </div>
    );

    const isHomePage = location.pathname === '/';

    return (
        <div className="min-h-screen font-body selection:bg-ochre selection:text-black flex flex-col relative overflow-hidden">
            {/* Global Background Layer */}
            <div
                className="fixed inset-0 z-[-1] bg-cover bg-center transition-all duration-1000"
                style={{ backgroundImage: getBackgroundImage() }}
            >
                {/* Overlay to ensure text readability over bright images */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
            </div>

            {/* Top Navigation - HIDDEN ON HOME */}
            {!isHomePage && (
                <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 h-16 flex items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-3">
                        <Map size={20} className="text-ochre text-glow" />
                        <h2 className="text-lg font-heading tracking-tighter text-white uppercase leading-none hidden md:block">
                            SIMCITY<span className="text-ochre">2026</span>
                        </h2>
                        <h2 className="text-lg font-heading tracking-tighter text-white uppercase leading-none md:hidden">
                            SimCity<span className="text-ochre">2026</span>
                        </h2>

                        {mongoUser && (
                            <div className="hidden lg:block px-3 py-1 ml-4 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-white/60 uppercase tracking-widest">
                                {mongoUser.username}
                            </div>
                        )}
                    </div>

                    {currentUser && mongoUser ? (
                        <div className="flex items-center gap-4">
                            {/* Action Limits Display (Mobile & Desktop) */}
                            {location.pathname === '/attack' && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-lg animate-fade-in">
                                    <Sword size={14} className="text-red-500" />
                                    <span className="text-xs font-mono text-red-100 uppercase tracking-wider">
                                        <span className="hidden md:inline">Attacks: </span>
                                        <span className="text-white font-bold">{mongoUser.attacksLeft ?? 0}</span>
                                    </span>
                                </div>
                            )}
                            {location.pathname === '/help' && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-lg animate-fade-in">
                                    <Heart size={14} className="text-green-500" />
                                    <span className="text-xs font-mono text-green-100 uppercase tracking-wider">
                                        <span className="hidden md:inline">Aid: </span>
                                        <span className="text-white font-bold">{mongoUser.helpLeft ?? 0}</span>
                                    </span>
                                </div>
                            )}

                            {/* Rules Link (Moved here, Top Right) */}
                            <Link to="/rules" className={`flex items-center gap-2 px-3 py-1 ${location.pathname === '/rules' ? 'bg-ochre/20 border-ochre/40 text-ochre' : 'bg-white/5 border-white/5 text-blue-400'} hover:bg-white/10 rounded-full transition-all group border`}>
                                <BookOpen size={16} />
                                <span className="text-[10px] font-mono uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">
                                    HOW TO PLAY
                                </span>
                            </Link>

                            {/* Desktop-only Quick Links */}
                            <div className="hidden lg:flex items-center gap-2">
                                <Link to="/game" className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all group ${location.pathname === '/game' ? 'bg-green-500/20 border-green-500/40 text-green-500' : 'bg-white/5 border-white/5 text-white/40 hover:bg-green-500/10 hover:text-green-500'}`}>
                                    <Home size={16} />
                                </Link>
                                <Link to="/attack" className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all group ${location.pathname === '/attack' ? 'bg-red-500/20 border-red-500/40 text-red-500' : 'bg-white/5 border-white/5 text-white/40 hover:bg-red-500/10 hover:text-red-500'}`}>
                                    <Sword size={16} />
                                </Link>
                                <Link to="/help" className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all group ${location.pathname === '/help' ? 'bg-green-500/20 border-green-500/40 text-green-500' : 'bg-white/5 border-white/5 text-white/40 hover:bg-green-500/10 hover:text-green-500'}`}>
                                    <Heart size={16} />
                                </Link>
                                <Link to="/leaderboard" className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all group ${location.pathname === '/leaderboard' ? 'bg-ochre/20 border-ochre/40 text-ochre' : 'bg-white/5 border-white/5 text-white/40 hover:bg-ochre/10 hover:text-ochre'}`}>
                                    <Trophy size={16} />
                                </Link>
                                <Link to="/shop" className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all group ${location.pathname === '/shop' ? 'bg-yellow-400/20 border-yellow-400/40 text-yellow-400' : 'bg-white/5 border-white/5 text-white/40 hover:bg-yellow-400/10 hover:text-yellow-400'}`}>
                                    <Coins size={16} />
                                </Link>
                            </div>

                            {/* Desktop Links (Removed as per request) */}
                            <div className="hidden md:flex items-center gap-1">
                                <div className="h-6 w-px bg-white/10 mx-2"></div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                    title="Log Out"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-xs font-mono text-white/40 uppercase tracking-widest">
                            System_Offline
                        </div>
                    )}
                </nav>
            )}

            {/* Dedicated Status Bar (Below Nav) - HIDDEN ON HOME */}
            {!isHomePage && currentUser && mongoUser && (
                <div className="fixed top-16 left-0 right-0 z-40 bg-black/60 backdrop-blur-md border-b border-white/10 shadow-lg animate-fade-in">
                    <div className="max-w-7xl mx-auto flex justify-between items-center px-2 md:px-4 overflow-x-auto no-scrollbar">
                        <StatusBarItem icon={Coins} value={power.economy} color="text-yellow-400" label="Economy" />
                        <StatusBarItem icon={Shield} value={power.military} color="text-red-500" label="Defense" />
                        <StatusBarItem icon={Activity} value={power.health} color="text-emerald-400" label="Health" />
                        <StatusBarItem icon={Anchor} value={power.infrastructure} color="text-cyan-400" label="Infrastructure" />
                    </div>
                </div>
            )}

            {/* MAIN CONTENT */}
            <main className={`flex-1 px-4 max-w-7xl mx-auto relative z-10 w-full animate-fade-in transition-all ${isHomePage ? 'pt-0' : (currentUser && mongoUser ? 'pt-40 md:pt-44' : 'pt-24')} pb-24 md:pb-12`}>
                {children}
            </main>

            {/* BOTTOM NAVIGATION (Mobile Only) */}
            {!isHomePage && currentUser && mongoUser && (
                <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-white/10 pb-safe">
                    <div className="flex justify-around items-center p-2">
                        <Link to="/game" className={`flex flex-col items-center p-2 rounded-lg transition-all ${location.pathname === '/game' ? 'text-ochre' : 'text-white/40'}`}>
                            <User size={20} />
                            <span className="text-[10px] uppercase font-bold mt-1 tracking-wider">Base</span>
                        </Link>
                        <Link to="/attack" className={`flex flex-col items-center p-2 rounded-lg transition-all ${location.pathname === '/attack' ? 'text-red-500' : 'text-white/40'}`}>
                            <Sword size={20} />
                            <span className="text-[10px] uppercase font-bold mt-1 tracking-wider">Atk</span>
                        </Link>
                        <Link to="/help" className={`flex flex-col items-center p-2 rounded-lg transition-all ${location.pathname === '/help' ? 'text-green-500' : 'text-white/40'}`}>
                            <Heart size={20} />
                            <span className="text-[10px] uppercase font-bold mt-1 tracking-wider">Aid</span>
                        </Link>
                        <Link to="/leaderboard" className={`flex flex-col items-center p-2 rounded-lg transition-all ${location.pathname === '/leaderboard' ? 'text-ochre' : 'text-white/40'}`}>
                            <Trophy size={20} />
                            <span className="text-[10px] uppercase font-bold mt-1 tracking-wider">Rank</span>
                        </Link>
                        <Link to="/shop" className={`flex flex-col items-center p-2 rounded-lg transition-all ${location.pathname === '/shop' ? 'text-yellow-400' : 'text-white/40'}`}>
                            <Coins size={20} />
                            <span className="text-[10px] uppercase font-bold mt-1 tracking-wider">Shop</span>
                        </Link>
                        <button onClick={handleLogout} className="flex flex-col items-center p-2 text-white/40 rounded-lg">
                            <LogOut size={20} />
                            <span className="text-[10px] uppercase font-bold mt-1 tracking-wider">Exit</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Layout;
