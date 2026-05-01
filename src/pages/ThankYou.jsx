import React from 'react';
import { Link } from 'react-router-dom';

const ThankYou = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in relative z-10 px-4">
            <div className="w-full max-w-2xl glass-panel p-6 md:p-12 text-center rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-ochre to-transparent opacity-50"></div>
                
                <h1 className="text-3xl md:text-5xl font-heading text-ochre mb-4 uppercase tracking-tighter text-glow drop-shadow-md">
                    Thank You
                </h1>
                
                <p className="text-base md:text-xl font-body text-white/90 mb-8 leading-relaxed">
                    Your contribution has been recorded.
                </p>

                <Link to="/" className="inline-flex items-center justify-center px-6 py-3 bg-white/10 hover:bg-ochre border border-white/10 hover:border-ochre text-white hover:text-black rounded-lg transition-all font-heading uppercase tracking-wider text-sm">
                    Return to Base
                </Link>
            </div>
        </div>
    );
};

export default ThankYou;
