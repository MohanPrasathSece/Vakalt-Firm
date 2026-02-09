import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from "sonner";
import {
    Inbox,
    Mail,
    Phone,
    User,
    Clock,
    CheckCircle2,
    XCircle,
    Loader2,
    Calendar,
    Briefcase
} from 'lucide-react';

interface Application {
    id: string;
    career_id: string;
    applicant_name: string;
    applicant_email: string;
    applicant_phone: string;
    cover_letter: string;
    status: string;
    created_at: string;
    career: {
        title: string;
        type: string;
    };
}

const Applications = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>("all");

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('career_applications')
            .select(`
                *,
                career:careers (title, type)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            toast.error("Failed to load applications");
            console.error(error);
        } else {
            setApplications(data || []);
        }
        setLoading(false);
    };

    const updateStatus = async (id: string, newStatus: string) => {
        const { error } = await supabase
            .from('career_applications')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            toast.error("Failed to update status");
        } else {
            toast.success(`Application marked as ${newStatus}`);
            fetchApplications();
        }
    };

    const filtered = applications.filter(app =>
        filterStatus === "all" || app.status === filterStatus
    );

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'reviewed': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'shortlisted': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'hired': return 'bg-green-50 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-black">Job Applications</h1>
                    <p className="text-gray-500 mt-1">Review and manage applications for job and internship postings.</p>
                </div>

                <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-full overflow-x-auto hide-scrollbar shrink-0">
                    {['all', 'pending', 'reviewed', 'shortlisted', 'hired', 'rejected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap ${filterStatus === status
                                ? "bg-white text-black shadow-sm"
                                : "text-gray-500 hover:text-black"
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-2xl p-20 text-center">
                        <Inbox className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-black">No applications found</h3>
                        <p className="text-gray-500">Applications for job postings will appear here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filtered.map((app) => (
                            <div key={app.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-6 md:p-8">
                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                        <div className="space-y-4 flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-xl font-bold text-black flex items-center gap-2">
                                                        {app.applicant_name}
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider ${getStatusStyles(app.status)}`}>
                                                            {app.status}
                                                        </span>
                                                    </h3>
                                                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Briefcase size={14} />
                                                            {app.career?.title}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={14} />
                                                            Applied on {new Date(app.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                                                <div className="flex items-center gap-3 text-sm">
                                                    <div className="p-2 bg-white rounded-lg border border-gray-200">
                                                        <Mail size={14} className="text-gray-400" />
                                                    </div>
                                                    <a href={`mailto:${app.applicant_email}`} className="text-black font-medium hover:underline">
                                                        {app.applicant_email}
                                                    </a>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm">
                                                    <div className="p-2 bg-white rounded-lg border border-gray-200">
                                                        <Phone size={14} className="text-gray-400" />
                                                    </div>
                                                    <span className="text-black font-medium">{app.applicant_phone}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Cover Letter / Message</h4>
                                                <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                                                    {app.cover_letter}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex md:flex-col gap-2 shrink-0">
                                            <button
                                                onClick={() => updateStatus(app.id, 'reviewed')}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 text-xs font-bold uppercase rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                <User size={14} /> Review
                                            </button>
                                            <button
                                                onClick={() => updateStatus(app.id, 'shortlisted')}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 text-xs font-bold uppercase rounded-lg hover:bg-purple-100 transition-colors"
                                            >
                                                <CheckCircle2 size={14} /> Shortlist
                                            </button>
                                            <button
                                                onClick={() => updateStatus(app.id, 'hired')}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 text-xs font-bold uppercase rounded-lg hover:bg-green-100 transition-colors"
                                            >
                                                <CheckCircle2 size={14} /> Hire
                                            </button>
                                            <button
                                                onClick={() => updateStatus(app.id, 'rejected')}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 text-xs font-bold uppercase rounded-lg hover:bg-red-100 transition-colors"
                                            >
                                                <XCircle size={14} /> Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default Applications;
