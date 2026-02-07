import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, Save, Briefcase } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const EditCareer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        type: 'job',
        company_name: '',
        location: '',
        employment_type: 'full-time',
        experience_level: 'mid',
        description: '',
        requirements: '',
        responsibilities: '',
        salary_range: '',
        application_deadline: '',
        status: 'active',
        contact_name: '',
        contact_email: '',
        contact_phone: ''
    });

    useEffect(() => {
        if (id) fetchCareer();
    }, [id]);

    const fetchCareer = async () => {
        const { data, error } = await supabase
            .from('careers')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            toast.error("Failed to load career posting");
            navigate('/admin/careers');
        } else if (data) {
            setFormData({
                ...data,
                application_deadline: data.application_deadline ?
                    new Date(data.application_deadline).toISOString().split('T')[0] : ''
            });
        }
    };

    const handleSave = async () => {
        if (!formData.title || !formData.description) {
            toast.error("Please fill in all required fields");
            return;
        }

        setSaving(true);

        const dataToSave = {
            ...formData,
            application_deadline: formData.application_deadline ?
                new Date(formData.application_deadline).toISOString() : null
        };

        let error;
        if (id) {
            const result = await supabase
                .from('careers')
                .update(dataToSave)
                .eq('id', id);
            error = result.error;
        } else {
            const result = await supabase
                .from('careers')
                .insert([dataToSave]);
            error = result.error;
        }

        if (error) {
            toast.error("Error saving posting");
        } else {
            toast.success(id ? "Posting updated" : "Posting created");
            navigate('/admin/careers');
        }
        setSaving(false);
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl space-y-10 pb-40 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate('/admin/careers')}
                            className="rounded-xl hover:bg-gray-100"
                        >
                            <ArrowLeft size={20} />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-black">
                                {id ? 'Edit Posting' : 'New Career Posting'}
                            </h1>
                            <p className="text-gray-500 mt-1">
                                {id ? 'Update posting details' : 'Create a new job or internship opportunity'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            className="font-bold text-gray-400 hover:text-black uppercase text-[10px] tracking-widest px-6"
                            onClick={() => navigate('/admin/careers')}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-black text-white hover:bg-gray-800 rounded-2xl h-12 px-8 font-bold shadow-xl shadow-black/10 gap-2 transition-all active:scale-95"
                        >
                            <Save size={18} />
                            {saving ? 'Saving...' : 'Save Posting'}
                        </Button>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Basic Information */}
                    <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm space-y-6">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                            <Briefcase size={18} />
                            <h3 className="font-bold text-black">Basic Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <Label className="text-sm font-bold mb-2 block">Position Title *</Label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Associate Lawyer"
                                    className="h-12 rounded-xl"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Label className="text-sm font-bold mb-2 block">Company / Firm Name</Label>
                                <Input
                                    value={formData.company_name}
                                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                    placeholder="e.g., Vakalt Legal"
                                    className="h-12 rounded-xl"
                                />
                            </div>

                            <div>
                                <Label className="text-sm font-bold mb-2 block">Type *</Label>
                                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                                    <SelectTrigger className="h-12 rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="job">Job</SelectItem>
                                        <SelectItem value="internship">Internship</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="text-sm font-bold mb-2 block">Employment Type *</Label>
                                <Select value={formData.employment_type} onValueChange={(value) => setFormData({ ...formData, employment_type: value })}>
                                    <SelectTrigger className="h-12 rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="full-time">Full-time</SelectItem>
                                        <SelectItem value="part-time">Part-time</SelectItem>
                                        <SelectItem value="contract">Contract</SelectItem>
                                        <SelectItem value="internship">Internship</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="text-sm font-bold mb-2 block">Location *</Label>
                                <Input
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="e.g., Delhi, India"
                                    className="h-12 rounded-xl"
                                />
                            </div>

                            <div>
                                <Label className="text-sm font-bold mb-2 block">Experience Level</Label>
                                <Select value={formData.experience_level} onValueChange={(value) => setFormData({ ...formData, experience_level: value })}>
                                    <SelectTrigger className="h-12 rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="entry">Entry Level</SelectItem>
                                        <SelectItem value="mid">Mid Level</SelectItem>
                                        <SelectItem value="senior">Senior Level</SelectItem>
                                        <SelectItem value="not-applicable">Not Applicable</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="text-sm font-bold mb-2 block">Salary Range (Optional)</Label>
                                <Input
                                    value={formData.salary_range}
                                    onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                                    placeholder="e.g., ₹5-7 LPA"
                                    className="h-12 rounded-xl"
                                />
                            </div>

                            <div>
                                <Label className="text-sm font-bold mb-2 block">Application Deadline (Optional)</Label>
                                <Input
                                    type="date"
                                    value={formData.application_deadline}
                                    onChange={(e) => setFormData({ ...formData, application_deadline: e.target.value })}
                                    className="h-12 rounded-xl"
                                />
                            </div>

                            <div>
                                <Label className="text-sm font-bold mb-2 block">Status *</Label>
                                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                                    <SelectTrigger className="h-12 rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Information */}
                    <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm space-y-6">
                        <h3 className="font-bold text-black border-b border-gray-100 pb-4">Detailed Information</h3>

                        <div className="space-y-6">
                            <div>
                                <Label className="text-sm font-bold mb-2 block">Description *</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief overview of the position..."
                                    className="min-h-[120px] rounded-xl"
                                />
                            </div>

                            <div>
                                <Label className="text-sm font-bold mb-2 block">Requirements</Label>
                                <Textarea
                                    value={formData.requirements}
                                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                    placeholder="List requirements (use bullet points with •)"
                                    className="min-h-[150px] rounded-xl font-mono text-sm"
                                />
                                <p className="text-xs text-gray-400 mt-2">Tip: Use bullet points (•) for better formatting</p>
                            </div>

                            <div>
                                <Label className="text-sm font-bold mb-2 block">Responsibilities</Label>
                                <Textarea
                                    value={formData.responsibilities}
                                    onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                                    placeholder="List key responsibilities (use bullet points with •)"
                                    className="min-h-[150px] rounded-xl font-mono text-sm"
                                />
                                <p className="text-xs text-gray-400 mt-2">Tip: Use bullet points (•) for better formatting</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm space-y-6">
                        <h3 className="font-bold text-black border-b border-gray-100 pb-4">Internal Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label className="text-sm font-bold mb-2 block">Contact Name</Label>
                                <Input
                                    value={formData.contact_name}
                                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                                    className="h-12 rounded-xl"
                                />
                            </div>
                            <div>
                                <Label className="text-sm font-bold mb-2 block">Contact Email</Label>
                                <Input
                                    value={formData.contact_email}
                                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                                    className="h-12 rounded-xl"
                                />
                            </div>
                            <div>
                                <Label className="text-sm font-bold mb-2 block">Contact Phone</Label>
                                <Input
                                    value={formData.contact_phone}
                                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                                    className="h-12 rounded-xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default EditCareer;
