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
            <section className="bg-surface-dark pt-36 pb-20 lg:pt-48 lg:pb-28">
                <div className="container mx-auto px-6 lg:px-12">
                    <ScrollReveal>
                        <p className="text-sans text-label uppercase text-surface-charcoal-foreground/50 mb-6 flex items-center gap-2">
                            <Briefcase size={16} /> Join Our Team
                        </p>
                        <h1 className="text-serif text-display font-bold text-surface-dark-foreground mb-8">
                            Careers
                        </h1>
                        <p className="text-sans text-body-lg text-surface-charcoal-foreground/60 max-w-2xl">
                            Build your legal career with us. Explore opportunities to work on challenging cases
                            and grow alongside experienced professionals.
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Filter Section */}
            <section className="bg-background py-8 border-b border-border">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => setFilterType("all")}
                            className={`text-sans text-label uppercase tracking-[0.1em] px-8 py-3 transition-all duration-300 ${filterType === "all"
                                    ? "bg-foreground text-background"
                                    : "bg-transparent text-muted-foreground border border-border hover:border-foreground"
                                }`}
                        >
                            All Positions
                        </button>
                        <button
                            onClick={() => setFilterType("job")}
                            className={`text-sans text-label uppercase tracking-[0.1em] px-8 py-3 transition-all duration-300 ${filterType === "job"
                                    ? "bg-foreground text-background"
                                    : "bg-transparent text-muted-foreground border border-border hover:border-foreground"
                                }`}
                        >
                            Jobs
                        </button>
                        <button
                            onClick={() => setFilterType("internship")}
                            className={`text-sans text-label uppercase tracking-[0.1em] px-8 py-3 transition-all duration-300 ${filterType === "internship"
                                    ? "bg-foreground text-background"
                                    : "bg-transparent text-muted-foreground border border-border hover:border-foreground"
                                }`}
                        >
                            Internships
                        </button>
                    </div>
                </div>
            </section>

            {/* Listings Section */}
            <section className="bg-background py-16 lg:py-28">
                <div className="container mx-auto px-6 lg:px-12">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 border-2 border-border border-t-foreground rounded-full animate-spin"></div>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-sans text-body text-muted-foreground">
                                No {filterType === "all" ? "" : filterType} positions available at the moment.
                            </p>
                            <p className="text-sans text-sm text-muted-foreground/60 mt-2">
                                Check back soon for new opportunities.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {filtered.map((career, index) => (
                                <ScrollReveal key={career.id} delay={index * 0.1}>
                                    <div className="bg-white border border-border p-10 hover:border-foreground transition-all duration-500 group">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-3 ${career.type === 'job' ? 'bg-surface-dark' : 'bg-accent/10'}`}>
                                                    {career.type === 'job' ?
                                                        <Briefcase size={20} className="text-surface-dark-foreground" /> :
                                                        <GraduationCap size={20} className="text-accent" />
                                                    }
                                                </div>
                                                <div>
                                                    <span className="text-sans text-label uppercase text-muted-foreground text-xs">
                                                        {career.type === 'job' ? 'Job Opening' : 'Internship'}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-sans text-label uppercase text-xs bg-surface-dark text-surface-dark-foreground px-3 py-1">
                                                {career.employment_type}
                                            </span>
                                        </div>

                                        <h3 className="text-serif text-subheading font-semibold text-foreground mb-4 group-hover:text-accent transition-colors">
                                            {career.title}
                                        </h3>

                                        <p className="text-sans text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-2">
                                            {career.description}
                                        </p>

                                        <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} />
                                                <span className="text-sans">{career.location}</span>
                                            </div>
                                            {career.salary_range && (
                                                <div className="flex items-center gap-2">
                                                    <IndianRupee size={16} />
                                                    <span className="text-sans">{career.salary_range}</span>
                                                </div>
                                            )}
                                            {career.application_deadline && (
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} />
                                                    <span className="text-sans">Apply by {formatDate(career.application_deadline)}</span>
                                                </div>
                                            )}
                                        </div>

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button
                                                    onClick={() => setSelectedCareer(career)}
                                                    className="text-sans text-label uppercase text-foreground border-b border-foreground/30 pb-1 hover:border-foreground transition-colors inline-flex items-center gap-2 group"
                                                >
                                                    View Details
                                                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
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
                                                        <a
                                                            href={`mailto:contact@vakalt.com?subject=Application for ${career.title}&body=Dear Hiring Team,%0D%0A%0D%0AI am writing to express my interest in the ${career.title} position.%0D%0A%0D%0A`}
                                                            className="text-sans text-label uppercase tracking-[0.1em] bg-foreground text-background px-12 py-5 hover:bg-accent transition-all duration-500 inline-flex items-center gap-2"
                                                        >
                                                            <Mail size={18} />
                                                            Apply Now
                                                        </a>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-surface-dark py-16 lg:py-28">
                <div className="container mx-auto px-6 lg:px-12 text-center">
                    <ScrollReveal>
                        <h2 className="text-serif text-display-sm font-bold text-surface-dark-foreground mb-6">
                            Don't See a Fit?
                        </h2>
                        <p className="text-sans text-body text-surface-charcoal-foreground/60 max-w-2xl mx-auto mb-10">
                            We're always looking for talented individuals. Send us your resume and we'll keep
                            you in mind for future opportunities.
                        </p>
                        <a
                            href="mailto:contact@vakalt.com?subject=General Application"
                            className="text-sans text-label uppercase tracking-[0.1em] bg-surface-dark-foreground text-surface-dark px-12 py-5 hover:bg-accent hover:text-background transition-all duration-500 inline-block"
                        >
                            Send Resume
                        </a>
                    </ScrollReveal>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default CareersPage;
