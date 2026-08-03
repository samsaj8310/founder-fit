export default function KPICard({ title, child, className = "" }) {
  return (
    <div className={`dc ${className}`}>
      <div className="dc-title">{title}</div>
      {child}
    </div>
  );
}
