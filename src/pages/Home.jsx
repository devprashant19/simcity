import React from 'react';
import { Link } from 'react-router-dom';
import { Map } from 'lucide-react';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden px-4">
            {/* Decorative Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ochre/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="text-center relative z-10 animate-fade-in p-6 md:p-8 glass-panel rounded-3xl border-ochre/20 shadow-[0_0_50px_rgba(223,158,31,0.1)] w-full max-w-lg md:max-w-2xl">

                <div className="flex justify-center mb-6">
                    <Map size={48} className="text-ochre drop-shadow-[0_0_15px_rgba(223,158,31,0.8)] md:w-16 md:h-16" />
                </div>

                <h1 className="text-4xl md:text-8xl font-heading text-white mb-2 tracking-tighter uppercase leading-none text-glow">
                    SIM <span className="text-ochre">CITY</span>
                    <span className="block text-2xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/20 mt-2">2026</span>
                </h1>

                <div className="w-16 md:w-24 h-1 bg-ochre mx-auto my-6 md:my-8 rounded-full shadow-[0_0_10px_#df9e1f]"></div>

                <p className="text-sm md:text-lg text-white/60 font-mono uppercase tracking-widest mb-8 md:mb-12 max-w-md mx-auto">
                    Build. Defend. Conquer.<br />
                    The future belongs to the bold.
                </p>

                <Link
                    to="/login"
                    className="inline-block w-full md:w-auto px-8 py-4 md:px-12 md:py-5 bg-ochre hover:bg-ochre-light text-black text-lg md:text-xl font-heading uppercase tracking-widest transition-all rounded-xl shadow-[0_0_20px_rgba(223,158,31,0.4)] hover:shadow-[0_0_40px_rgba(223,158,31,0.6)] hover:-translate-y-1 active:scale-95 group"
                >
                    Choose Your Kingdom
                </Link>
            </div>

        </div>
    );
};

export default Home;
