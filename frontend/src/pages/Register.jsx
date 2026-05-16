import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserCheck, ShieldCheck, MapPin, AlertCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'USER', address: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        const { name, email, password, address } = formData;
        if (name.length < 10 || name.length > 60) return "Name must be 20 to 60 characters.";
        if (address.length > 400) return "Address exceeds 400 character limit.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return "Invalid email format.";
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
        if (!passwordRegex.test(password)) return "Password must be 8-16 chars, with 1 uppercase and 1 special char.";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validate();
        if (validationError) return setError(validationError);
        setLoading(true);
        setError('');
        try {
            await API.post('/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full py-3.5 pl-11 pr-4 rounded-2xl text-sm font-medium transition-all duration-200 outline-none border focus:ring-2 focus:ring-violet-500/30 border-white/[0.08] focus:border-violet-500/40 placeholder:text-white/20";
    const inputStyle = { background: 'rgba(255,255,255,0.04)' };

    return (
        <div className="flex items-center justify-center min-h-[85vh] py-8">
            <div className="w-full max-w-xl">
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/60"
                    style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)' }}
                >
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

                    <div className="p-10">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-black tracking-tight text-white mb-2">
                                Create an account
                            </h1>
                            <p className="text-white/40 text-sm">Join the network and start rating stores</p>
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

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* Full Name */}
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Full Name <span className="text-white/20 normal-case tracking-normal">(10–60 chars)</span></label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 group-focus-within:text-violet-400 transition-colors duration-200" />
                                    <input type="text" required placeholder="Johnathan Michael Doe Smith"
                                        className={inputClass} style={inputStyle}
                                        value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 group-focus-within:text-violet-400 transition-colors duration-200" />
                                    <input type="email" required placeholder="you@example.com"
                                        className={inputClass} style={inputStyle}
                                        value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 group-focus-within:text-violet-400 transition-colors duration-200" />
                                    <input type="password" required placeholder="••••••••"
                                        className={inputClass} style={inputStyle}
                                        value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Address</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 group-focus-within:text-violet-400 transition-colors duration-200" />
                                    <input type="text" required placeholder="123 Street Name, City"
                                        className={inputClass} style={inputStyle}
                                        value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                                </div>
                            </div>

                            {/* Role selector */}
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Account Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: 'USER', ic: UserCheck, label: 'Regular User', desc: 'Browse & rate stores' },
                                        { id: 'OWNER', ic: ShieldCheck, label: 'Store Owner', desc: 'Manage your stores' }
                                    ].map(({ id, ic: IconComp, label, desc }) => (
                                        <div key={id} onClick={() => setFormData({ ...formData, role: id })}
                                            className={`relative p-4 rounded-2xl cursor-pointer transition-all duration-200 border-2 overflow-hidden group ${formData.role === id ? 'border-violet-500/60 shadow-lg shadow-violet-500/15' : 'border-white/[0.08] hover:border-white/20'}`}
                                            style={{ background: formData.role === id ? 'rgba(109,40,217,0.15)' : 'rgba(255,255,255,0.03)' }}>
                                            {formData.role === id && <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent pointer-events-none" />}
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-xl transition-colors duration-200 ${formData.role === id ? 'bg-violet-500/20 text-violet-400' : 'bg-white/5 text-white/30'}`}>
                                                    <IconComp className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className={`text-sm font-bold transition-colors duration-200 ${formData.role === id ? 'text-white' : 'text-white/50'}`}>{label}</div>
                                                    <div className="text-[10px] text-white/25 mt-0.5">{desc}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Submit */}
                            <button type="submit" disabled={loading}
                                className="md:col-span-2 w-full mt-1 py-3.5 rounded-2xl flex items-center justify-center gap-2.5 font-bold text-sm tracking-wide transition-all duration-200 disabled:opacity-50 cursor-pointer active:scale-[0.98] hover:shadow-xl hover:shadow-violet-500/25 border border-violet-500/40 hover:border-violet-400/60"
                                style={{ background: loading ? 'rgba(109,40,217,0.4)' : 'linear-gradient(135deg, rgba(109,40,217,0.8), rgba(79,70,229,0.7))' }}>
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                        </svg>
                                        Creating account...
                                    </span>
                                ) : (
                                    <>Create Account <ArrowRight className="w-4 h-4" /></>
                                )}
                            </button>
                        </form>

                        <p className="mt-7 text-center text-sm text-white/35">
                            Already have an account?{' '}
                            <Link to="/login" className="text-violet-400 font-semibold hover:text-violet-300 transition-colors duration-200 underline underline-offset-4 decoration-violet-500/30">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;