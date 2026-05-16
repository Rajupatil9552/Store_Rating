import React, { useState } from 'react';
import API from '../services/api';
import { Lock, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Settings = () => {
    const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const { newPassword, confirmPassword } = passwords;
        if (newPassword !== confirmPassword) return "New passwords do not match.";
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
        if (!passwordRegex.test(newPassword)) return "Password must be 8-16 chars, with 1 uppercase and 1 special char.";
        return null;
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const validationError = validate();
        if (validationError) return setError(validationError);
        
        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            await API.put('/auth/password', { 
                oldPassword: passwords.oldPassword, 
                newPassword: passwords.newPassword 
            });
            setSuccess('Password updated successfully.');
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full py-4 px-5 pl-12 rounded-2xl text-sm font-semibold transition-all duration-300 outline-none border border-white/[0.08] focus:border-violet-500/50 bg-white/[0.02] hover:bg-white/[0.04] text-white placeholder:text-white/10 shadow-inner";

    return (
        <div className="max-w-xl mx-auto py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-[2.5rem] border border-white/[0.08] p-10 md:p-12"
                style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)' }}>
                
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                
                <div className="mb-10 text-center">
                    <div className="inline-flex p-3 rounded-2xl bg-violet-500/10 text-violet-400 mb-4">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight italic mb-2">Security Hub</h1>
                    <p className="text-white/30 text-sm font-medium">Provision a new cryptographic signature for your ID.</p>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold uppercase tracking-wide">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        </motion.div>
                    )}
                    {success && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
                            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold uppercase tracking-wide">
                                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                {success}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] ml-1">Current Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15 group-focus-within:text-violet-400 transition-colors" />
                            <input type="password" required className={inputClass} placeholder="••••••••"
                                value={passwords.oldPassword} onChange={e => setPasswords({...passwords, oldPassword: e.target.value})} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] ml-1">New Signature</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15 group-focus-within:text-violet-400 transition-colors" />
                            <input type="password" required className={inputClass} placeholder="New Password"
                                value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] ml-1">Confirm Signature</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15 group-focus-within:text-violet-400 transition-colors" />
                            <input type="password" required className={inputClass} placeholder="Repeat New Password"
                                value={passwords.confirmPassword} onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})} />
                        </div>
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full py-5 rounded-[1.5rem] bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-xs tracking-[0.3em] uppercase transition-all shadow-2xl shadow-violet-900/30 active:scale-[0.98] disabled:opacity-50 cursor-pointer">
                        {loading ? 'Encrypting...' : 'Update Password'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Settings;
