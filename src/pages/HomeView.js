import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import useInterviewStore from '../store/useInterviewStore';
import Spinner from '../components/Spinner';

function HomeView() {
  const [resume, setResume] = useState('');
  const [role, setRole] = useState('');
  const [fileName, setFileName] = useState('');
  const [parsing, setParsing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const { resetSession, setSetupData, setQuestions } = useInterviewStore();

  useEffect(() => {
    document.title = 'Home | AI Interview Prep';
    return () => { document.title = 'AI Interview Prep'; };
  }, []);

  const resumeTrimmed = resume.trim();
  const roleTrimmed = role.trim();
  const isValid =
    resumeTrimmed.length >= 50 &&
    resumeTrimmed.length <= 10000 &&
    roleTrimmed.length >= 2 &&
    roleTrimmed.length <= 100;

  async function handleSubmit() {
    if (!isValid || submitting) return;
    setSubmitting(true);
    try {
      resetSession();
      await api.post('/session/reset');
      await api.post('/session/create');
      await api.post('/resume', { content: resumeTrimmed, role: roleTrimmed });
      setSetupData(resumeTrimmed, roleTrimmed);
      await api.post('/questions');
      const res = await api.get('/questions');
      setQuestions(res.data.questions);
      navigate('/questions');
    } catch (err) {
      console.error('Submit failed', err);
      alert(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setParsing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/resume/parse', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResume(res.data.content);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to parse file');
    } finally {
      setParsing(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center px-4 py-12 lg:py-0">
      <div className="mx-auto w-full max-w-6xl animate-fade-in">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-20">
          {/* Left — Hero text, pushed down for asymmetry */}
          <div className="flex-1 text-center lg:text-left lg:pt-16">
            <h1 className="font-display italic text-5xl text-white sm:text-6xl lg:text-8xl leading-[0.95] tracking-tight">
              Ace your next<br />
              <span className="gradient-text">interview.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-text-muted leading-relaxed mx-auto lg:mx-0">
              Paste your resume, pick a role, and get AI&#8209;generated interview questions with real&#8209;time scoring and feedback.
            </p>
            <div className="mt-8 flex items-center gap-8 justify-center lg:justify-start">
              <div className="flex items-center gap-2.5 text-sm text-text-dim">
                <div className="h-2 w-2 rounded-full bg-accent-teal" />
                Local LLM powered
              </div>
              <div className="flex items-center gap-2.5 text-sm text-text-dim">
                <div className="h-2 w-2 rounded-full bg-accent-teal" />
                Data stays on device
              </div>
            </div>
          </div>

          {/* Right — Form card, slightly raised for overlap tension */}
          <div className="w-full max-w-md lg:mt-4 relative">
            {/* Subtle glow behind card */}
            <div className="absolute -inset-8 bg-accent-amber/[0.04] rounded-3xl blur-2xl pointer-events-none" />

            <div className="relative card-glass p-7">
              {/* Resume textarea */}
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Resume
              </label>
              <textarea
                placeholder="Paste your resume content here..."
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                maxLength={10000}
                rows={6}
                className="input-base resize-y"
              />
              <p className={`mt-1.5 text-xs ${resumeTrimmed.length > 0 && resumeTrimmed.length < 50 ? 'text-red-400 font-medium' : 'text-text-dim'}`}>
                {resumeTrimmed.length.toLocaleString()} / 10,000 characters
                {resumeTrimmed.length > 0 && resumeTrimmed.length < 50 && ' — need at least 50'}
              </p>

              {/* Divider */}
              <div className="my-5 flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="text-xs font-medium text-text-dim uppercase tracking-wider">or upload</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>

              {/* File upload */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group w-full rounded-lg border border-dashed border-white/10 bg-white/[0.03] p-5 text-center
                           transition-all duration-200 hover:border-accent-amber/30 hover:bg-white/[0.06]"
              >
                {parsing ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner size="sm" className="text-accent-amber" />
                    <span className="text-sm font-medium text-text-muted">Parsing resume...</span>
                  </div>
                ) : fileName ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="h-5 w-5 text-accent-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-text-body">{fileName}</span>
                  </div>
                ) : (
                  <>
                    <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06] text-text-muted group-hover:text-accent-amber transition-colors">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-text-muted">
                      Click to upload <span className="text-accent-amber">PDF</span> or <span className="text-accent-amber">DOCX</span>
                    </p>
                    <p className="mt-1 text-xs text-text-dim">Max 5MB</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileUpload}
                  hidden
                />
              </button>

              {/* Role input */}
              <label className="mt-5 mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Target Role
              </label>
              <input
                placeholder="e.g. Senior Frontend Developer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                maxLength={100}
                className="input-base"
              />
              <p className={`mt-1.5 text-xs ${roleTrimmed.length > 0 && roleTrimmed.length < 2 ? 'text-red-400 font-medium' : 'text-text-dim'}`}>
                {roleTrimmed.length} / 100 characters
                {roleTrimmed.length > 0 && roleTrimmed.length < 2 && ' — need at least 2'}
              </p>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!isValid || submitting}
                className="btn-primary mt-6 w-full py-3.5"
              >
                {submitting ? (
                  <>
                    <Spinner size="sm" className="text-base-900/60" />
                    Generating Questions...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    Generate Questions
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeView;
