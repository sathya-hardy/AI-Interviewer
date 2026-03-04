import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import useInterviewStore from '../store/useInterviewStore';

function Navbar() {
  const navigate = useNavigate();
  const resetSession = useInterviewStore((s) => s.resetSession);

  async function handleReset() {
    try {
      resetSession();
      await api.post('/session/reset');
      navigate('/');
    } catch (err) {
      console.error('Reset failed', err);
    }
  }

  return (
    <nav className="sticky top-0 z-40 bg-base-900/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="group">
          <span className="font-display italic text-xl text-white tracking-tight group-hover:text-accent-amber transition-colors duration-300">
            InterviewAI
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/questions"
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-white/5 hover:text-white"
          >
            Dashboard
          </Link>
          <button
            onClick={handleReset}
            className="rounded-lg border border-red-500/20 bg-red-500/10 px-3.5 py-2 text-sm font-medium text-red-400
                       transition-all hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30"
          >
            Reset
          </button>
        </div>
      </div>
      {/* Gradient accent border */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent-amber/40 to-transparent" />
    </nav>
  );
}

export default Navbar;
