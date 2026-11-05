import { useMemo, useState } from 'react';
import { vocabulary } from '../data/vocabulary.js';
import { categories, makeOptions } from '../utils/quiz.js';

export default function Quiz({ question, index, total, correct, onAnswer, onNext }) {
  const [chosen, setChosen] = useState(null);
  const options = useMemo(() => makeOptions(question, vocabulary), [question]);
  const isCorrect = chosen === question.word[question.field];

  function choose(option) {
    if (chosen !== null) return;
    setChosen(option);
    onAnswer({ question, answer: option, ok: option === question.word[question.field] });
  }

  return (
    <section className="panel">
      <div className="quiz-top"><span className="eyebrow">02 · QUIZ</span><span>{index + 1} / {total}</span></div>
      <div className="progress" role="progressbar" aria-valuenow={index + 1} aria-valuemin="0" aria-valuemax={total}>
        <div style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>
      <div className="quiz-top tiny"><span>{question.word.chapter}</span><span>정답 {correct}개</span></div>
      <span className="type-pill">{categories[question.field]} 고르기</span>
      <h2 className="question-word">{question.word.word}</h2>
      <p className="muted">다음 중 가장 적절한 정답을 고르세요.</p>
      <div className="options">
        {options.map((option, i) => {
          const right = option === question.word[question.field];
          let state = '';
          if (chosen !== null && right) state = 'correct';
          else if (chosen === option && !right) state = 'incorrect';
          return (
            <button key={i} className={`option ${state}`} disabled={chosen !== null}
              onClick={() => choose(option)}>
              <span className="option-index">{['①', '②', '③', '④'][i]}</span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>
      {chosen !== null && <div className="feedback" aria-live="polite">
        <h3>{isCorrect ? '✓ 정답입니다' : '✕ 오답입니다'}</h3>
        <dl>
          <dt>뜻</dt><dd>{question.word.meaning}</dd>
          <dt>유의어</dt><dd>{question.word.syn}</dd>
          <dt>영영풀이</dt><dd>{question.word.definition}</dd>
          <dt>영영풀이 해석</dt><dd>{question.word.translation}</dd>
          <dt>학교 필기</dt><dd>{question.word.note}</dd>
        </dl>
      </div>}
      {chosen !== null && <button className="primary" onClick={onNext}>
        {index === total - 1 ? '결과 확인' : '다음 문제'} <span aria-hidden="true">→</span>
      </button>}
    </section>
  );
}
