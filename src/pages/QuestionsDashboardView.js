import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import useInterviewStore from '../store/useInterviewStore';
import QuestionGrid from '../components/QuestionGrid';
import InterviewModal from '../components/InterviewModal';

function QuestionsDashboardView() {
  const questions = useInterviewStore((s) => s.questions);
  const setQuestions = useInterviewStore((s) => s.setQuestions);
  const [loading, setLoading] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Questions | AI Interview Prep';
    return () => { document.title = 'AI Interview Prep'; };
  }, []);

  useEffect(() => {
    if (questions.length > 0) return;
    let cancelled = false;
    async function fetchQuestions() {
      setLoading(true);
      try {
        const res = await api.get('/questions');
        if (!cancelled && res.data.questions?.length) {
          setQuestions(res.data.questions);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchQuestions();
    return () => { cancelled = true; };
  }, [questions.length, setQuestions]);

  const answeredCount = questions.filter((q) => q.status === 'answered').length;

  if (!loading && questions.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-57px)] items-center justify-center px-4">
        <div className="animate-fade-in text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/[0.06] border border-white/[0.08]">
            <svg className="h-10 w-10 text-accent-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="mb-2 text-3xl font-display italic text-white">No Questions Yet</h2>
          <p className="mb-8 max-w-sm mx-auto text-sm text-text-muted leading-relaxed">
            Upload your resume and select a target role to generate personalized interview questions.
          </p>
          <button onClick={() => navigate('/')} className="btn-primary">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Get Started
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-57px)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl animate-fade-in">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl tracking-tight text-white font-display italic">Interview Questions</h2>
            <p className="mt-1 text-sm text-text-muted">Click a card to answer or review your response.</p>
          </div>
          {questions.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 rounded-lg bg-white/[0.06] border border-white/[0.08] px-4 py-2">
                <div className="relative h-2 w-24 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent-amber to-amber-500 transition-all duration-500"
                    style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-text-muted">
                  {answeredCount}/{questions.length}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Accent divider between header and grid */}
        <div className="accent-divider mb-8" />

        <QuestionGrid
          questions={questions}
          isLoading={loading}
          onCardClick={(q) => setActiveQuestion(q)}
        />
      </div>

      {activeQuestion && (
        <InterviewModal
          question={activeQuestion}
          onClose={() => setActiveQuestion(null)}
        />
      )}
    </div>
  );
}

export default QuestionsDashboardView;
