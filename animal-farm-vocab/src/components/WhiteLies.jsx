import { useState } from 'react';
import { createWhiteLiesTest, vocabularyWhiteLies } from '../data/vocabularyWhiteLies.js';
import { shuffle } from '../utils/quiz.js';

const STORE = 'optimum-white-lies-v1';
const words = vocabularyWhiteLies;
// 기존 '통합' 학습 기록을 보존하고, 이전에 반별로 체크한 항목도 합집합으로 가져옵니다.
const keyFor = (id) => `all:${id}`;
function readSaved() {
  try {
    const value = JSON.parse(localStorage.getItem(STORE) || '{}') || {};
    const existing = value.known || {};
    const known = { ...existing };
    words.forEach(({ id }) => {
      if ([id, `all:${id}`, `one:${id}`, `four:${id}`].some((k) => existing[k])) known[keyFor(id)] = true;
    });
    return { ...value, known };
  } catch { return {}; }
}
function writeSaved(value) {
  try { localStorage.setItem(STORE, JSON.stringify(value)); }
  catch { /* 기기 정책상 저장 불가 */ }
}

function SchoolNotes({ word }) {
  const isAnswerListed = word.synonyms.includes(word.answer);
  return <div className="wl-notes">
    <div className="wl-note-row">
      <span className="wl-tag">통합 유의어</span>
      <span>{word.synonyms.join(', ')}</span>
    </div>
    {!isAnswerListed && <div className="wl-note-row">
      <span className="wl-tag">대표 유의어</span>
      <span>{word.answer} <small>(객관식 채점 기준)</small></span>
    </div>}
    {word.extra && <p className="wl-small">{word.extra}</p>}
    {word.caution && <p className="wl-caution"><b>정확성 주의</b> · {word.caution}</p>}
  </div>;
}

