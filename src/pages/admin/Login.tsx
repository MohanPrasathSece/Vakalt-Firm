
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';

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
            toast.success("Welcome back, Mohan");
            navigate('/admin/dashboard');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6 font-sans">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                * { font-family: 'Inter', sans-serif !important; }
            `}</style>

            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white mx-auto shadow-2xl shadow-black/20 mb-6">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-black">VAKALT<span className="text-gray-300 font-light">.HUB</span></h1>
                    <p className="text-sm text-gray-400 font-medium">Authoritative Content Management</p>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Identity (Email)</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-black transition-colors" />
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="admin@vakalt.com"
                                        className="h-14 bg-gray-50 border-gray-100 focus:border-black rounded-xl pl-12 font-bold transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Secure Passkey</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-black transition-colors" />
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="h-14 bg-gray-50 border-gray-100 focus:border-black rounded-xl pl-12 font-bold transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-black text-white hover:bg-gray-800 rounded-xl font-bold text-lg group transition-all shadow-xl shadow-black/10 active:scale-95"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    Secure Entry
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}
                        </Button>
                    </form>
                </div>

                <div className="text-center pt-4">
                    <button
                        onClick={() => navigate('/')}
                        className="text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-black transition-colors"
                    >
                        ← Return to Live Site
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
