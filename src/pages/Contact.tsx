
import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubjectChange = (value: string) => {
    setFormData({ ...formData, subject: value });
  };

  return (
    <main>
      <SEO
        title="Contact Us | Schedule a Consultation"
        description="Ready to discuss your legal needs? Contact Vakalt for a confidential consultation. Reach us via email, phone, or visit our office in Delhi."
      />
      <Navbar />

      {/* Hero */}
      <section className="bg-surface-dark pt-36 pb-20 lg:pt-48 lg:pb-28">
        <div className="container mx-auto px-6 lg:px-12">
          <ScrollReveal>
            <p className="text-sans text-label uppercase text-surface-charcoal-foreground/50 mb-6">Get in Touch</p>
            <h1 className="text-serif text-display font-bold text-surface-dark-foreground mb-8">
              Contact
            </h1>
            <p className="text-sans text-body-lg text-surface-charcoal-foreground/60 max-w-xl">
              Ready to discuss your legal needs? Reach out for a confidential consultation.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Form section */}
      <section className="bg-background py-16 lg:py-28">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            {/* Form */}
            <div className="lg:col-span-7">
              <ScrollReveal>
                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      className="space-y-10"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <h2 className="text-serif text-display-sm font-bold text-foreground mb-4">
                        Send a Message
                      </h2>

                      {[
                        { name: "name", label: "Full Name", type: "text" },
                        { name: "email", label: "Email Address", type: "email" },
                        { name: "phone", label: "Phone Number", type: "tel" },
                      ].map((field) => (
                        <div key={field.name}>
                          <label className="text-sans text-label uppercase text-muted-foreground mb-4 block">
                            {field.label}
                          </label>
                          <input
                            type={field.type}
                            name={field.name}
                            required
                            value={formData[field.name as keyof typeof formData]}
                            onChange={handleChange}
                            className="w-full bg-transparent border-b-2 border-border pb-4 text-sans text-body-lg text-foreground focus:outline-none focus:border-foreground transition-colors"
                          />
                        </div>
                      ))}

                      <div>
                        <label className="text-sans text-label uppercase text-muted-foreground mb-4 block">Subject</label>
                        <Select onValueChange={handleSubjectChange} defaultValue={formData.subject}>
                          <SelectTrigger className="w-full bg-transparent border-none border-b-2 border-border rounded-none px-0 pb-4 h-auto text-sans text-body-lg text-foreground focus:ring-0 focus:border-foreground transition-all hover:border-foreground/60 focus:bg-transparent data-[placeholder]:text-muted-foreground/40">
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-border text-foreground">
                            <SelectItem value="consultation">General Consultation</SelectItem>
                            <SelectItem value="corporate">Corporate Law</SelectItem>
                            <SelectItem value="civil">Civil Litigation</SelectItem>
                            <SelectItem value="criminal">Criminal Law</SelectItem>
                            <SelectItem value="property">Property & Real Estate</SelectItem>
                            <SelectItem value="family">Family Law</SelectItem>
                            <SelectItem value="ip">Intellectual Property</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sans text-label uppercase text-muted-foreground mb-4 block">Message</label>
                        <textarea
                          name="message"
                          rows={5}
                          required
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full bg-transparent border-b-2 border-border pb-4 text-sans text-body-lg text-foreground focus:outline-none focus:border-foreground transition-colors resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="text-sans text-[10px] font-bold uppercase tracking-[0.1em] bg-foreground text-background px-8 py-3 rounded-full hover:bg-zinc-800 transition-all duration-500 w-auto min-w-[180px]"
                      >
                        Send Message
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="py-16"
                    >
                      <h2 className="text-serif text-display-sm font-bold text-foreground mb-6">
                        Thank you.
                      </h2>
                      <p className="text-sans text-body-lg text-muted-foreground leading-relaxed max-w-md mb-8">
                        Your message has been received. Our team will review your inquiry and respond within one business day.
                      </p>
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
                        }}
                        className="text-sans text-label uppercase text-muted-foreground border-b border-muted-foreground/30 pb-1 hover:text-foreground hover:border-foreground transition-colors"
                      >
                        Send another message
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </ScrollReveal>
            </div>

            {/* Contact info sidebar */}
            <div className="lg:col-span-4 lg:col-start-9">
              <ScrollReveal delay={0.15}>
                <div className="bg-surface-dark p-10 lg:p-14 sticky top-32">
                  <h3 className="text-serif text-subheading font-semibold text-surface-dark-foreground mb-10">
                    Contact Details
                  </h3>

                  <div className="space-y-10">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <Mail className="w-4 h-4 text-surface-charcoal-foreground/50" />
                        <span className="text-sans text-label uppercase text-surface-charcoal-foreground/40">Email</span>
                      </div>
                      <a href="mailto:contact@vakalt.com" className="text-sans text-body text-surface-dark-foreground hover:text-surface-charcoal-foreground transition-colors">
                        contact@vakalt.com
                      </a>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <Phone className="w-4 h-4 text-surface-charcoal-foreground/50" />
                        <span className="text-sans text-label uppercase text-surface-charcoal-foreground/40">Phone / WhatsApp</span>
                      </div>
                      <p className="text-sans text-body text-surface-dark-foreground">+91 00000 00000</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <MapPin className="w-4 h-4 text-surface-charcoal-foreground/50" />
                        <span className="text-sans text-label uppercase text-surface-charcoal-foreground/40">Office</span>
                      </div>
                      <p className="text-sans text-body text-surface-dark-foreground leading-relaxed mb-4">
                        House Number 21, Begumpur<br />Opposite Rohini Sector 22<br />Delhi, DL 110086
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-surface-charcoal-foreground/10 mt-10 pt-8">
                    <p className="text-sans text-sm text-surface-charcoal-foreground/30 leading-relaxed">
                      All consultations are confidential and protected by attorney-client privilege where applicable.
                    </p>
                  </div>
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

export default Contact;
