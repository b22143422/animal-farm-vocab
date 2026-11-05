import { vocabulary } from '../data/vocabulary.js';
import { chapterOf } from '../utils/quiz.js';

export default function QuizSetup({ settings, setSettings, onStart, history }) {
  const filtered = vocabulary.filter((word) => settings.chapter === 'all' || chapterOf(word) === Number(settings.chapter));
  const maximum = filtered.length * (settings.mode === 'mixed' ? 3 : 1);
  const change = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  return (
    <section className="panel">
      <div className="section-heading"><span className="eyebrow">01 · SETUP</span><h2>시험 설정</h2></div>
      <div className="form-grid">
        <label>시험 범위
          <select value={settings.chapter} onChange={(e) => change('chapter', e.target.value)}>
            <option value="all">전체 43개</option>
            <option value="1">Chapter 1 · 14개</option>
            <option value="5">Chapter 5 · 10개</option>
            <option value="7">Chapter 7 · 19개</option>
          </select>
        </label>
        <label>암기 영역
          <select value={settings.mode} onChange={(e) => change('mode', e.target.value)}>
            <option value="mixed">통합 · 뜻 + 유의어 + 영영풀이</option>
            <option value="meaning">뜻만</option>
            <option value="syn">유의어만</option>
            <option value="definition">영영풀이만</option>
          </select>
        </label>
        <label>문항 수
          <select value={settings.amount} onChange={(e) => change('amount', e.target.value)}>
            <option value="all">전체 {maximum}문제</option>
            {[10, 20, 30].filter((n) => n <= maximum).map((n) => <option value={n} key={n}>랜덤 {n}문제</option>)}
          </select>
        </label>
      </div>
      <p className="muted">통합 전체 시험은 43개 단어 × 3영역 = <strong>129문제</strong>입니다. 문제 및 정답 보기 순서는 무작위입니다.</p>
      <button className="primary" onClick={onStart}>시험 시작 <span aria-hidden="true">→</span></button>
      {history && (
        <div className="last-score">
          <span>이 기기에 저장된 최근 시험</span>
          <strong>{history.correct} / {history.total}문제 · {Math.round(100 * history.correct / history.total)}%</strong>
          <small>{new Date(history.date).toLocaleString('ko-KR')}</small>
        </div>
      )}
    </section>
  );
}
