import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Briefcase, GraduationCap, MapPin, Clock, Calendar, IndianRupee, ChevronRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const CareersPage = () => {
    const [careers, setCareers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<string>("all");
    const [selectedCareer, setSelectedCareer] = useState<any>(null);

    useEffect(() => {
        fetchCareers();
    }, []);

    const fetchCareers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('careers')
            .select('*')
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setCareers(data);
        }
        setLoading(false);
    };

    const filtered = careers.filter(career =>
        filterType === "all" || career.type === filterType
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <main>
            <Navbar />

            {/* Hero Section */}
            <section className="bg-slate-900 pt-32 pb-12 lg:pt-40 lg:pb-16 section-dark">
                <div className="container mx-auto px-6 lg:px-12">
                    <ScrollReveal>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h1 className="text-serif text-display-sm font-bold text-white mb-4">
                                    Career Opportunities
                                </h1>
                                <p className="text-sans text-sm text-slate-400 max-w-xl font-medium">
                                    Join our team of legal professionals. We are seeking talented individuals to help us redefine legal research and litigation support.
                                </p>
                            </div>
                            <div className="hidden md:block">
                                <p className="text-[10px] font-bold text-white uppercase tracking-widest bg-white/10 px-3 py-1 border border-white/20 rounded">
                                    {careers.length} Positions Available
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Filter Section */}
            <section className="bg-slate-50 py-6 sticky top-20 z-10 border-b border-border shadow-sm">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="flex gap-2 lg:gap-3 flex-wrap">
                        <button
                            onClick={() => setFilterType("all")}
                            className={`text-sans text-[11px] font-bold uppercase tracking-wider px-6 py-2 transition-all duration-300 rounded ${filterType === "all"
                                ? "bg-foreground text-background shadow-md"
                                : "bg-white text-muted-foreground border border-border hover:border-foreground"
                                }`}
                        >
                            All Positions
                        </button>
                        <button
                            onClick={() => setFilterType("job")}
                            className={`text-sans text-[11px] font-bold uppercase tracking-wider px-6 py-2 transition-all duration-300 rounded ${filterType === "job"
                                ? "bg-foreground text-background shadow-md"
                                : "bg-white text-muted-foreground border border-border hover:border-foreground"
                                }`}
                        >
                            Jobs
                        </button>
                        <button
                            onClick={() => setFilterType("internship")}
                            className={`text-sans text-[11px] font-bold uppercase tracking-wider px-6 py-2 transition-all duration-300 rounded ${filterType === "internship"
                                ? "bg-foreground text-background shadow-md"
                                : "bg-white text-muted-foreground border border-border hover:border-foreground"
                                }`}
                        >
                            Internships
                        </button>
                    </div>
                </div>
            </section>

            {/* Listings Section */}
            <section className="bg-white py-12 lg:py-20">
                <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 border-2 border-border border-t-foreground rounded-full animate-spin"></div>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-sans text-body text-muted-foreground">
                                No {filterType === "all" ? "" : filterType} positions available at the moment.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filtered.map((career, index) => (
                                <ScrollReveal key={career.id} delay={index * 0.05}>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <div
                                                onClick={() => setSelectedCareer(career)}
                                                className="bg-white border border-border p-5 lg:p-6 hover:border-foreground hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                                            >
                                                <div className="flex items-start gap-4 flex-1">
                                                    <div className={`p-2.5 rounded shrink-0 ${career.type === 'job' ? 'bg-slate-100' : 'bg-slate-50'}`}>
                                                        {career.type === 'job' ?
                                                            <Briefcase size={18} className="text-foreground" /> :
                                                            <GraduationCap size={18} className="text-foreground" />
                                                        }
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h3 className="text-sans text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                                                                {career.title}
                                                            </h3>
                                                            <span className="text-[9px] font-black uppercase tracking-tighter bg-foreground text-background px-1.5 py-0.5 rounded">
                                                                {career.employment_type}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                                            <div className="flex items-center gap-1.5">
                                                                <MapPin size={12} strokeWidth={3} />
                                                                <span className="font-bold">{career.location}</span>
                                                            </div>
                                                            {career.salary_range && (
                                                                <div className="flex items-center gap-1.5">
                                                                    <IndianRupee size={12} strokeWidth={3} />
                                                                    <span className="font-bold">{career.salary_range}</span>
                                                                </div>
                                                            )}
                                                            {career.type === 'internship' && (
                                                                <div className="flex items-center gap-1.5">
                                                                    <GraduationCap size={12} strokeWidth={3} />
                                                                    <span className="font-bold uppercase">Internship</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-border">
                                                    <div className="text-right hidden sm:block">
                                                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Post Date</p>
                                                        <p className="text-[11px] font-bold text-foreground">{formatDate(career.created_at)}</p>
                                                    </div>
                                                    <div className="h-8 w-px bg-border hidden md:block"></div>
                                                    <button className="text-sans text-[10px] font-black uppercase tracking-widest bg-slate-50 group-hover:bg-foreground group-hover:text-background px-6 py-3 border border-border group-hover:border-foreground transition-all flex items-center gap-2">
                                                        View & Apply
                                                        <ChevronRight size={12} strokeWidth={3} />
                                                    </button>
                                                </div>
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle className="text-serif text-subheading font-bold">
                                                    {career.title}
                                                </DialogTitle>
                                            </DialogHeader>

                                            <div className="space-y-6 pt-4">
                                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pb-6 border-b border-border">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={16} />
                                                        <span>{career.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={16} />
                                                        <span>{career.employment_type}</span>
                                                    </div>
                                                    {career.salary_range && (
                                                        <div className="flex items-center gap-2">
                                                            <IndianRupee size={16} />
                                                            <span>{career.salary_range}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <h4 className="text-sans text-body font-semibold mb-3">About the Role</h4>
                                                    <p className="text-sans text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                                                        {career.description}
                                                    </p>
                                                </div>

                                                {career.requirements && (
                                                    <div>
                                                        <h4 className="text-sans text-body font-semibold mb-3">Requirements</h4>
                                                        <div className="text-sans text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                                                            {career.requirements}
                                                        </div>
                                                    </div>
                                                )}

                                                {career.responsibilities && (
                                                    <div>
                                                        <h4 className="text-sans text-body font-semibold mb-3">Responsibilities</h4>
                                                        <div className="text-sans text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                                                            {career.responsibilities}
                                                        </div>
                                                    </div>
                                                )}

                                                {career.application_deadline && (
                                                    <div className="bg-surface-dark p-6">
                                                        <p className="text-sans text-sm text-surface-charcoal-foreground/60">
                                                            <strong>Application Deadline:</strong> {formatDate(career.application_deadline)}
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="pt-6 border-t border-border">
                                                    <h4 className="text-sans text-body font-semibold mb-6">Apply for this Position</h4>
                                                    <form
                                                        onSubmit={async (e) => {
                                                            e.preventDefault();
                                                            const formData = new FormData(e.currentTarget);
                                                            const applicationData = {
                                                                career_id: career.id,
                                                                applicant_name: formData.get('name') as string,
                                                                applicant_email: formData.get('email') as string,
                                                                applicant_phone: formData.get('phone') as string,
                                                                cover_letter: formData.get('message') as string,
                                                            };

                                                            const { error } = await supabase
                                                                .from('career_applications')
                                                                .insert([applicationData]);

                                                            if (error) {
                                                                alert("Error submitting application: " + error.message);
                                                            } else {
                                                                alert("Application submitted successfully!");
                                                                (e.target as HTMLFormElement).reset();
                                                            }
                                                        }}
                                                        className="space-y-4"
                                                    >
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <label className="text-xs uppercase font-semibold text-muted-foreground">Full Name</label>
                                                                <input
                                                                    required
                                                                    name="name"
                                                                    placeholder="John Doe"
                                                                    className="w-full bg-white border border-border p-3 text-sm focus:outline-none focus:border-foreground"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-xs uppercase font-semibold text-muted-foreground">Email Address</label>
                                                                <input
                                                                    required
                                                                    type="email"
                                                                    name="email"
                                                                    placeholder="john@example.com"
                                                                    className="w-full bg-white border border-border p-3 text-sm focus:outline-none focus:border-foreground"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs uppercase font-semibold text-muted-foreground">Phone Number</label>
                                                            <input
                                                                required
                                                                type="tel"
                                                                name="phone"
                                                                placeholder="+91 98765 43210"
                                                                className="w-full bg-white border border-border p-3 text-sm focus:outline-none focus:border-foreground"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs uppercase font-semibold text-muted-foreground">Cover Letter / Message</label>
                                                            <textarea
                                                                required
                                                                name="message"
                                                                rows={4}
                                                                placeholder="Tell us why you're a good fit..."
                                                                className="w-full bg-white border border-border p-3 text-sm focus:outline-none focus:border-foreground"
                                                            ></textarea>
                                                        </div>
                                                        <button
                                                            type="submit"
                                                            className="text-sans text-label uppercase tracking-[0.1em] bg-foreground text-background px-12 py-5 hover:bg-accent transition-all duration-500 inline-flex items-center gap-2 w-full justify-center"
                                                        >
                                                            <Mail size={18} />
                                                            Submit Application
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </ScrollReveal>
                            ))}
                        </div>
                    )}
                </div>
            </section>


            <Footer />
        </main>
    );
};

export default CareersPage;
