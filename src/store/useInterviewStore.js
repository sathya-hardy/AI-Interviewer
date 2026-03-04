import { create } from 'zustand';

const useInterviewStore = create((set) => ({
  resumeData: '',
  targetRole: '',
  questions: [],
  isLoading: false,
  error: null,

  setSetupData: (resume, role) => set({ resumeData: resume, targetRole: role }),

  setQuestions: (questionsArray) =>
    set({
      questions: questionsArray.map((q) => ({
        id: q.id,
        questionText: q.question,
        userAnswer: '',
        aiFeedback: null,
        aiTips: [],
        score: null,
        status: 'pending',
      })),
    }),

  updateQuestionFeedback: (id, answer, feedback, tips, score) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === id
          ? { ...q, userAnswer: answer, aiFeedback: feedback, aiTips: tips, score, status: 'answered' }
          : q
      ),
    })),

  setLoading: (bool) => set({ isLoading: bool }),

  setError: (msg) => set({ error: msg }),

  resetSession: () =>
    set({
      resumeData: '',
      targetRole: '',
      questions: [],
      isLoading: false,
      error: null,
    }),
}));

export default useInterviewStore;
