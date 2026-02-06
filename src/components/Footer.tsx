import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";
import TypewriterText from "./TypewriterText";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background overflow-hidden relative">
      <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-sm">
          {/* Brand & Address */}
          <div className="lg:col-span-5 space-y-6">
            <ScrollReveal>
              <h3 className="text-serif text-3xl lg:text-4xl font-bold mb-6 transition-colors">VAKALT</h3>
              <p className="text-sans text-sm lg:text-base text-background/60 mb-6 max-w-sm leading-relaxed">
                Expert Criminal Defence Services. Protecting your rights with experienced legal defence.
              </p>

              <div className="space-y-2">
                <p className="text-sans text-xs font-bold text-background/40 uppercase tracking-[0.2em]">Address</p>
                <div className="text-sans text-sm text-background/60 leading-relaxed">
                  <p>House Number 21, Begumpur</p>
                  <p>Opposite Rohini Sector 22</p>
                  <p>Delhi, DL 110086</p>
                </div>
              </div>

              <div className="space-y-2 mt-6">
                <p className="text-sans text-xs font-bold text-background/40 uppercase tracking-[0.2em]">Contact & Hours</p>
                <p className="text-sans text-sm text-background/80">9667099321</p>
                <p className="text-sans text-sm text-background/60">09:00 am – 05:00 pm</p>
              </div>
            </ScrollReveal>
          </div>

          {/* Navigation */}
          {/* Navigation */}
          <div className="lg:col-span-2 lg:col-start-6">
            <ScrollReveal delay={0.1}>
              <h4 className="text-serif text-lg font-bold text-background mb-6">Menu</h4>
              <ul className="space-y-2">
                {[
                  { label: "Home", href: "/" },
                  { label: "Insights", href: "/insights" },
                  { label: "Contact", href: "/contact" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sans text-sm text-background/60 hover:text-background transition-all hover:translate-x-1 inline-block"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>

          {/* Legal Tools */}
          <div className="lg:col-span-2">
            <ScrollReveal delay={0.15}>
              <h4 className="text-serif text-lg font-bold text-background mb-6">Legal Tools</h4>
              <ul className="space-y-2">
                {[
                  { label: "Fee Calculator", href: "/tools" },
                  { label: "Doc Checklist", href: "/tools" },
                  { label: "Case Prep", href: "/tools" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sans text-sm text-background/60 hover:text-background transition-all hover:translate-x-1 inline-block"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>

          {/* Practice Areas */}
          <div className="lg:col-span-3">
            <ScrollReveal delay={0.2}>
              <h4 className="text-serif text-lg font-bold text-background mb-6">Practice Areas</h4>
              <ul className="space-y-2">
                {["Corporate Law", "Civil Litigation", "Criminal Law", "Property & Real Estate"].map((area) => (
                  <li key={area}>
                    <span className="text-sans text-sm text-background/60 hover:text-background cursor-pointer transition-all hover:translate-x-1 inline-block">{area}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </div>

        {/* Big VAKALT Text */}
        <div className="border-t border-background/10 mt-16 pt-12">
          <div className="overflow-hidden flex justify-center lg:justify-start">
            <TypewriterText text="VAKALT" className="text-[18vw] lg:text-[15vw] leading-none font-serif font-bold text-background/90 tracking-[0.2em] opacity-10 select-none" />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-background/40">
          <p>© {currentYear} Vakalt - All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/admin" className="hover:text-background transition-colors">Admin</Link>
            <p>
              Developed by <a href="https://www.zyradigitals.com" target="_blank" rel="noopener noreferrer" className="text-background/60 hover:text-background transition-colors font-medium">Zyra Digitals</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
