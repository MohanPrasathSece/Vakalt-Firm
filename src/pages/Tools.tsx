import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const courtTypes = [
    { label: "District Court", multiplier: 1 },
    { label: "High Court", multiplier: 2.5 },
    { label: "Supreme Court", multiplier: 5 },
];

const caseTypes = [
    { label: "Civil Suit", baseFee: 500 },
    { label: "Criminal Appeal", baseFee: 300 },
    { label: "Writ Petition", baseFee: 400 },
    { label: "Motor Accident Claim", baseFee: 200 },
    { label: "Family Matter", baseFee: 350 },
];

const Tools = () => {
    const [selectedCourt, setSelectedCourt] = useState(0);
    const [selectedCase, setSelectedCase] = useState(0);
    const [claimAmount, setClaimAmount] = useState("");

    const calculateFee = () => {
        const amount = parseFloat(claimAmount) || 0;
        let fee = 0;

        if (amount <= 50000) {
            fee = amount * 0.03;
        } else if (amount <= 300000) {
            fee = (50000 * 0.03) + (amount - 50000) * 0.04;
        } else {
            fee = (50000 * 0.03) + (250000 * 0.04) + (amount - 300000) * 0.06;
        }

        return Math.round(fee);
    };

    const fee = calculateFee();

    return (
        <main>
            <Navbar />

            {/* Hero */}
            <section className="bg-surface-offwhite pt-36 pb-20 lg:pt-48 lg:pb-28">
                <div className="container mx-auto px-6 lg:px-12">
                    <ScrollReveal>
                        <p className="text-sans text-label uppercase text-muted-foreground mb-6">Resources</p>
                        <h1 className="text-serif text-display font-bold text-foreground mb-8">
                            Legal Tools
                        </h1>
                        <p className="text-sans text-body-lg text-muted-foreground max-w-xl">
                            Practical tools designed to help you prepare, estimate costs, and navigate your legal proceedings with confidence.
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Calculator */}
            <section className="bg-background py-16 lg:py-28">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                        <div className="lg:col-span-7">
                            <ScrollReveal>
                                <h2 className="text-serif text-display-sm font-bold text-foreground mb-3">
                                    Court Fee Calculator
                                </h2>
                                <p className="text-sans text-body text-muted-foreground mb-14">
                                    Estimate court fees based on jurisdiction, case type, and claim amount.
                                </p>
                            </ScrollReveal>

                            <div className="space-y-12">
                                <ScrollReveal delay={0.1}>
                                    <label className="text-sans text-label uppercase text-muted-foreground mb-5 block">Court Type</label>
                                    <div className="flex flex-wrap gap-3">
                                        {courtTypes.map((court, i) => (
                                            <button
                                                key={court.label}
                                                onClick={() => setSelectedCourt(i)}
                                                className={`text-sans text-body px-7 py-3.5 border transition-all duration-300 ${selectedCourt === i
                                                    ? "bg-foreground text-background border-foreground"
                                                    : "bg-transparent text-foreground border-border hover:border-foreground"
                                                    }`}
                                            >
                                                {court.label}
                                            </button>
                                        ))}
                                    </div>
                                </ScrollReveal>

                                <ScrollReveal delay={0.15}>
                                    <label className="text-sans text-label uppercase text-muted-foreground mb-5 block">Case Type</label>
                                    <div className="flex flex-wrap gap-3">
                                        {caseTypes.map((caseType, i) => (
                                            <button
                                                key={caseType.label}
                                                onClick={() => setSelectedCase(i)}
                                                className={`text-sans text-body px-7 py-3.5 border transition-all duration-300 ${selectedCase === i
                                                    ? "bg-foreground text-background border-foreground"
                                                    : "bg-transparent text-foreground border-border hover:border-foreground"
                                                    }`}
                                            >
                                                {caseType.label}
                                            </button>
                                        ))}
                                    </div>
                                </ScrollReveal>

                                <ScrollReveal delay={0.2}>
                                    <label className="text-sans text-label uppercase text-muted-foreground mb-5 block">Claim Amount (₹)</label>
                                    <input
                                        type="number"
                                        value={claimAmount}
                                        onChange={(e) => setClaimAmount(e.target.value)}
                                        placeholder="Enter claim amount"
                                        className="w-full max-w-md bg-transparent border-b-2 border-border pb-4 text-sans text-body-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-colors"
                                    />
                                </ScrollReveal>
                            </div>
                        </div>

                        {/* Result */}
                        <div className="lg:col-span-5">
                            <ScrollReveal delay={0.25}>
                                <div className="bg-surface-dark p-10 lg:p-14 sticky top-32">
                                    <p className="text-sans text-label uppercase text-surface-charcoal-foreground/50 mb-4">Estimated Court Fee</p>
                                    <p className="text-serif text-display font-bold text-surface-dark-foreground mb-6">
                                        ₹{fee.toLocaleString("en-IN")}
                                    </p>
                                    <div className="border-t border-surface-charcoal-foreground/10 pt-6 space-y-3">
                                        <div className="flex justify-between text-sans text-body">
                                            <span className="text-surface-charcoal-foreground/50">Court</span>
                                            <span className="text-surface-dark-foreground">{courtTypes[selectedCourt].label}</span>
                                        </div>
                                        <div className="flex justify-between text-sans text-body">
                                            <span className="text-surface-charcoal-foreground/50">Case</span>
                                            <span className="text-surface-dark-foreground">{caseTypes[selectedCase].label}</span>
                                        </div>
                                        {claimAmount && (
                                            <div className="flex justify-between text-sans text-body">
                                                <span className="text-surface-charcoal-foreground/50">Claim</span>
                                                <span className="text-surface-dark-foreground">₹{parseFloat(claimAmount).toLocaleString("en-IN")}</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sans text-sm text-surface-charcoal-foreground/30 mt-8">
                                        Estimate only. Actual fees may vary by jurisdiction and circumstances.
                                    </p>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
};

export default Tools;
