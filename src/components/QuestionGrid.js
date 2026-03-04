import QuestionCard from './QuestionCard';
import SkeletonCard from './SkeletonCard';

function QuestionGrid({ questions, isLoading, onCardClick }) {
  if (isLoading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCard key={i} index={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {questions.map((q, i) => (
        <QuestionCard key={q.id} question={q} index={i} onClick={() => onCardClick(q)} />
      ))}
    </div>
  );
}

export default QuestionGrid;
