import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await API.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.user.role);
            localStorage.setItem('name', data.user.name);
            if (data.user.role === 'ADMIN') navigate('/admin');
            else if (data.user.role === 'OWNER') navigate('/owner');
            else if (data.user.role === 'USER') navigate('/stores');
            else navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[75vh]">
            <div className="w-full max-w-md">

                {/* Card */}
                <motion.div
                    initial={{ opacity: 0, y: 32, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/60"
                    style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)' }}
                >
                    {/* Top accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

                    <div className="p-10">
                        {/* Header */}
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 border border-violet-500/30 shadow-xl shadow-violet-500/20"
                                style={{ background: 'linear-gradient(135deg, rgba(109,40,217,0.4), rgba(79,70,229,0.2))' }}>
                                <Zap className="w-6 h-6 text-violet-300" />
                            </div>
                            <h1 className="text-3xl font-black tracking-tight text-white mb-2">
                                Welcome back
                            </h1>
                            <p className="text-white/40 text-sm">Sign in to your account to continue</p>
                        </div>

                        {/* Error */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                    exit={{ opacity: 0, y: -8, height: 0 }}
                                    className="overflow-hidden mb-6"
                                >
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl flex items-center gap-3">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        <span className="text-sm font-medium">{error}</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 group-focus-within:text-violet-400 transition-colors duration-200" />
                                    <input
                                        type="email" required placeholder="you@example.com"
                                        className="w-full py-3.5 pl-11 pr-4 rounded-2xl text-sm font-medium transition-all duration-200 outline-none border focus:ring-2 focus:ring-violet-500/30 border-white/[0.08] focus:border-violet-500/40 placeholder:text-white/20"
                                        style={{ background: 'rgba(255,255,255,0.04)' }}
                                        value={email} onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 group-focus-within:text-violet-400 transition-colors duration-200" />
                                    <input
                                        type="password" required placeholder="••••••••"
                                        className="w-full py-3.5 pl-11 pr-4 rounded-2xl text-sm font-medium transition-all duration-200 outline-none border focus:ring-2 focus:ring-violet-500/30 border-white/[0.08] focus:border-violet-500/40 placeholder:text-white/20"
                                        style={{ background: 'rgba(255,255,255,0.04)' }}
                                        value={password} onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 py-3.5 rounded-2xl flex items-center justify-center gap-2.5 font-bold text-sm tracking-wide transition-all duration-200 disabled:opacity-50 cursor-pointer active:scale-[0.98] hover:shadow-xl hover:shadow-violet-500/25 border border-violet-500/40 hover:border-violet-400/60"
                                style={{ background: loading ? 'rgba(109,40,217,0.4)' : 'linear-gradient(135deg, rgba(109,40,217,0.8), rgba(79,70,229,0.7))' }}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                        </svg>
                                        Authenticating...
                                    </span>
                                ) : (
                                    <>Sign In <ArrowRight className="w-4 h-4" /></>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
                            <p className="text-sm text-white/35">
                                No account yet?{' '}
                                <Link to="/register" className="text-violet-400 font-semibold hover:text-violet-300 transition-colors duration-200 underline underline-offset-4 decoration-violet-500/30">
                                    Create one
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;