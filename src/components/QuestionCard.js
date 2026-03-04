function ScoreRing({ score, size = 40 }) {
  const radius = 15;
  const circumference = 2 * Math.PI * radius;
  const pct = (score / 10) * 100;
  const offset = circumference - (pct / 100) * circumference;

  let color = '#f59e0b';
  if (score >= 8) color = '#14b8a6';
  else if (score < 5) color = '#ef4444';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 36 36" className="absolute">
        <circle cx="18" cy="18" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
        <circle
          cx="18" cy="18" r={radius} fill="none"
          stroke={color} strokeWidth="3" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 0.6s ease-out' }}
        />
      </svg>
      <span className="text-xs font-bold text-white">{score}</span>
    </div>
  );
}

function QuestionCard({ question, index, onClick }) {
  const isAnswered = question.status === 'answered';

  return (
    <button
      onClick={onClick}
      className={`group w-full text-left rounded-xl border border-white/[0.08] bg-white/[0.04] shadow-card p-0 overflow-hidden
                 transition-all duration-300
                 hover:bg-white/[0.07] hover:border-white/[0.18] hover:shadow-card-hover hover:-translate-y-1
                 focus:outline-none focus:ring-2 focus:ring-accent-amber/40 focus:ring-offset-2 focus:ring-offset-base-900
                 ${isAnswered ? 'hover:glow-teal' : 'hover:glow-amber'}`}
    >
      <div className="flex h-full">
        {/* Left border accent — widens on hover */}
        <div className={`w-1 group-hover:w-1.5 shrink-0 transition-all duration-300 ${isAnswered
          ? 'bg-gradient-to-b from-accent-teal to-teal-600'
          : 'bg-gradient-to-b from-accent-amber to-amber-600'
        }`} />

        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <span className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold mb-2.5 ${
                isAnswered ? 'bg-accent-teal/10 text-accent-teal' : 'bg-accent-amber/10 text-accent-amber'
              }`}>
                {index + 1}
              </span>
              <p className="text-sm font-medium text-text-body leading-relaxed line-clamp-3 group-hover:text-white transition-colors duration-300">
                {question.questionText}
              </p>
            </div>

            {isAnswered && question.score != null && (
              <div className="shrink-0">
                <ScoreRing score={question.score} />
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                isAnswered
                  ? 'bg-accent-teal/10 text-accent-teal'
                  : 'bg-white/5 text-text-dim'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isAnswered ? 'bg-accent-teal' : 'bg-text-dim'}`} />
              {isAnswered ? 'Answered' : 'Pending'}
            </span>
            <span className="text-xs text-text-dim opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Click to {isAnswered ? 'review' : 'answer'}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

export default QuestionCard;
