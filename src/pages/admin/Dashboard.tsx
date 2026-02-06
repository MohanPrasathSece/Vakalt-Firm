
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminStatCard from '@/components/admin/AdminStatCard';
import {
    FileText,
    Users,
    TrendingUp,
    Plus,
    ArrowRight,
    Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalPosts: 0,
        featuredPosts: 0,
        categories: 0,
        recentPosts: [] as any[]
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            // PERFORMANCE OPTIMIZATION: Only fetch metadata for dashboard stats
            const { data: posts, error } = await supabase
                .from('posts')
                .select('id, title, category, featured, created_at, excerpt')
                .order('created_at', { ascending: false });

            if (posts) {
                const uniqueCategories = new Set(posts.map(p => p.category || 'Uncategorized')).size;
                const featuredCount = posts.filter(p => p.featured).length;

                setStats({
                    totalPosts: posts.length,
                    featuredPosts: featuredCount,
                    categories: uniqueCategories,
                    recentPosts: posts.slice(0, 5)
                });
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8 font-sans">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-black mb-1">Workspace</h1>
                        <p className="text-gray-500 font-medium">Real-time content performance and management.</p>
                    </div>
                    <Button
                        onClick={() => navigate('/admin/posts/new')}
                        className="bg-black text-white hover:bg-gray-800 rounded-xl h-14 px-8 font-bold gap-2 shadow-xl shadow-black/10 transition-all active:scale-95"
                    >
                        <Plus size={20} />
                        New Publication
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AdminStatCard
                        title="Database Articles"
                        value={stats.totalPosts}
                        icon={FileText}
                    />
                    <AdminStatCard
                        title="Pinned Stories"
                        value={stats.featuredPosts}
                        icon={TrendingUp}
                    />
                    <AdminStatCard
                        title="Unique Categories"
                        value={stats.categories}
                        icon={Users}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Posts Table */}
                    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Clock size={18} className="text-gray-400" />
                                Latest Live Posts
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate('/admin/posts')}
                                className="text-gray-500 hover:text-black font-bold group"
                            >
                                View all <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-gray-50">
                                        <th className="px-8 py-5">Article Overview</th>
                                        <th className="px-8 py-5 text-center">Section</th>
                                        <th className="px-8 py-5 text-right">Published</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {stats.recentPosts.map((post) => (
                                        <tr
                                            key={post.id}
                                            className="hover:bg-gray-50/80 transition-colors cursor-pointer group"
                                            onClick={() => navigate(`/admin/posts/${post.id}`)}
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900 mb-1 group-hover:text-black transition-colors">{post.title}</span>
                                                    <span className="text-xs text-gray-400 truncate max-w-[300px]">{post.excerpt || 'No excerpt provided.'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex justify-center">
                                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                        {post.category || 'Uncategorized'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right text-sm text-gray-400 font-mono">
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                    {stats.recentPosts.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan={3} className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center gap-3 opacity-20">
                                                    <FileText size={48} />
                                                    <span className="font-bold">No posts found in database.</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="space-y-6">
                        <div className="bg-black text-white p-8 rounded-3xl relative overflow-hidden group shadow-2xl shadow-black/20">
                            <div className="relative z-10">
                                <h4 className="text-2xl font-black mb-3 italic">Fast Access</h4>
                                <p className="text-white/60 text-sm mb-8 leading-relaxed font-medium">
                                    Your insights page automatically refreshes whenever you publish here.
                                </p>
                                <Button
                                    onClick={() => window.open('/insights', '_blank')}
                                    className="w-full bg-white text-black hover:bg-gray-100 font-bold rounded-xl h-12"
                                >
                                    Live Site Preview
                                </Button>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                                <TrendingUp size={160} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
