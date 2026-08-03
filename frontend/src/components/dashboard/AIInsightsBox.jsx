export default function AIInsightsBox({ title, insights, recommendation }) {
  return (
    <div className="ai-box">
      <div className="ai-header">🤖 {title}</div>
      <div className="ai-body">{insights}</div>
      {recommendation && (
        <div className="ai-bullets">
          {recommendation.map((rec, i) => (
            <div className="ai-bullet" key={i}>{rec}</div>
          ))}
        </div>
      )}
    </div>
  );
}
