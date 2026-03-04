import { useEffect, useState } from 'react';
import api from '../api/api';
import useInterviewStore from '../store/useInterviewStore';
import Spinner from './Spinner';

function ScoreDisplay({ score }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const pct = (score / 10) * 100;
  const offset = circumference - (pct / 100) * circumference;

  let color, glowColor, label;
  if (score >= 8) {
    color = '#14b8a6';
    glowColor = 'rgba(20, 184, 166, 0.35)';
    label = 'Excellent';
  } else if (score >= 5) {
    color = '#f59e0b';
    glowColor = 'rgba(245, 158, 11, 0.35)';
    label = 'Good';
  } else {
    color = '#ef4444';
    glowColor = 'rgba(239, 68, 68, 0.35)';
    label = 'Needs Work';
  }

  return (
    <div className="flex items-center gap-5 rounded-xl bg-white/[0.04] border border-white/[0.08] p-5 animate-stagger-1">
      <div className="relative flex items-center justify-center" style={{ width: 96, height: 96 }}>
        {/* Radial glow */}
        <div
          className="absolute inset-0 rounded-full blur-xl"
          style={{ background: `radial-gradient(circle, ${glowColor}, transparent 70%)` }}
        />
        <svg width={96} height={96} viewBox="0 0 96 96" className="absolute">
          <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
          <circle
            cx="48" cy="48" r={radius} fill="none"
            stroke={color} strokeWidth="5" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 0.8s ease-out' }}
          />
        </svg>
        <div className="relative text-center">
          <span className="text-2xl font-bold text-white">{score}</span>
          <span className="text-sm text-text-dim">/10</span>
        </div>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-text-dim">Score</p>
        <p className="text-xl font-bold font-display italic" style={{ color }}>{label}</p>
      </div>
    </div>
  );
}

function InterviewModal({ question, onClose }) {
  const updateQuestionFeedback = useInterviewStore((s) => s.updateQuestionFeedback);

  const [draft, setDraft] = useState(question.userAnswer || '');
  const [isEditing, setIsEditing] = useState(question.status !== 'answered');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const draftTrimmed = draft.trim();
  const isValid = draftTrimmed.length >= 20 && draftTrimmed.length <= 5000;

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  async function handleSubmit() {
    if (!isValid) return;
    setError('');
    setSubmitting(true);
    try {
      const res = await api.post('/answers', {
        questionId: question.id,
        answer: draftTrimmed,
      });
      updateQuestionFeedback(
        question.id,
        draftTrimmed,
        res.data.feedback,
        res.data.tips || [],
        res.data.score
      );
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  }

  const storeQuestion = useInterviewStore((s) => s.questions.find((q) => q.id === question.id)) || question;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-base-800 border border-white/[0.1] shadow-modal animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 bg-base-800/90 backdrop-blur-sm px-6 pt-5 pb-4 rounded-t-xl">
          <h3 className="text-base font-semibold text-white leading-snug pr-4">{storeQuestion.questionText}</h3>
          <button
            onClick={onClose}
            className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg text-text-dim transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Accent divider below header */}
        <div className="accent-divider" />

        <div className="p-6">
          {!isEditing && storeQuestion.status === 'answered' ? (
            <div className="space-y-5">
              {/* Score display */}
              {storeQuestion.score != null && (
                <ScoreDisplay score={storeQuestion.score} />
              )}

              {/* Answer — inset panel with left accent border */}
              <div className="animate-stagger-2">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-dim">Your Answer</p>
                <div className="rounded-lg bg-base-900/80 border border-white/[0.06] p-4 border-l-2 border-l-accent-teal/40">
                  <p className="text-sm text-text-body leading-relaxed whitespace-pre-wrap">{storeQuestion.userAnswer}</p>
                </div>
              </div>

              {/* Accent divider */}
              <div className="accent-divider" />

              {/* Feedback */}
              <div className="animate-stagger-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-dim">AI Feedback</p>
                <p className="text-sm text-text-body leading-relaxed whitespace-pre-wrap">{storeQuestion.aiFeedback}</p>
              </div>

              {/* Tips — individual cards */}
              {storeQuestion.aiTips.length > 0 && (
                <div className="animate-stagger-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent-amber">Tips to Improve</p>
                  <div className="space-y-2">
                    {storeQuestion.aiTips.map((tip, i) => (
                      <div key={i} className="flex gap-3 rounded-lg bg-accent-amber/[0.06] border border-accent-amber/10 p-3">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-accent-amber/10 text-[10px] font-bold text-accent-amber">
                          {i + 1}
                        </span>
                        <p className="text-sm text-text-body leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => setIsEditing(true)} className="btn-secondary w-full animate-stagger-5">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                </svg>
                Edit Answer
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-dim">
                  Your Answer
                </label>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type your answer here..."
                  maxLength={5000}
                  rows={7}
                  className="input-base resize-y"
                />
                <p className={`mt-1.5 text-xs ${draftTrimmed.length > 0 && draftTrimmed.length < 20 ? 'text-red-400 font-medium' : 'text-text-dim'}`}>
                  {draftTrimmed.length.toLocaleString()} / 5,000 characters
                  {draftTrimmed.length > 0 && draftTrimmed.length < 20 && ' — need at least 20'}
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5">
                  <svg className="h-4 w-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!isValid || submitting}
                className="btn-primary w-full py-3"
              >
                {submitting ? (
                  <>
                    <Spinner size="sm" className="text-base-900/60" />
                    Evaluating your answer...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                    Submit Answer
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InterviewModal;
