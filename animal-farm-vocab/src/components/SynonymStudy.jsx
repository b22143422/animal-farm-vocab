import { useMemo, useState } from 'react';

const STORAGE_KEYS = {
  lite: 'light-erd-known-synonyms-v1',
  literature: 'english-literature-known-synonyms-v1'
};

function initialKnown(book) {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS[book]) || '{}'); }
  catch { return {}; }
}

export default function SynonymStudy({ book = 'lite', words, onBack, onTest }) {
  const [query, setQuery] = useState('');
  const [reveal, setReveal] = useState({});
  const [allOpen, setAllOpen] = useState(false);
  const [known, setKnown] = useState(() => initialKnown(book));
  const [onlyUnknown, setOnlyUnknown] = useState(false);
  const visible = useMemo(() => words.filter((w) =>
    (!onlyUnknown || !known[w.id]) && (!query.trim() || w.word.toLowerCase().includes(query.trim().toLowerCase()) ||
    w.meaning.includes(query.trim()) || w.chapter.toLowerCase().includes(query.trim().toLowerCase()))),
    [words, query, onlyUnknown, known]);
  const knownCount = words.filter((w) => known[w.id]).length;

  function toggleKnown(id) {
    setKnown((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem(STORAGE_KEYS[book], JSON.stringify(updated)); } catch { /* optional */ }
      return updated;
    });
  }

  return <section className="panel">
    <div className="section-heading"><span className="eyebrow">VOCABULARY STUDY</span><h2>유의어 암기장</h2></div>
    <p className="muted">단어를 보고 정답을 떠올린 다음 카드를 눌러 뜻과 유의어를 확인하세요.
      이 기기에서 '암기 완료' 표시를 저장합니다.</p>
    <div className="study-toolbar">
      <input aria-label="단어 검색" placeholder="영단어·뜻·지문 번호 검색" value={query} onChange={(e) => setQuery(e.target.value)} />
      <label className="inline-check"><input type="checkbox" checked={onlyUnknown} onChange={(e) => setOnlyUnknown(e.target.checked)} />미암기만</label>
      <button className="secondary" onClick={() => setAllOpen((x) => !x)}>{allOpen ? '전체 가리기' : '전체 답 보기'}</button>
    </div>
    <div className="study-count">선택 범위 {words.length}개 · 암기 완료 {knownCount}개 · 현재 표시 {visible.length}개</div>
    <div className="study-grid">
      {visible.map((w) => <article className="study-card" key={w.id}>
        <span className="study-source">{w.chapter}</span>
        <button className="study-reveal" onClick={() => setReveal((p) => ({ ...p, [w.id]: !(p[w.id] ?? allOpen) }))}>
          <strong>{w.word}</strong>
          {reveal[w.id] ?? allOpen ? <span className="study-answer"><b>{w.meaning}</b><br />유의어: {w.syn}</span> : <small>눌러서 답 확인</small>}
        </button>
        <label className="inline-check"><input type="checkbox" checked={!!known[w.id]} onChange={() => toggleKnown(w.id)} />암기 완료</label>
      </article>)}
    </div>
    {visible.length === 0 && <p className="muted">표시할 단어가 없습니다. 검색 조건을 변경하세요.</p>}
    <div className="button-row"><button className="secondary" onClick={onBack}>범위 설정으로</button>
      <button className="primary" onClick={onTest}>선택 범위 유의어 전체 시험 →</button></div>
  </section>;
}
