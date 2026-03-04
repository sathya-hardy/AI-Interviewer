import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeView from './pages/HomeView';
import QuestionsDashboardView from './pages/QuestionsDashboardView';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-base-900 text-text-body">
        {/* Mesh gradient background — boosted opacity */}
        <div className="mesh-gradient">
          <div className="absolute -top-32 -right-32 h-[600px] w-[600px] rounded-full bg-purple-900/30 blur-[120px] animate-mesh" />
          <div className="absolute top-1/2 -left-48 h-[500px] w-[500px] rounded-full bg-teal-900/25 blur-[120px] animate-mesh" style={{ animationDelay: '-10s' }} />
          <div className="absolute -bottom-32 right-1/4 h-[400px] w-[400px] rounded-full bg-amber-900/15 blur-[120px] animate-mesh" style={{ animationDelay: '-5s' }} />
        </div>
        {/* Noise texture overlay */}
        <div className="noise-overlay" />

        <div className="relative z-10">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/questions" element={<QuestionsDashboardView />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
