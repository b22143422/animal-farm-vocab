import { useState } from 'react';
import { createWhiteLiesTest, vocabularyWhiteLies } from '../data/vocabularyWhiteLies.js';
import { whiteLiesDefinitions, makeDefinitionQuestions } from '../data/vocabularyWhiteLiesDefinitions.js';
import { shuffle } from '../utils/quiz.js';

const STORE = 'optimum-white-lies-v1';
const areas = [
  { id: 'syn-ant', title: '유의어 / 반의어', note: '통합 필기 · 36개', icon: 'swap' },
  { id: 'definition', title: '영영풀이', note: '학습지 원문 · 35개', icon: 'book' }
];

function AreaIcon({ name }) {
  return name === 'swap'
    ? <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h15m-4-4 4 4-4 4M20 17H5m4-4-4 4 4 4" /></svg>
    : <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6.5a9 9 0 0 0-8-2V19a9 9 0 0 1 8 2m0-14.5a9 9 0 0 1 8-2V19a9 9 0 0 0-8 2M12 6.5V21" /></svg>;
}

// 예전 1반/4반/통합 암기 체크 기록을 기존 통합 데이터에 병합합니다.
function readSaved() {
  try {
    const value = JSON.parse(localStorage.getItem(STORE) || '{}') || {};
    const existing = value.known || {};
    const known = { ...existing };
    vocabularyWhiteLies.forEach(({ id }) => {
      if ([id, `all:${id}`, `one:${id}`, `four:${id}`].some((k) => existing[k])) known[`all:${id}`] = true;
    });
    return { ...value, known };
  } catch { return {}; }
}
function writeSaved(value) { try { localStorage.setItem(STORE, JSON.stringify(value)); } catch { /* 저장이 제한된 브라우저 */ } }
const wordKey = (item, area) => `${area === 'definition' ? 'definition' : 'all'}:${item.id}`;

function SchoolNotes({ word }) {
  const isAnswerListed = word.synonyms.includes(word.answer);
  return <div className="wl-notes">
    <div className="wl-note-row"><span className="wl-tag">통합 유의어</span><span>{word.synonyms.join(', ')}</span></div>
    {!isAnswerListed && <div className="wl-note-row"><span className="wl-tag">대표 유의어</span><span>{word.answer} <small>(채점 기준)</small></span></div>}
    {word.extra && <p className="wl-small">{word.extra}</p>}
    {word.caution && <p className="wl-caution"><b>정확성 주의</b> · {word.caution}</p>}
  </div>;
}