export default function WhiteLies() {
  const [area, setArea] = useState('syn-ant');
  const [amount, setAmount] = useState('all');
  const [screen, setScreen] = useState('setup');
  const [query, setQuery] = useState('');
  const [onlyUnknown, setOnlyUnknown] = useState(false);
  const [revealed, setRevealed] = useState({});
  const [revealAll, setRevealAll] = useState(false);
  const [saved, setSaved] = useState(readSaved);
  const [questions, setQuestions] = useState([]);
  const [position, setPosition] = useState(0);
  const [choice, setChoice] = useState(null);
  const [results, setResults] = useState([]);

  const known = saved.known || {};
  const knownCount = words.filter((w) => known[keyFor(w.id)]).length;
  const shownWords = words.filter((w) =>
    (!onlyUnknown || !known[keyFor(w.id)]) &&
    (!query.trim() || [w.word, w.meaning, w.answer, ...w.synonyms]
      .some((v) => v.toLowerCase().includes(query.trim().toLowerCase())))
  );
  const recent = saved.scores?.all;
  const score = results.filter((r) => r.ok).length;
  const wrong = results.filter((r) => !r.ok);

  function jump(target) { setScreen(target); window.scrollTo(0, 0); }
  function changeArea(value) { setArea(value); jump('setup'); }
  function toggleKnown(id) {
    const updated = { ...saved, known: { ...known, [keyFor(id)]: !known[keyFor(id)] } };
    setSaved(updated); writeSaved(updated);
  }
  function start(items = createWhiteLiesTest(words, amount)) {
    if (!items.length) return;
    setQuestions(items); setPosition(0); setChoice(null); setResults([]);
    jump('quiz');
  }
  function answer(value) {
    if (choice !== null) return;
    setChoice(value);
    const current = questions[position];
    setResults((prev) => [...prev, { question: current, answer: value, ok: value === current.answer }]);
  }
  function next() {
    if (position < questions.length - 1) {
      setPosition((n) => n + 1); setChoice(null); return;
    }
    const currentRecord = { correct: results.filter((r) => r.ok).length, total: results.length, date: new Date().toISOString() };
    const updated = { ...saved, scores: { ...(saved.scores || {}), all: currentRecord } };
    setSaved(updated); writeSaved(updated); jump('result');
  }
  function retryWrong() { start(shuffle(wrong.map((r) => r.question))); }
  const current = questions[position];

  return <section className="panel wl-section">
    <div className="section-heading"><span className="eyebrow">WHITE LIES · VOCABULARY</span><h2>White Lies 암기 체크</h2></div>
    <div className="wl-area-tabs" role="tablist" aria-label="White Lies 학습 영역">
      <button type="button" role="tab" aria-selected={area === 'syn-ant'} className={area === 'syn-ant' ? 'selected' : ''} onClick={() => changeArea('syn-ant')}>유의어/반의어 체크</button>
      <button type="button" role="tab" aria-selected={area === 'definition'} className={area === 'definition' ? 'selected' : ''} onClick={() => changeArea('definition')}>영영풀이 체크</button>
    </div>
    {area === 'definition' ? <div className="wl-pending">
      <h3>영영풀이 자료 등록 예정</h3>
      <p>영영풀이 자료를 받으면 이 영역에 <strong>단어 ↔ 영영풀이 4지선다 · 정답 해석 · 오답 재시험</strong> 기능을 추가합니다.</p>
      <p className="muted">현재는 문제를 임의로 생성하지 않았습니다. 유의어 시험에는 영향을 주지 않습니다.</p>
    </div> : <>
      {screen === 'setup' && <>
        <div className="form-grid wl-form">
          <label>시험 유형
            <select value="syn" disabled aria-label="유의어 시험 유형"><option value="syn">유의어 객관식 (4지선다)</option></select>
          </label>
          <label>문항 수
            <select value={amount} onChange={(e) => setAmount(e.target.value)}>
              <option value="all">전체 {words.length}문제</option>
              {[10, 20, 30].filter((n) => n <= words.length).map((n) => <option value={n} key={n}>랜덤 {n}문제</option>)}
            </select>
          </label>
        </div>
        <p className="muted">통합 범위 <strong>{words.length}개</strong> · 출제 영역 <strong>유의어</strong><br />
          모든 학급의 필기 및 인쇄 단서를 합친 통합본입니다. 중복 유의어는 한 번만 표시합니다.</p>
        <p className="wl-info">제공한 자료에 <b>독립적인 반의어 항목은 없으므로</b> 현재 반의어 문제는 출제하지 않습니다. 정확하지 않은 필기 표현은 원문대로 보존하고, 대표 유의어를 정답으로 사용합니다.</p>
        <div className="button-row">
          <button className="primary" onClick={() => start()}>유의어 시험 시작 →</button>
          <button className="secondary" onClick={() => jump('study')}>통합 유의어 암기장</button>
        </div>
        {recent && <div className="last-score"><span>이 기기에 저장된 통합 범위 최근 성적</span><strong>{recent.correct} / {recent.total}문제 · {Math.round(100 * recent.correct / recent.total)}%</strong><small>{new Date(recent.date).toLocaleString('ko-KR')}</small></div>}
      </>}
      {screen === 'study' && <>
        <h3>통합 유의어 암기장</h3>
        <p className="muted">단어를 보고 유의어를 떠올린 뒤 펼쳐 확인하세요. 모든 필기를 합쳐 중복 없이 보여 줍니다.</p>
        <div className="study-toolbar">
          <input type="text" placeholder="단어·뜻·유의어 검색" aria-label="단어 검색" value={query} onChange={(e) => setQuery(e.target.value)} />
          <label className="inline-check"><input type="checkbox" checked={onlyUnknown} onChange={(e) => setOnlyUnknown(e.target.checked)} />미암기만</label>
          <button className="secondary" onClick={() => setRevealAll((x) => !x)}>{revealAll ? '전체 가리기' : '전체 펼치기'}</button>
        </div>
        <div className="study-count">통합 {words.length}개 · 암기 완료 {knownCount}개 · 현재 {shownWords.length}개</div>
        <div className="study-grid">
          {shownWords.map((w) => <article className="study-card" key={w.id}>
            <span className="study-source">{w.id.replace('wl-', '#')}</span>
            <button type="button" className="study-reveal wl-study-button" aria-expanded={revealed[w.id] ?? revealAll} onClick={() => setRevealed((p) => ({ ...p, [w.id]: !(p[w.id] ?? revealAll) }))}>
              <strong>{w.word}</strong>
              {revealed[w.id] ?? revealAll ? <span className="study-answer"><b>{w.meaning}</b><br />대표 유의어: <b>{w.answer}</b></span> : <small>눌러서 유의어 확인</small>}
            </button>
            {(revealed[w.id] ?? revealAll) && <SchoolNotes word={w} />}
            <label className="inline-check"><input type="checkbox" checked={!!known[keyFor(w.id)]} onChange={() => toggleKnown(w.id)} />암기 완료</label>
          </article>)}
        </div>
        {shownWords.length === 0 && <p className="muted">해당 조건에 맞는 어휘가 없습니다.</p>}
        <div className="button-row"><button className="secondary" onClick={() => jump('setup')}>시험 설정으로</button><button className="primary" onClick={() => start()}>통합 범위 시험 시작 →</button></div>
      </>}
      {screen === 'quiz' && current && <>
        <div className="quiz-top"><span className="eyebrow">SYNONYM QUIZ</span><span>{position + 1} / {questions.length}</span></div>
        <div className="progress"><div style={{ width: `${100 * (position + 1) / questions.length}%` }} /></div>
        <div className="quiz-top tiny"><span>통합 · {current.word.id.replace('wl-', '#')}</span><span>정답 {score}개</span></div>
        <span className="type-pill">유의어 고르기</span>
        <h2 className="question-word">{current.word.word}</h2>
        <p className="muted">다음 중 문맥상 가장 적절한 <strong>유의어</strong>는?</p>
        <div className="options">
          {current.options.map((option, i) => <button type="button" key={option} className={`option ${choice !== null && option === current.answer ? 'correct' : choice === option ? 'incorrect' : ''}`} disabled={choice !== null} onClick={() => answer(option)}><span className="option-index">{['①', '②', '③', '④'][i]}</span><span>{option}</span></button>)}
        </div>
        {choice !== null && <div className="feedback" aria-live="polite">
          <h3>{choice === current.answer ? '✓ 정답입니다' : '✕ 오답입니다'}</h3>
          <dl><dt>뜻</dt><dd>{current.word.meaning}</dd><dt>대표 유의어</dt><dd>{current.answer}</dd></dl>
          <h4>통합 유의어 확인</h4>
          <SchoolNotes word={current.word} />
        </div>}
        {choice !== null && <button className="primary" onClick={next}>{position === questions.length - 1 ? '채점 결과 확인' : '다음 문제 →'}</button>}
      </>}
      {screen === 'result' && <>
        <div className="section-heading"><span className="eyebrow">RESULT</span><h2>유의어 시험 결과</h2></div>
        <div className="result-overview">
          <div><strong className="score-big">{results.length ? Math.round(100 * score / results.length) : 0}<small>%</small></strong><span>정답률</span></div>
          <div><strong>{score} / {results.length}</strong><span>정답 문항</span></div>
          <div><strong>{wrong.length}</strong><span>오답 문항</span></div>
        </div>
        <div className="button-row"><button className="primary" disabled={!wrong.length} onClick={retryWrong}>오답만 재시험</button><button className="secondary" onClick={() => jump('setup')}>새 시험 설정</button><button className="secondary" onClick={() => window.print()}>결과 인쇄</button></div>
        <h3>오답 복습</h3>
        <div className="wrong-answers">
          {wrong.length ? wrong.map((r, i) => <article className="wrong-item" key={r.question.id}>
            <div className="wrong-title"><b>{i + 1}. {r.question.word.word}</b><span>유의어</span></div>
            <p><b>선택한 답:</b> {r.answer}</p><p><b>정답:</b> {r.question.answer}</p><p><b>뜻:</b> {r.question.word.meaning}</p>
            <SchoolNotes word={r.question.word} />
          </article>) : <p className="muted">모든 문제를 맞혔습니다!</p>}
        </div>
      </>}
    </>}
  </section>;
}
