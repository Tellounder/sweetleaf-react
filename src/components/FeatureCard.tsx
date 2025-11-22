type FeatureCardProps = {
  title: string;
  description: string;
};

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="card stack">
      <h3>{title}</h3>
      <p className="muted">{description}</p>
    </div>
  );
}
