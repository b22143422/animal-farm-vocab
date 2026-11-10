import { categories } from '../utils/quiz.js';

export default function QuizResult({ results, book, onRestart, onRedo }) {
  const right = results.filter((r) => r.ok).length;
  const wrong = results.filter((r) => !r.ok);
  const percentage = results.length ? Math.round(100 * right / results.length) : 0;
  const isLite = book === 'lite';

  return <section className="panel">
    <div className="section-heading"><span className="eyebrow">03 · RESULT</span><h2>채점 결과</h2></div>
    <div className="result-overview">
      <div><strong className="score-big">{percentage}<small>%</small></strong><span>정답률</span></div>
      <div><strong>{right} / {results.length}</strong><span>정답 문항</span></div>
      <div><strong>{wrong.length}</strong><span>오답 문항</span></div>
    </div>
    <h3>영역별 성적</h3>
    <div className="results-stats">
      {Object.entries(categories).map(([key, label]) => {
        const selected = results.filter((r) => r.question.field === key);
        if (!selected.length) return null;
        return <div className="stat-line" key={key}><span>{label}</span>
          <strong>{selected.filter((r) => r.ok).length} / {selected.length}</strong></div>;
      })}
    </div>
    <div className="button-row">
      <button className="primary" disabled={!wrong.length} onClick={onRedo}>오답만 다시 풀기</button>
      <button className="secondary" onClick={onRestart}>새 시험 설정</button>
      <button className="secondary" onClick={() => window.print()}>결과 인쇄</button>
    </div>
    <h3>오답 복습</h3>
    <p className="muted">{wrong.length ? '틀린 문제의 정답과 어휘 정보를 확인하세요.' : '모든 문제를 맞혔습니다!'}</p>
    <div className="wrong-answers">
      {wrong.map((entry, i) => {
        const w = entry.question.word;
        return <article className="wrong-item" key={`${entry.question.id}-${i}`}>
          <div className="wrong-title"><b>{i + 1}. {w.word}</b><span>{w.chapter} · {categories[entry.question.field]}</span></div>
          <p><b>선택한 답:</b> {entry.answer}</p>
          <p><b>정답:</b> {w[entry.question.field]}</p>
          <p><b>뜻:</b> {w.meaning}</p><p><b>유의어:</b> {w.syn}</p>
          {!isLite && <><p><b>영영풀이:</b> {w.definition}</p><p><b>해석:</b> {w.translation}</p>
            <p><b>학교 필기:</b> {w.note}</p></>}
        </article>;
      })}
    </div>
  </section>;
}
