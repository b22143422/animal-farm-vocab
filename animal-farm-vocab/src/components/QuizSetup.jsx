import { vocabulary } from '../data/vocabulary.js';
import { vocabularyLite } from '../data/vocabularyLite.js';
import { vocabularyLiterature } from '../data/vocabularyLiterature.js';
import { vocabularyWonder } from '../data/vocabularyWonder.js';
import { chapterOf, selectLiteWords, selectLiteratureWords } from '../utils/quiz.js';

const units = [
  { value: 'all', label: '전체 35개 지문' },
  { value: '8', label: '8강 · Exercise 4' },
  { value: '9', label: '9강 · Exercise 1~4' },
  { value: '10', label: '10강 · Exercise 1~4' },
  { value: '11', label: '11강 · Exercise 1~4' },
  { value: '12', label: '12강 · Exercise 1~4' },
  { value: 'mini', label: 'Mini Test 3 · 수록 18지문' }
];
const literatureWords = [...vocabularyLiterature, ...vocabularyWonder];
const works = [
  { value: 'tempest', label: 'The Tempest' },
  { value: 'giver', label: 'The Giver' },
  { value: 'wonder', label: 'Wonder' }
];

export default function QuizSetup({ book, settings, setSettings, onStart, onStudy, history }) {
  const isAnimal = book === 'animal';
  const isLite = book === 'lite';
  const isLiterature = book === 'literature';
  const filtered = isAnimal
    ? vocabulary.filter((w) => settings.chapter === 'all' || chapterOf(w) === Number(settings.chapter))
    : isLite
      ? selectLiteWords(vocabularyLite, settings.unit, settings.passage)
      : selectLiteratureWords(literatureWords, settings.work, settings.passage);
  const allowedModes = isAnimal ? ['meaning', 'syn', 'definition'] : ['meaning', 'syn'];
  const maximum = filtered.length * (settings.mode === 'mixed' ? allowedModes.length : 1);
  const passagesLite = [...new Set(vocabularyLite.filter((w) => String(w.unit) === String(settings.unit)).map((w) => w.number))]
    .sort((a, b) => a - b);
  const passagesLiterature = [...new Set(literatureWords.filter((w) => w.work === settings.work).map((w) => w.number))]
    .sort((a, b) => a - b);
  const change = (key, value) => setSettings((prev) => ({ ...prev, [key]: value, amount: 'all' }));
  const changeUnit = (value) => setSettings((prev) => ({ ...prev, unit: value, passage: 'all', amount: 'all' }));
  const changeWork = (value) => setSettings((prev) => ({ ...prev, work: value, passage: 'all', amount: 'all' }));

  return <section className="panel">
    <div className="section-heading"><span className="eyebrow">01 · SETUP</span><h2>시험 설정</h2></div>
    <div className="form-grid">
      {isLite && <>
        <label>단원 선택
          <select value={settings.unit} onChange={(e) => changeUnit(e.target.value)}>
            {units.map((u) => <option value={u.value} key={u.value}>{u.label}</option>)}
          </select>
        </label>
        <label>지문 선택
          <select value={settings.passage} disabled={settings.unit === 'all'} onChange={(e) => change('passage', e.target.value)}>
            <option value="all">해당 단원 전체</option>
            {passagesLite.map((n) => <option value={n} key={n}>#{n}</option>)}
          </select>
        </label>
      </>}
      {isLiterature && <>
        <label>작품 선택
          <select value={settings.work} onChange={(e) => changeWork(e.target.value)}>
            {works.map((w) => <option key={w.value} value={w.value}>{w.label}</option>)}
          </select>
        </label>
        <label>본문 선택
          <select value={settings.passage} onChange={(e) => change('passage', e.target.value)}>
            <option value="all">전체 본문</option>
            {passagesLiterature.map((n) => <option value={n} key={n}>{settings.work === 'wonder' ? 'Part' : '본문'} {n}</option>)}
          </select>
        </label>
      </>}
      {isAnimal && <label>시험 범위
        <select value={settings.chapter} onChange={(e) => change('chapter', e.target.value)}>
          <option value="all">전체 43개</option>
          <option value="1">Chapter 1 · 14개</option>
          <option value="5">Chapter 5 · 10개</option>
          <option value="7">Chapter 7 · 19개</option>
        </select>
      </label>}
      <label>암기 영역
        <select value={settings.mode} onChange={(e) => change('mode', e.target.value)}>
          <option value="mixed">{isAnimal ? '통합 · 뜻 + 유의어 + 영영풀이' : '통합 · 뜻 + 유의어'}</option>
          <option value="meaning">뜻만</option>
          <option value="syn">유의어만</option>
          {isAnimal && <option value="definition">영영풀이만</option>}
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
      선택한 범위 <strong>{filtered.length}개 어휘</strong> · {settings.mode === 'mixed' ? '통합' : settings.mode === 'meaning' ? '뜻' : settings.mode === 'definition' ? '영영풀이' : '유의어'} <strong>{maximum}문제</strong> 출제 가능.
      {isLite && <><br />Mini Test 3의 8·10·11번은 제공 자료에 없어 미포함입니다.</>}
      {isLiterature && <><br />작품별로 따로 평가하며, 본문/Part별 학습도 가능합니다. {settings.work === 'wonder' && 'Wonder의 Part 5~7은 첨부 자료의 영어 줄거리 요약에서 어휘를 선정했습니다.'}</>}
      <br />문제와 보기 순서는 무작위입니다.
    </p>
    <div className="button-row">
      <button className="primary" disabled={!maximum} onClick={onStart}>시험 시작 <span aria-hidden="true">→</span></button>
      {!isAnimal && <button className="secondary" disabled={!filtered.length} onClick={onStudy}>유의어 암기장 보기</button>}
    </div>
    {history && <div className="last-score">
      <span>이 기기에 저장된 최근 시험</span>
      <strong>{history.correct} / {history.total}문제 · {Math.round(100 * history.correct / history.total)}%</strong>
      <small>{new Date(history.date).toLocaleString('ko-KR')}</small>
    </div>}
  </section>;
}
