import ScrollReveal from "./ScrollReveal";

const stats = [
  { num: "500+", label: "Cases Resolved" },
  { num: "98%", label: "Client Satisfaction" },
  { num: "15+", label: "Years Experience" },
  { num: "6", label: "Practice Areas" },
];

const Stats = () => {
  return (
    <section className="bg-surface-offwhite py-20 lg:py-28">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-border">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.1} className="lg:px-12 first:lg:pl-0 last:lg:pr-0">
              <div className="text-center lg:text-left">
                <p className="text-serif text-display-sm font-bold text-foreground mb-2">{stat.num}</p>
                <p className="text-sans text-label uppercase text-muted-foreground">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
