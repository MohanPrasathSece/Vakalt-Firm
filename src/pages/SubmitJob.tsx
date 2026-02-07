
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Briefcase, Building2, MapPin, Mail, Phone, Calendar, IndianRupee, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const SubmitJob = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        type: "job",
        company_name: "", // Assuming this column exists or will be added
        location: "",
        employment_type: "full-time",
        experience_level: "mid",
        description: "",
        requirements: "",
        responsibilities: "",
        salary_range: "",
        application_deadline: "",
        contact_name: "", // New field
        contact_email: "", // New field
        contact_phone: "", // New field
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const { error } = await supabase.from("careers").insert([
                {
                    title: formData.title,
                    type: formData.type,
                    // company_name: formData.company_name, // If schema allows
                    location: formData.location,
                    employment_type: formData.employment_type,
                    experience_level: formData.experience_level,
                    description: formData.description + (formData.company_name ? `\n\nCompany: ${formData.company_name}` : ""), // Fallback if no column
                    requirements: formData.requirements,
                    responsibilities: formData.responsibilities,
                    salary_range: formData.salary_range,
                    application_deadline: formData.application_deadline ? new Date(formData.application_deadline).toISOString() : null,
                    // contact_name: formData.contact_name, // If schema allows
                    // contact_email: formData.contact_email, // If schema allows
                    // contact_phone: formData.contact_phone, // If schema allows
                    status: "pending", // Pending approval
                },
            ]);

            if (error) throw error;

            toast.success("Job submitted successfully! It is now pending admin approval.");
            navigate("/careers");
        } catch (error: any) {
            console.error("Error submitting job:", error);
            toast.error("Failed to submit job. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <main className="bg-background min-h-screen">
            <Navbar />

            <section className="pt-32 pb-12 lg:pt-40 lg:pb-16 bg-surface-dark">
                <div className="container mx-auto px-6 lg:px-12 text-center">
                    <ScrollReveal>
                        <h1 className="text-serif text-display-sm font-bold text-surface-dark-foreground mb-4">
                            Post a Job
                        </h1>
                        <p className="text-sans text-body text-surface-charcoal-foreground/60 max-w-2xl mx-auto">
                            Find the best legal talent. Submit your job opening for review, and we'll publish it to our network of professionals.
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            <section className="py-12 lg:py-20">
                <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
                    <ScrollReveal delay={0.1}>
                        <form onSubmit={handleSubmit} className="space-y-10 bg-white p-8 lg:p-12 rounded-3xl border border-border shadow-sm">

                            {/* Job Details */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
                                    <Briefcase className="w-5 h-5 text-foreground" />
                                    <h3 className="text-serif text-subheading font-bold text-foreground">Job Details</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Job Title *</Label>
                                        <Input
                                            required
                                            placeholder="e.g. Senior Associate"
                                            value={formData.title}
                                            onChange={(e) => handleChange("title", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Company / Firm Name *</Label>
                                        <Input
                                            required
                                            placeholder="e.g. Vakalt Legal"
                                            value={formData.company_name}
                                            onChange={(e) => handleChange("company_name", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Type</Label>
                                        <Select value={formData.type} onValueChange={(val) => handleChange("type", val)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="job">Job</SelectItem>
                                                <SelectItem value="internship">Internship</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Employment Type</Label>
                                        <Select value={formData.employment_type} onValueChange={(val) => handleChange("employment_type", val)}>
                                            <SelectTrigger>
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
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Location *</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                className="pl-9"
                                                required
                                                placeholder="City, State"
                                                value={formData.location}
                                                onChange={(e) => handleChange("location", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Salary Range (Optional)</Label>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                className="pl-9"
                                                placeholder="e.g. ₹6-8 LPA"
                                                value={formData.salary_range}
                                                onChange={(e) => handleChange("salary_range", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Description *</Label>
                                    <Textarea
                                        required
                                        placeholder="Describe the role..."
                                        rows={5}
                                        value={formData.description}
                                        onChange={(e) => handleChange("description", e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Requirements</Label>
                                    <Textarea
                                        placeholder="• LLB Degree&#10;• 2+ years experience"
                                        rows={4}
                                        value={formData.requirements}
                                        onChange={(e) => handleChange("requirements", e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Responsibilities</Label>
                                    <Textarea
                                        placeholder="• Draft legal documents&#10;• Client consultation"
                                        rows={4}
                                        value={formData.responsibilities}
                                        onChange={(e) => handleChange("responsibilities", e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Application Deadline *</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            type="date"
                                            className="pl-9"
                                            required
                                            value={formData.application_deadline}
                                            onChange={(e) => handleChange("application_deadline", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-6 pt-6 border-t border-border">
                                <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
                                    <Building2 className="w-5 h-5 text-foreground" />
                                    <h3 className="text-serif text-subheading font-bold text-foreground">Contact Information (Private)</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">These details are for our admin team to verify your posting and will not be displayed publically unless you included them in the description.</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Contact Name *</Label>
                                        <Input
                                            required
                                            placeholder="Your Name"
                                            value={formData.contact_name}
                                            onChange={(e) => handleChange("contact_name", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email *</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                type="email"
                                                className="pl-9"
                                                required
                                                placeholder="you@company.com"
                                                value={formData.contact_email}
                                                onChange={(e) => handleChange("contact_email", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Phone </Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                className="pl-9"
                                                placeholder="+91..."
                                                value={formData.contact_phone}
                                                onChange={(e) => handleChange("contact_phone", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="pt-6">
                                <Button
                                    type="submit"
                                    className="mx-auto flex w-auto min-w-[240px] bg-foreground text-background hover:bg-zinc-800 h-12 text-sm font-bold uppercase tracking-widest rounded-full"
                                    disabled={submitting}
                                >
                                    {submitting ? "Submitting..." : "Submit for Approval"}
                                </Button>
                                <p className="text-center text-xs text-muted-foreground mt-4">
                                    By submitting, you agree to our terms. All listings are subject to approval.
                                </p>
                            </div>

                        </form>
                    </ScrollReveal>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default SubmitJob;
