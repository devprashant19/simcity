import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setMessage('');
            setLoading(true);
            await signup(username, email, password);
            setMessage('Registration Successful. Verification email sent. Please check your inbox and verify before logging in.');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError('Failed to register: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)] animate-fade-in px-4">
            <div className="w-full max-w-md p-6 md:p-8 glass-panel rounded-2xl relative overflow-hidden">
                {/* Decorative Glow */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-ochre/20 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="mb-6 md:mb-10 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-heading text-white mb-2 uppercase tracking-tighter text-glow">Register</h2>
                    <p className="text-xs md:text-sm font-bold text-white/50 uppercase tracking-widest">Join Now</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-white font-bold text-xs md:text-sm flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0"></div>
                        <span>{error}</span>
                    </div>
                )}

                {message && (
                    <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-white font-bold text-xs md:text-sm text-center animate-pulse">
                        {message}
                    </div>
                )}

                {!message && (
                    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-ochre uppercase tracking-widest pl-1">
                                Alias
                            </label>
                            <input
                                type="text"
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 md:p-4 text-base md:text-lg text-white font-bold outline-none focus:border-ochre focus:bg-white/5 transition-all placeholder:text-white/20"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder="CHOOSE_NAME"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-ochre uppercase tracking-widest pl-1">
                                Email
                            </label>
                            <input
                                type="email"
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 md:p-4 text-base md:text-lg text-white font-bold outline-none focus:border-ochre focus:bg-white/5 transition-all placeholder:text-white/20"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="EMAIL_ADDRESS"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-ochre uppercase tracking-widest pl-1">
                                Passcode
                            </label>
                            <input
                                type="password"
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 md:p-4 text-base md:text-lg text-white font-bold outline-none focus:border-ochre focus:bg-white/5 transition-all placeholder:text-white/20"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 md:py-4 mt-2 bg-ochre hover:bg-ochre-light text-black text-base md:text-lg font-heading uppercase tracking-widest transition-all rounded-xl shadow-lg hover:shadow-ochre/20 active:scale-[0.98] disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Initialize'}
                        </button>
                    </form>
                )}

                <div className="mt-6 md:mt-8 text-center pt-6 border-t border-white/10 relative z-10">
                    <p className="text-xs md:text-sm font-medium text-white/40">
                        Already Citizen? <Link to="/login" className="text-ochre hover:text-white transition-colors ml-1 font-bold">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
