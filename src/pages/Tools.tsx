import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Calculator, FileText, Video, Building, Scale, ChevronRight } from "lucide-react";

const tools = [
    {
        title: "Court Fee Calculator",
        description: "Calculate court fees for civil suits based on the Himachal Pradesh Court Fees Act. Get instant fee calculations with comprehensive fee structure tables.",
        icon: Calculator,
        link: "/tools/court-fee-calculator",
        color: "bg-zinc-50 text-foreground border border-border"
    },
    {
        title: "Legal Drafts Library",
        description: "Download ready-made legal templates and documents. Access professionally drafted bail applications, agreements, petitions, notices, and more.",
        icon: FileText,
        link: "/tools/legal-drafts",
        color: "bg-zinc-100 text-foreground border border-border"
    },
    {
        title: "Court VC Links",
        description: "Find video conferencing links for courts across India. Search by judge name to quickly access virtual court hearings.",
        icon: Video,
        link: "/tools/court-vc-links",
        color: "bg-zinc-50 text-foreground border border-border"
    },
    {
        title: "Police Stations Directory",
        description: "Comprehensive directory of police stations with their jurisdictional courts. Essential information for legal proceedings and case filing.",
        icon: Building,
        link: "/tools/police-stations",
        color: "bg-zinc-100 text-foreground border border-border"
    }
];

const Tools = () => {
    return (
        <main>
            <Navbar />

            {/* Hero Section */}
            <section className="bg-surface-dark pt-36 pb-20 lg:pt-48 lg:pb-28">
                <div className="container mx-auto px-6 lg:px-12">
                    <ScrollReveal>
                        <p className="text-sans text-label uppercase text-surface-charcoal-foreground/50 mb-6 flex items-center gap-2">
                            <Scale size={16} /> Resources
                        </p>
                        <h1 className="text-serif text-display-sm font-bold text-white mb-8 select-none">
                            Legal Tools
                        </h1>
                        <p className="text-sans text-body-lg text-surface-charcoal-foreground/60 max-w-2xl">
                            Practical tools designed to help you prepare, estimate costs, and navigate your legal
                            proceedings with confidence. Access essential legal resources all in one place.
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Tools Grid */}
            <section className="bg-background py-16 lg:py-28">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {tools.map((tool, index) => (
                            <ScrollReveal key={tool.title} delay={index * 0.1}>
                                <Link to={tool.link}>
                                    <div className="bg-white border border-border p-10 hover:border-foreground transition-all duration-500 group h-full flex flex-col">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className={`p-4 ${tool.color} rounded-lg`}>
                                                <tool.icon size={28} />
                                            </div>
                                        </div>

                                        <h3 className="text-sans text-[20px] font-bold text-foreground mb-4 group-hover:text-accent transition-colors">
                                            {tool.title}
                                        </h3>

                                        <p className="text-sans text-sm text-muted-foreground leading-relaxed mb-6 flex-grow">
                                            {tool.description}
                                        </p>

                                        <div className="flex items-center gap-2 text-sans text-label uppercase text-foreground border-b border-foreground/30 pb-1 hover:border-foreground transition-colors inline-flex w-fit group-hover:gap-3 transition-all">
                                            Access Tool
                                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-surface-dark py-16 lg:py-28">
                <div className="container mx-auto px-6 lg:px-12">
                    <ScrollReveal>
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-serif text-display-sm font-bold text-surface-dark-foreground mb-6">
                                Need Legal Assistance?
                            </h2>
                            <p className="text-sans text-body text-surface-charcoal-foreground/60 leading-relaxed mb-10">
                                While these tools provide valuable resources, nothing replaces professional legal advice.
                                Contact us for personalized legal consultation.
                            </p>
                            <Link
                                to="/contact"
                                className="text-sans text-[10px] font-bold uppercase tracking-[0.11em] bg-surface-dark-foreground text-surface-dark px-10 py-3.5 rounded-full hover:bg-zinc-200 transition-all duration-500 inline-block"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default Tools;
