import { useState } from 'react';
import { Calculator, IndianRupee, FileText, Scale } from 'lucide-react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Court Fee Calculation Logic based on Himachal Pradesh Court Fees Act
const calculateCourtFee = (amount: number): number => {
    if (amount <= 0) return 0;

    // Based on THE FIRST SCHEDULE - Ad valorem fees
    if (amount <= 5) return 1;
    if (amount <= 100) return Math.ceil((amount - 5) / 5);

    let fee = 19; // Fee up to 100

    if (amount <= 500) {
        fee += Math.ceil((amount - 100) / 10);
        return fee;
    }

    fee = 59; // Fee up to 500

    if (amount <= 1000) {
        fee += Math.ceil((amount - 500) / 10) * 2;
        return fee;
    }

    fee = 159; // Fee up to 1000

    if (amount <= 5000) {
        fee += Math.ceil((amount - 1000) / 100) * 15;
        return fee;
    }

    fee = 759; // Fee up to 5000

    if (amount <= 10000) {
        fee += Math.ceil((amount - 5000) / 250) * 25;
        return fee;
    }

    fee = 1259; // Fee up to 10000

    if (amount <= 20000) {
        fee += Math.ceil((amount - 10000) / 500) * 40;
        return fee;
    }

    fee = 2059; // Fee up to 20000

    if (amount <= 30000) {
        fee += Math.ceil((amount - 20000) / 1000) * 50;
        return fee;
    }

    fee = 2559; // Fee up to 30000

    if (amount <= 50000) {
        fee += Math.ceil((amount - 30000) / 2000) * 50;
        return fee;
    }

    fee = 3059; // Fee up to 50000

    // Above 50000
    fee += Math.ceil((amount - 50000) / 5000) * 50;

    return fee;
};

