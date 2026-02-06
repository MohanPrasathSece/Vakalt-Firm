
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Lock, Mail, ArrowRight, Home } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Identity Verified: Welcome to Command Center");
            navigate('/admin/dashboard');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 font-sans">
            <div className="absolute top-10 left-10">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/')}
                    className="text-gray-400 hover:text-black gap-2 transition-all group font-bold"
                >
                    <Home size={18} />
                    Exit Workspace
                </Button>
            </div>

            <div className="w-full max-w-md space-y-10">
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-black text-white mb-4 shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
                        <ShieldCheck size={48} />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-5xl font-black tracking-tighter text-black">VAKALT<span className="text-gray-200 font-light">.ADMIN</span></h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Restricted Access Portal</p>
                    </div>
                </div>

                <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-[0_30px_100px_rgba(0,0,0,0.05)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-black to-transparent opacity-10"></div>

                    <form onSubmit={handleLogin} className="space-y-10">
                        <div className="space-y-6">
                            <div className="space-y-3 group/field">
                                <Label className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] pl-1">Authorized Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within/field:text-black transition-colors" />
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="admin@vakalt.com"
                                        className="h-16 bg-gray-50 border-gray-100 focus:border-black focus:ring-1 focus:ring-black text-black pl-14 rounded-2xl transition-all font-bold placeholder:text-gray-200"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 group/field">
                                <Label className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] pl-1">Passkey</Label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within/field:text-black transition-colors" />
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="h-16 bg-gray-50 border-gray-100 focus:border-black focus:ring-1 focus:ring-black text-black pl-14 rounded-2xl transition-all font-bold placeholder:text-gray-200"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 bg-black text-white hover:bg-gray-800 rounded-2xl font-black text-xl group transition-all shadow-2xl shadow-black/20"
                        >
                            {loading ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    <span>Verifying Creds...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    Establish Link
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}
                        </Button>
                    </form>
                </div>

                <div className="text-center pt-8">
                    <p className="text-[9px] text-gray-300 uppercase tracking-[0.5em] font-black leading-relaxed">
                        Secure Neural Link • 2026 Vakalt HQ<br />
                        <span className="opacity-40 font-medium">All sessions are encrypted and logged</span>
                    </p>
                </div>
            </div>

            {/* Design accents */}
            <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
        </div>
    );
};

export default Login;
