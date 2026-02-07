
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import {
    FileText,
    Plus,
    TrendingUp,
    Hash,
    Star,
    CheckCircle2,
    Clock,
    ArrowRight
} from 'lucide-react';

import { useQuery } from '@tanstack/react-query';

const Dashboard = () => {
    const navigate = useNavigate();

    const { data: stats = {
        totalPosts: 0,
        featuredPosts: 0,
        categories: 0,
        latestPosts: []
    }, isLoading: loading } = useQuery({
        queryKey: ['admin_dashboard_stats'],
        queryFn: async () => {
            const { data: posts, error } = await supabase
                .from('posts')
                .select('id, title, featured, category, created_at')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (posts) {
                const uniqueCategories = new Set(posts.map(p => p.category || 'Uncategorized')).size;
                const featuredCount = posts.filter(p => p.featured).length;
                return {
                    totalPosts: posts.length,
                    featuredPosts: featuredCount,
                    categories: uniqueCategories,
                    latestPosts: posts.slice(0, 5)
                };
            }
            return { totalPosts: 0, featuredPosts: 0, categories: 0, latestPosts: [] };
        }
    });

    const cards = [
        { label: 'Total Publications', value: stats.totalPosts, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Featured Insights', value: stats.featuredPosts, icon: Star, color: 'text-orange-500', bg: 'bg-orange-50' },
        { label: 'Content Categories', value: stats.categories, icon: Hash, color: 'text-purple-500', bg: 'bg-purple-50' },
    ];

    return (
        <AdminLayout>
            <div className="space-y-10 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-black">Insights Overview</h1>
                        <p className="text-gray-500 mt-1 text-sm font-medium">Synchronized metrics from the production database.</p>
                    </div>
                    <Button
                        onClick={() => navigate('/admin/posts/new')}
                        className="bg-black text-white hover:bg-gray-800 rounded-xl px-6 h-12 font-semibold shadow-lg shadow-black/10 gap-2 transition-all active:scale-95"
                    >
                        <Plus size={18} /> New Publication
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {cards.map((card, i) => (
                        <div key={i} className="bg-white border border-[#E5E7EB] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                            <div className={`p-3 ${card.bg} ${card.color} rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform`}>
                                <card.icon size={22} />
                            </div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{card.label}</p>
                            <p className="text-3xl font-black text-black mt-1 tracking-tight">{card.value}</p>
                            <div className="absolute -bottom-2 -right-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                <card.icon size={100} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-[#F3F4F6] flex items-center justify-between">
                            <h3 className="font-bold text-lg text-black">Recent Feed</h3>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-black font-bold uppercase text-[10px] tracking-widest" onClick={() => navigate('/admin/posts')}>View All</Button>
                        </div>
                        <div className="divide-y divide-[#F3F4F6]">
                            {loading ? (
                                <div className="p-10 text-center"><div className="w-6 h-6 border-2 border-gray-100 border-t-black rounded-full animate-spin mx-auto"></div></div>
                            ) : stats.latestPosts.length === 0 ? (
                                <div className="p-10 text-center text-gray-400 font-medium italic">No publications yet.</div>
                            ) : stats.latestPosts.map((post) => (
                                <div key={post.id} className="p-6 flex items-center justify-between hover:bg-[#F9FAFB] transition-colors group cursor-pointer" onClick={() => navigate(`/admin/posts/${post.id}`)}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                                            <TrendingUp size={18} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-black text-sm group-hover:text-blue-600 transition-colors">{post.title}</p>
                                            <p className="text-xs text-gray-400 font-medium">{post.category || 'Uncategorized'} • {new Date(post.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <ArrowRight size={16} className="text-gray-300 group-hover:translate-x-1 group-hover:text-black transition-all" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-black text-white rounded-3xl p-8 relative overflow-hidden shadow-2xl flex flex-col justify-between">
                        <div className="relative z-10">
                            <CheckCircle2 size={40} className="mb-6 opacity-30" />
                            <h3 className="text-2xl font-black leading-tight tracking-tight mb-4">You're synchronized with the production environment.</h3>
                            <p className="text-white/60 text-sm font-medium leading-relaxed">System latency is optimal. Blog updates will reflect instantly on the Live Insights page.</p>
                        </div>
                        <div className="relative z-10 pt-10">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-green-400">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                                System Active
                            </div>
                        </div>
                        <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
