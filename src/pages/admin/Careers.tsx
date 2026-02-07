import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import {
    Search,
    Plus,
    Trash2,
    Edit3,
    Briefcase,
    GraduationCap,
    MapPin,
    Clock,
    Circle,
    MoreHorizontal
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Careers = () => {
    const [careers, setCareers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const navigate = useNavigate();

    useEffect(() => {
        fetchCareers();
    }, []);

    const fetchCareers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('careers')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            toast.error("Failed to load career postings");
        } else {
            setCareers(data || []);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this posting?")) return;

        const { error } = await supabase.from('careers').delete().eq('id', id);
        if (error) {
            toast.error("Error deleting posting");
        } else {
            toast.success("Posting deleted");
            fetchCareers();
        }
    };

    const handleStatusToggle = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'closed' : 'active';
        const { error } = await supabase
            .from('careers')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            toast.error("Error updating status");
        } else {
            toast.success(`Posting ${newStatus === 'active' ? 'activated' : 'closed'}`);
            fetchCareers();
        }
    };

    const filtered = careers.filter(career => {
        const matchesSearch = career.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === "all" || career.type === filterType;
        const matchesStatus = statusFilter === "all" || career.status === statusFilter;
        return matchesSearch && matchesType && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'text-green-600 bg-green-50';
            case 'pending': return 'text-orange-600 bg-orange-50';
            case 'closed': return 'text-gray-600 bg-gray-50';
            case 'draft': return 'text-yellow-600 bg-yellow-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-black">Career Postings</h1>
                        <p className="text-gray-500 mt-1">Manage job and internship opportunities.</p>
                    </div>
                    <Button
                        onClick={() => navigate('/admin/careers/new')}
                        className="bg-black text-white hover:bg-gray-800 rounded-xl px-6 h-12 font-semibold shadow-lg shadow-black/10 gap-2 transition-all active:scale-95"
                    >
                        <Plus size={18} /> New Posting
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex gap-2 p-1 bg-gray-100 rounded-xl overflow-x-auto max-w-full">
                        {['all', 'active', 'pending', 'closed'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all whitespace-nowrap ${statusFilter === status
                                        ? 'bg-white text-black shadow-sm'
                                        : 'text-gray-500 hover:text-black'
                                    }`}
                            >
                                {status} <span className="ml-1 opacity-50 text-xs">
                                    ({careers.filter(c => status === 'all' || c.status === status).length})
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="relative flex-1 group w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                        <Input
                            placeholder="Search postings..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border-gray-200 pl-11 h-12 rounded-xl focus:ring-1 focus:ring-black focus:border-black transition-all"
                        />
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm shadow-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[10px] tracking-widest">Position</th>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[10px] tracking-widest">Type</th>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[10px] tracking-widest">Location</th>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[10px] tracking-widest text-center">Status</th>
                                    <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[10px] tracking-widest">Posted</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center">
                                            <div className="w-6 h-6 border-2 border-gray-100 border-t-black rounded-full animate-spin mx-auto"></div>
                                        </td>
                                    </tr>
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center text-gray-400 font-medium italic">
                                            No career postings found.
                                        </td>
                                    </tr>
                                ) : filtered.map((career) => (
                                    <tr key={career.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${career.type === 'job' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                                    {career.type === 'job' ? <Briefcase size={16} /> : <GraduationCap size={16} />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-black">{career.title}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">{career.company_name || 'Vakalt'}</p>
                                                    <p className="text-xs text-gray-400">{career.employment_type}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${career.type === 'job' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                                                {career.type === 'job' ? 'Job' : 'Internship'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <MapPin size={14} />
                                                <span className="font-medium">{career.location}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <button
                                                onClick={() => handleStatusToggle(career.id, career.status)}
                                                className={`px-3 py-1 rounded-full text-xs font-bold transition-all hover:scale-105 ${getStatusColor(career.status)}`}
                                            >
                                                {career.status}
                                            </button>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-gray-500 text-xs">
                                                <Clock size={14} />
                                                {new Date(career.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {career.status === 'pending' && (
                                                    <Button
                                                        size="sm"
                                                        className="mr-2 h-9 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold"
                                                        onClick={() => handleStatusToggle(career.id, 'active')} // force to active
                                                    >
                                                        Approve
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="w-9 h-9 text-gray-400 hover:text-black hover:bg-white border hover:border-gray-200 rounded-lg transition-all"
                                                    onClick={() => navigate(`/admin/careers/${career.id}`)}
                                                >
                                                    <Edit3 size={14} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="w-9 h-9 text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border hover:border-red-100 rounded-lg transition-all"
                                                    onClick={() => handleDelete(career.id)}
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {!loading && filtered.length > 0 && (
                    <div className="text-center text-sm text-gray-400">
                        Showing {filtered.length} of {careers.length} posting{careers.length !== 1 ? 's' : ''}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default Careers;