const CourtFeeCalculator = () => {
    const [caseType, setCaseType] = useState<string>("");
    const [claimAmount, setClaimAmount] = useState<string>("");
    const [calculatedFee, setCalculatedFee] = useState<number | null>(null);

    const handleCalculate = () => {
        const amount = parseFloat(claimAmount);
        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid claim amount");
            return;
        }

        let fee = 0;

        switch (caseType) {
            case "plaint":
                fee = calculateCourtFee(amount);
                break;
            case "possession":
                fee = Math.ceil(calculateCourtFee(amount) / 2);
                break;
            case "review_before_90":
                fee = Math.ceil(calculateCourtFee(amount) / 2);
                break;
            case "review_after_90":
                fee = calculateCourtFee(amount);
                break;
            case "appeal":
                fee = calculateCourtFee(amount);
                break;
            default:
                fee = 0;
        }

        setCalculatedFee(fee);
    };

    const handleReset = () => {
        setCaseType("");
        setClaimAmount("");
        setCalculatedFee(null);
    };

    return (
        <main>
            <Navbar />

            {/* Hero Section */}
            <section className="bg-surface-dark pt-36 pb-20 lg:pt-48 lg:pb-28">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="max-w-3xl">
                        <p className="text-sans text-label uppercase text-surface-charcoal-foreground/50 mb-6 flex items-center gap-2">
                            <Calculator size={16} /> Legal Tools
                        </p>
                        <h1 className="text-serif text-display font-bold text-surface-dark-foreground mb-8">
                            Court Fee Calculator
                        </h1>
                        <p className="text-sans text-body-lg text-surface-charcoal-foreground/60 max-w-2xl">
                            Calculate court fees for civil suits based on the Himachal Pradesh Court Fees Act.
                            Enter your claim amount and case type to get an instant fee calculation.
                        </p>
                    </div>
                </div>
            </section>

            {/* Calculator Section */}
            <section className="bg-background py-16 lg:py-28">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Calculator Form */}
                        <div className="lg:col-span-7">
                            <div className="bg-white border border-border p-10 lg:p-14 rounded-sm">
                                <div className="flex items-center gap-3 mb-10 pb-6 border-b border-border">
                                    <Scale size={24} className="text-foreground" />
                                    <h2 className="text-serif text-subheading font-semibold text-foreground">
                                        Fee Calculation
                                    </h2>
                                </div>

                                <div className="space-y-10">
                                    <div>
                                        <Label className="text-sans text-label uppercase text-muted-foreground mb-4 block">
                                            Case Type
                                        </Label>
                                        <Select value={caseType} onValueChange={setCaseType}>
                                            <SelectTrigger className="w-full bg-transparent border-none border-b-2 border-border rounded-none px-0 pb-4 h-auto text-sans text-body-lg text-foreground focus:ring-0 focus:border-foreground transition-all hover:border-foreground/60">
                                                <SelectValue placeholder="Select case type" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-border text-foreground">
                                                <SelectItem value="plaint">Plaint / Written Statement</SelectItem>
                                                <SelectItem value="appeal">Memorandum of Appeal</SelectItem>
                                                <SelectItem value="possession">Suit for Possession (Specific Relief Act)</SelectItem>
                                                <SelectItem value="review_before_90">Review of Judgment (Before 90 days)</SelectItem>
                                                <SelectItem value="review_after_90">Review of Judgment (After 90 days)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label className="text-sans text-label uppercase text-muted-foreground mb-4 block">
                                            Claim Amount (₹)
                                        </Label>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                type="number"
                                                value={claimAmount}
                                                onChange={(e) => setClaimAmount(e.target.value)}
                                                placeholder="Enter claim amount"
                                                className="w-full bg-transparent border-b-2 border-border pb-4 pl-8 text-sans text-body-lg text-foreground focus:outline-none focus:border-foreground transition-colors border-t-0 border-x-0 rounded-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <Button
                                            onClick={handleCalculate}
                                            disabled={!caseType || !claimAmount}
                                            className="text-sans text-label uppercase tracking-[0.1em] bg-foreground text-background px-12 py-5 hover:bg-accent transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Calculate Fee
                                        </Button>
                                        <button
                                            onClick={handleReset}
                                            className="text-sans text-label uppercase text-muted-foreground border-b border-muted-foreground/30 pb-1 hover:text-foreground hover:border-foreground transition-colors"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>

                                {/* Result Display */}
                                {calculatedFee !== null && (
                                    <div className="mt-12 pt-10 border-t border-border">
                                        <div className="bg-surface-dark p-8 rounded-sm">
                                            <p className="text-sans text-label uppercase text-surface-charcoal-foreground/50 mb-3">
                                                Calculated Court Fee
                                            </p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-serif text-display font-bold text-surface-dark-foreground">
                                                    ₹{calculatedFee.toLocaleString('en-IN')}
                                                </span>
                                                <span className="text-sans text-body text-surface-charcoal-foreground/60">
                                                    (Rupees {calculatedFee} only)
                                                </span>
                                            </div>
                                            <p className="text-sans text-sm text-surface-charcoal-foreground/50 mt-6 leading-relaxed">
                                                * This is an estimated fee based on the Himachal Pradesh Court Fees Act.
                                                Actual fees may vary based on specific case circumstances. Please consult
                                                with a legal professional for accurate fee determination.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Information Sidebar */}
                        <div className="lg:col-span-5">
                            <div className="bg-surface-dark p-10 lg:p-14 sticky top-32">
                                <div className="flex items-center gap-3 mb-8">
                                    <FileText size={20} className="text-surface-charcoal-foreground/50" />
                                    <h3 className="text-serif text-subheading font-semibold text-surface-dark-foreground">
                                        Important Information
                                    </h3>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <h4 className="text-sans text-body font-semibold text-surface-dark-foreground mb-3">
                                            About Court Fees
                                        </h4>
                                        <p className="text-sans text-sm text-surface-charcoal-foreground/60 leading-relaxed">
                                            Court fees are calculated based on the value of the subject matter in dispute.
                                            The fee structure is progressive, meaning higher claim amounts attract proportionally
                                            higher fees.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-sans text-body font-semibold text-surface-dark-foreground mb-3">
                                            Fee Schedule
                                        </h4>
                                        <ul className="text-sans text-sm text-surface-charcoal-foreground/60 leading-relaxed space-y-2">
                                            <li>• Up to ₹5: ₹1</li>
                                            <li>• ₹5 - ₹100: ₹1 per ₹5</li>
                                            <li>• ₹100 - ₹500: ₹1 per ₹10</li>
                                            <li>• ₹500 - ₹1,000: ₹2 per ₹10</li>
                                            <li>• Above ₹1,000: Progressive rates apply</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="text-sans text-body font-semibold text-surface-dark-foreground mb-3">
                                            Special Cases
                                        </h4>
                                        <p className="text-sans text-sm text-surface-charcoal-foreground/60 leading-relaxed">
                                            Suits for possession under the Specific Relief Act attract half the normal fee.
                                            Review petitions filed before 90 days also attract half the fee, while those
                                            filed after 90 days attract the full fee.
                                        </p>
                                    </div>

                                    <div className="border-t border-surface-charcoal-foreground/10 pt-8">
                                        <p className="text-sans text-xs text-surface-charcoal-foreground/40 leading-relaxed">
                                            This calculator is based on the Himachal Pradesh Court Fees Act and provides
                                            estimates for informational purposes only. For official fee determination,
                                            please consult the court registry or a legal professional.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default CourtFeeCalculator;
