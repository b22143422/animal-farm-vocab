import { vocabulary } from '../data/vocabulary.js';
import { vocabularyLite } from '../data/vocabularyLite.js';
import { chapterOf, selectLiteWords } from '../utils/quiz.js';

const units = [
  { value: 'all', label: '전체 35개 지문' },
  { value: '8', label: '8강 · Exercise 4' },
  { value: '9', label: '9강 · Exercise 1~4' },
  { value: '10', label: '10강 · Exercise 1~4' },
  { value: '11', label: '11강 · Exercise 1~4' },
  { value: '12', label: '12강 · Exercise 1~4' },
  { value: 'mini', label: 'Mini Test 3 · 수록 18지문' }
];

export default function QuizSetup({ book, settings, setSettings, onStart, onStudy, history }) {
  const isLite = book === 'lite';
  const filtered = isLite
    ? selectLiteWords(vocabularyLite, settings.unit, settings.passage)
    : vocabulary.filter((w) => settings.chapter === 'all' || chapterOf(w) === Number(settings.chapter));
  const allowedModes = isLite ? ['meaning', 'syn'] : ['meaning', 'syn', 'definition'];
  const maximum = filtered.length * (settings.mode === 'mixed' ? allowedModes.length : 1);
  const passages = [...new Set(vocabularyLite.filter((w) => String(w.unit) === String(settings.unit)).map((w) => w.number))]
    .sort((a, b) => a - b);
  const change = (key, value) => setSettings((prev) => ({ ...prev, [key]: value, amount: 'all' }));
  const changeUnit = (value) => setSettings((prev) => ({ ...prev, unit: value, passage: 'all', amount: 'all' }));

  return <section className="panel">
    <div className="section-heading"><span className="eyebrow">01 · SETUP</span><h2>시험 설정</h2></div>
    <div className="form-grid">
      {isLite ? <>
        <label>단원 선택
          <select value={settings.unit} onChange={(e) => changeUnit(e.target.value)}>
            {units.map((u) => <option value={u.value} key={u.value}>{u.label}</option>)}
          </select>
        </label>
        <label>지문 선택
          <select value={settings.passage} disabled={settings.unit === 'all'} onChange={(e) => change('passage', e.target.value)}>
            <option value="all">해당 단원 전체</option>
            {passages.map((n) => <option value={n} key={n}>#{n}</option>)}
          </select>
        </label>
      </> : <label>시험 범위
        <select value={settings.chapter} onChange={(e) => change('chapter', e.target.value)}>
          <option value="all">전체 43개</option>
          <option value="1">Chapter 1 · 14개</option>
          <option value="5">Chapter 5 · 10개</option>
          <option value="7">Chapter 7 · 19개</option>
        </select>
      </label>}
      <label>암기 영역
        <select value={settings.mode} onChange={(e) => change('mode', e.target.value)}>
          <option value="mixed">{isLite ? '통합 · 뜻 + 유의어' : '통합 · 뜻 + 유의어 + 영영풀이'}</option>
          <option value="meaning">뜻만</option>
          <option value="syn">유의어만</option>
          {!isLite && <option value="definition">영영풀이만</option>}
        </select>
      </label>
      <label>문항 수
        <select value={settings.amount} onChange={(e) => change('amount', e.target.value)}>
          <option value="all">전체 {maximum}문제</option>
          {[10, 20, 30, 50, 100].filter((n) => n <= maximum).map((n) =>
            <option value={n} key={n}>랜덤 {n}문제</option>)}
        </select>
      </label>
    </div>
    <p className="muted">
      {isLite ? <>선택한 범위 <strong>{filtered.length}개 어휘</strong> · {settings.mode === 'mixed' ? '뜻·유의어 통합' : settings.mode === 'meaning' ? '뜻' : '유의어'} <strong>{maximum}문제</strong> 출제 가능.
        <br />Mini Test 3의 8·10·11번은 원본 PDF에 없어 미포함입니다.</>
        : <>통합 전체 시험은 43개 단어 × 3영역 = <strong>129문제</strong>입니다.</>}
      <br />문제와 보기 순서는 무작위입니다.
    </p>
    <div className="button-row">
      <button className="primary" disabled={!maximum} onClick={onStart}>시험 시작 <span aria-hidden="true">→</span></button>
      {isLite && <button className="secondary" onClick={onStudy}>유의어 암기장 보기</button>}
    </div>
    {history && <div className="last-score">
      <span>이 기기에 저장된 최근 시험</span>
      <strong>{history.correct} / {history.total}문제 · {Math.round(100 * history.correct / history.total)}%</strong>
      <small>{new Date(history.date).toLocaleString('ko-KR')}</small>
    </div>}
  </section>;
}