export default function WhiteLies() {
  const [area, setArea] = useState('syn-ant');
  const [amount, setAmount] = useState('all');
  const [direction, setDirection] = useState('word-to-definition');
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

  const isDefinition = area === 'definition';
  const words = isDefinition ? whiteLiesDefinitions : vocabularyWhiteLies;
  const known = saved.known || {};
  const knownCount = words.filter((w) => known[wordKey(w, area)]).length;
  const shownWords = words.filter((w) =>
    (!onlyUnknown || !known[wordKey(w, area)]) &&
    (!query.trim() || [w.word, ...(isDefinition ? [w.definition, w.translation] : [w.meaning, w.answer, ...w.synonyms])]
      .some((v) => v.toLowerCase().includes(query.trim().toLowerCase())))
  );
  const scoreKey = isDefinition ? `definition-${direction}` : 'all';
  const recent = saved.scores?.[scoreKey];
  const score = results.filter((r) => r.ok).length;
  const wrong = results.filter((r) => !r.ok);
  const current = questions[position];

  function jump(target) { setScreen(target); window.scrollTo(0, 0); }
  function changeArea(next) {
    setArea(next); setAmount('all'); setQuery(''); setOnlyUnknown(false);
    setRevealed({}); setRevealAll(false); jump('setup');
  }
  function toggleKnown(id) {
    const k = wordKey({ id }, area);
    const updated = { ...saved, known: { ...known, [k]: !known[k] } };
    setSaved(updated); writeSaved(updated);
  }
  function start(items) {
    const generated = items || (isDefinition
      ? makeDefinitionQuestions(words, amount, direction)
      : createWhiteLiesTest(words, amount));
    if (!generated.length) return;
    setQuestions(generated); setPosition(0); setChoice(null); setResults([]);
    jump('quiz');
  }
  function answer(value) {
    if (choice !== null) return;
    setChoice(value);
    const q = questions[position];
    setResults((prev) => [...prev, { question: q, answer: value, ok: value === q.answer }]);
  }
  function next() {
    if (position < questions.length - 1) { setPosition((n) => n + 1); setChoice(null); return; }
    const currentRecord = { correct: results.filter((r) => r.ok).length, total: results.length, date: new Date().toISOString() };
    const key = questions[0]?.type === 'definition' ? `definition-${questions[0].direction}` : 'all';
    const updated = { ...saved, scores: { ...(saved.scores || {}), [key]: currentRecord } };
    setSaved(updated); writeSaved(updated); jump('result');
  }
  function retryWrong() { start(shuffle(wrong.map((r) => r.question))); }

  return <section className="panel wl-section">
    <div className="section-heading wl-title"><span className="eyebrow">WHITE LIES · VOCABULARY</span><h2>White Lies 암기 체크</h2><p>학교 필기 통합본과 영영풀이를 각각 연습해 보세요.</p></div>
    <div className="wl-area-tabs" role="tablist" aria-label="White Lies 학습 영역">
      {areas.map((item, idx) => <button key={item.id} type="button" role="tab" aria-selected={area === item.id} className={`wl-area-button ${area === item.id ? 'selected' : ''}`} onClick={() => changeArea(item.id)}>
        <span className="wl-area-icon"><AreaIcon name={item.icon} /></span>
        <span className="wl-area-content"><strong>{item.title}</strong><small>{item.note}</small></span>
        <span className="wl-area-number">0{idx + 1}</span>
      </button>)}
    </div>

    {screen === 'setup' && <>
      <div className="wl-setup-heading"><div><h3>{isDefinition ? '영영풀이 체크' : '유의어 / 반의어 체크'}</h3><p>{isDefinition ? 'PDF 마지막 2페이지의 영영풀이 35개' : '반별 구분 없이 모든 필기를 합친 유의어 36개'}</p></div><span className="wl-count-badge">{words.length}개 어휘</span></div>
      <div className="form-grid wl-form">
        {isDefinition ? <label>출제 방향
          <select value={direction} onChange={(e) => setDirection(e.target.value)}>
            <option value="word-to-definition">영단어 → 영영풀이 고르기</option>
            <option value="definition-to-word">영영풀이 → 영단어 고르기</option>
          </select>
        </label> : <label>시험 유형
          <select value="syn" disabled aria-label="유의어 시험 유형"><option value="syn">유의어 객관식 (4지선다)</option></select>
        </label>}
        <label>문항 수
          <select value={amount} onChange={(e) => setAmount(e.target.value)}>
            <option value="all">전체 {words.length}문제</option>
            {[10, 20, 30].filter((n) => n <= words.length).map((n) => <option value={n} key={n}>랜덤 {n}문제</option>)}
          </select>
        </label>
      </div>
      {isDefinition ? <p className="wl-info">영어 정의는 제공된 학습지의 인쇄 문장을 그대로 사용했습니다. 한국어 해석은 이해를 돕기 위해 별도로 작성했습니다. 취소선이 있는 단어도 포함한 전체 35개입니다. 학습지의 benefit은 명사 뜻으로 풀이되어 있어, 유의어 통합본의 동사 뜻과 구분해야 합니다.</p> : <p className="wl-info">현재 제공된 통합 필기에는 독립적인 반의어 정답 목록이 없어, 우선 유의어 36개만 출제합니다. 의미상 부정확한 학교 필기는 해설에서 별도 안내합니다.</p>}
      <div className="button-row wl-actions"><button className="primary" onClick={() => start()}>{isDefinition ? '영영풀이 시험 시작' : '유의어 시험 시작'} →</button><button className="secondary" onClick={() => jump('study')}>{isDefinition ? '영영풀이 암기장' : '통합 유의어 암기장'}</button></div>
      {recent && <div className="last-score"><span>이 기기에 저장된 최근 성적</span><strong>{recent.correct} / {recent.total}문제 · {Math.round(100 * recent.correct / recent.total)}%</strong><small>{new Date(recent.date).toLocaleString('ko-KR')}</small></div>}
    </>}

    {screen === 'study' && <>
      <div className="wl-setup-heading"><div><h3>{isDefinition ? '영영풀이 암기장' : '통합 유의어 암기장'}</h3><p>{isDefinition ? '단어를 보고 영영풀이를 떠올린 뒤 펼쳐 확인하세요.' : '단어를 보고 유의어를 떠올린 뒤 펼쳐 확인하세요.'}</p></div></div>
      <div className="study-toolbar">
        <input type="text" placeholder={isDefinition ? '영단어·영영풀이·뜻 검색' : '단어·뜻·유의어 검색'} aria-label="단어 검색" value={query} onChange={(e) => setQuery(e.target.value)} />
        <label className="inline-check"><input type="checkbox" checked={onlyUnknown} onChange={(e) => setOnlyUnknown(e.target.checked)} />미암기만</label>
        <button className="secondary" onClick={() => setRevealAll((x) => !x)}>{revealAll ? '전체 가리기' : '전체 펼치기'}</button>
      </div>
      <div className="study-count">전체 {words.length}개 · 암기 완료 {knownCount}개 · 표시 {shownWords.length}개</div>
      <div className="study-grid">
        {shownWords.map((w, idx) => <article className="study-card" key={w.id}>
          <span className="study-source">{isDefinition ? `영영풀이 #${String(Number(w.id.slice(-2))).padStart(2, '0')}` : w.id.replace('wl-', '#')}</span>
          <button type="button" className="study-reveal wl-study-button" aria-expanded={revealed[w.id] ?? revealAll} onClick={() => setRevealed((p) => ({ ...p, [w.id]: !(p[w.id] ?? revealAll) }))}>
            <strong>{w.word}</strong>
            {revealed[w.id] ?? revealAll ? <span className="study-answer">{isDefinition ? <><b>{w.definition}</b><br /><span className="wl-translation">{w.translation}</span>{w.word === 'benefit' && <span className="wl-definition-warning">※ 학습지에서는 명사 뜻입니다.</span>}</> : <><b>{w.meaning}</b><br />대표 유의어: <b>{w.answer}</b></>}</span> : <small>눌러서 정답 확인</small>}
          </button>
          {!isDefinition && (revealed[w.id] ?? revealAll) && <SchoolNotes word={w} />}
          <label className="inline-check"><input type="checkbox" checked={!!known[wordKey(w, area)]} onChange={() => toggleKnown(w.id)} />암기 완료</label>
        </article>)}
      </div>
      {!shownWords.length && <p className="muted">조건에 맞는 어휘가 없습니다.</p>}
      <div className="button-row"><button className="secondary" onClick={() => jump('setup')}>시험 설정으로</button><button className="primary" onClick={() => start()}>{isDefinition ? '영영풀이' : '유의어'} 시험 시작 →</button></div>
    </>}

    {screen === 'quiz' && current && <>
      <div className="quiz-top"><span className="eyebrow">{isDefinition ? 'DEFINITION QUIZ' : 'SYNONYM QUIZ'}</span><span>{position + 1} / {questions.length}</span></div>
      <div className="progress"><div style={{ width: `${100 * (position + 1) / questions.length}%` }} /></div>
      <div className="quiz-top tiny"><span>{isDefinition ? '영영풀이' : '통합 유의어'} · {current.word.id.replace(isDefinition ? 'wld-' : 'wl-', '#')}</span><span>정답 {score}개</span></div>
      <span className="type-pill">{isDefinition ? (current.direction === 'word-to-definition' ? '영영풀이 고르기' : '영단어 고르기') : '유의어 고르기'}</span>
      <h2 className={`question-word ${isDefinition && current.direction === 'definition-to-word' ? 'wl-question-definition' : ''}`}>{isDefinition && current.direction === 'definition-to-word' ? current.word.definition : current.word.word}</h2>
      <p className="muted">다음 중 가장 적절한 {isDefinition ? (current.direction === 'word-to-definition' ? '영영풀이' : '영단어') : '유의어'}를 고르세요.</p>
      <div className={`options ${isDefinition ? 'wl-definition-options' : ''}`}>
        {current.options.map((option, i) => <button type="button" key={option} className={`option ${choice !== null && option === current.answer ? 'correct' : choice === option ? 'incorrect' : ''}`} disabled={choice !== null} onClick={() => answer(option)}><span className="option-index">{['①', '②', '③', '④'][i]}</span><span>{option}</span></button>)}
      </div>
      {choice !== null && <div className="feedback" aria-live="polite">
        <h3>{choice === current.answer ? '✓ 정답입니다' : '✕ 오답입니다'}</h3>
        {isDefinition ? <dl><dt>영단어</dt><dd>{current.word.word}</dd><dt>영영풀이</dt><dd>{current.word.definition}</dd><dt>한국어 해석</dt><dd>{current.word.translation}</dd>{current.word.word === 'benefit' && <><dt>주의</dt><dd>이 영영풀이는 benefit의 명사 뜻입니다. 유의어 통합본에서는 동사로 사용합니다.</dd></>}</dl> : <><dl><dt>뜻</dt><dd>{current.word.meaning}</dd><dt>대표 유의어</dt><dd>{current.answer}</dd></dl><h4>통합 유의어 확인</h4><SchoolNotes word={current.word} /></>}
      </div>}
      {choice !== null && <button className="primary" onClick={next}>{position === questions.length - 1 ? '채점 결과 확인' : '다음 문제 →'}</button>}
    </>}

    {screen === 'result' && <>
      <div className="section-heading"><span className="eyebrow">RESULT</span><h2>{isDefinition ? '영영풀이' : '유의어'} 시험 결과</h2></div>
      <div className="result-overview"><div><strong className="score-big">{results.length ? Math.round(100 * score / results.length) : 0}<small>%</small></strong><span>정답률</span></div><div><strong>{score} / {results.length}</strong><span>정답 문항</span></div><div><strong>{wrong.length}</strong><span>오답 문항</span></div></div>
      <div className="button-row"><button className="primary" disabled={!wrong.length} onClick={retryWrong}>오답만 재시험</button><button className="secondary" onClick={() => jump('setup')}>새 시험 설정</button><button className="secondary" onClick={() => window.print()}>결과 인쇄</button></div>
      <h3>오답 복습</h3>
      <div className="wrong-answers">{wrong.length ? wrong.map((r, i) => <article className="wrong-item" key={r.question.id}>
        <div className="wrong-title"><b>{i + 1}. {r.question.word.word}</b><span>{isDefinition ? '영영풀이' : '유의어'}</span></div>
        <p><b>선택한 답:</b> {r.answer}</p><p><b>정답:</b> {r.question.answer}</p>
        {isDefinition ? <><p><b>영영풀이:</b> {r.question.word.definition}</p><p><b>한국어 해석:</b> {r.question.word.translation}</p></> : <><p><b>뜻:</b> {r.question.word.meaning}</p><SchoolNotes word={r.question.word} /></>}
      </article>) : <p className="muted">모든 문제를 맞혔습니다!</p>}</div>
    </>}
  </section>;
}
