type SectionProps = {
  kicker?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  id?: string;
  variant?: string;
};

export function Section({
  kicker,
  title,
  subtitle,
  children,
  id,
  variant,
}: SectionProps) {
  return (
    <section
      className={`section${variant ? ` section--${variant}` : ""}`}
      id={id}
      data-section={variant ?? title}
    >
      <div className="container">
        <div className="section-header">
          {kicker && <div className="section-kicker">{kicker}</div>}
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
