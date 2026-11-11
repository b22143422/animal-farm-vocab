import { useState } from 'react';
import QuizSetup from './components/QuizSetup.jsx';
import Quiz from './components/Quiz.jsx';
import QuizResult from './components/QuizResult.jsx';
import SynonymStudy from './components/SynonymStudy.jsx';
import { missedQuestions } from './components/WrongAnswers.jsx';
import { vocabulary } from './data/vocabulary.js';
import { vocabularyLite } from './data/vocabularyLite.js';
import { vocabularyLiterature } from './data/vocabularyLiterature.js';
import { vocabularyWonder } from './data/vocabularyWonder.js';
import { makeQuestions, chapterOf, selectLiteWords, selectLiteratureWords } from './utils/quiz.js';

const literatureWords = [...vocabularyLiterature, ...vocabularyWonder];

const HISTORY_KEY = {
  animal: 'animal-farm-vocab-last-result-v1',
  lite: 'light-erd-synonyms-last-result-v1',
  literature: 'english-literature-synonyms-last-result-v1'
};

function loadHistory(book) {
  try {
    const result = JSON.parse(localStorage.getItem(HISTORY_KEY[book]));
    return result && result.total > 0 ? result : null;
  } catch { return null; }
}

const initialSettings = (book) => ({
  chapter: 'all', unit: 'all', passage: 'all', work: 'tempest',
  mode: book === 'animal' ? 'mixed' : 'syn',
  amount: book === 'animal' ? 'all' : '20'
});

export default function App() {
  const [book, setBook] = useState('animal');
  const [settings, setSettings] = useState(() => initialSettings('animal'));
  const [screen, setScreen] = useState('setup');
  const [questions, setQuestions] = useState([]);
  const [optionPool, setOptionPool] = useState(vocabulary);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState({
    animal: loadHistory('animal'),
    lite: loadHistory('lite'),
    literature: loadHistory('literature')
  });

  const currentWords = book === 'animal'
    ? vocabulary.filter((w) => settings.chapter === 'all' || chapterOf(w) === Number(settings.chapter))
    : book === 'lite'
      ? selectLiteWords(vocabularyLite, settings.unit, settings.passage)
      : selectLiteratureWords(literatureWords, settings.work, settings.passage);

  function changeBook(nextBook) {
    setBook(nextBook);
    setSettings(initialSettings(nextBook));
    setScreen('setup');
    window.scrollTo(0, 0);
  }

  function begin(items, words = currentWords) {
    if (!items.length) return;
    setOptionPool(words);
    setQuestions(items);
    setIndex(0);
    setResults([]);
    setScreen('quiz');
    window.scrollTo(0, 0);
  }

  function start() { begin(makeQuestions(currentWords, settings.mode, settings.amount, book)); }
  function answer(entry) { setResults((prev) => [...prev, entry]); }
  function next() {
    if (index < questions.length - 1) { setIndex((prev) => prev + 1); return; }
    const record = {
      correct: results.filter((r) => r.ok).length,
      total: questions.length,
      date: new Date().toISOString()
    };
    try { localStorage.setItem(HISTORY_KEY[book], JSON.stringify(record)); } catch { /* optional */ }
    setHistory((old) => ({ ...old, [book]: record }));
    setScreen('result');
    window.scrollTo(0, 0);
  }

  const hero = book === 'animal'
    ? { heading: 'Animal Farm', subtitle: '어휘 암기 체크', detail: 'Chapter 1 · 5 · 7 | 43개 어휘 · 뜻·유의어·영영풀이' }
    : book === 'lite'
      ? { heading: '수특 라이트 영독연', subtitle: '유의어 암기 체크', detail: '8강 #4 · 9~12강 · Mini Test 3 | 35개 지문 · 핵심 유의어 296개' }
      : { heading: '영미문 교과서', subtitle: '유의어 암기 체크', detail: 'The Tempest · The Giver · Wonder | 작품별 · 본문/Part별 유의어 암기' };

  return <div className="app">
    <header className="hero"><div className="hero-inner">
      <span className="brand">OPTIMUM ENGLISH · VOCAB LAB</span>
      <h1>{hero.heading}<br /><em>{hero.subtitle}</em></h1>
      <p>{hero.detail}</p>
    </div></header>
    <main className="content">
      <nav className="book-nav" aria-label="교재 선택">
        <button type="button" className={book === 'animal' ? 'book-active' : ''} onClick={() => changeBook('animal')}>Animal Farm</button>
        <button type="button" className={book === 'lite' ? 'book-active' : ''} onClick={() => changeBook('lite')}>수특 라이트 영독연</button>
        <button type="button" className={book === 'literature' ? 'book-active' : ''} onClick={() => changeBook('literature')}>영미문 교과서</button>
      </nav>
      {screen === 'setup' && <QuizSetup book={book} settings={settings} setSettings={setSettings}
        history={history[book]} onStart={start}
        onStudy={() => { setScreen('study'); window.scrollTo(0, 0); }} />}
      {screen === 'study' && <SynonymStudy key={book} book={book} words={currentWords}
        onBack={() => { setScreen('setup'); window.scrollTo(0, 0); }}
        onTest={() => begin(makeQuestions(currentWords, 'syn', 'all', book))} />}
      {screen === 'quiz' && questions[index] && <Quiz key={questions[index].id + '-' + index}
        question={questions[index]} optionPool={optionPool} index={index} total={questions.length}
        correct={results.filter((r) => r.ok).length} onAnswer={answer} onNext={next} />}
      {screen === 'result' && <QuizResult results={results} book={book}
        onRedo={() => begin(missedQuestions(results), optionPool)}
        onRestart={() => { setScreen('setup'); window.scrollTo(0, 0); }} />}
      <footer>
        학생의 점수와 암기 완료 표시는 서버에 전송되지 않고 현재 기기에만 보관됩니다.
        {book === 'animal'
          ? <><br />학교 필기는 원본 메모를 옮긴 내용으로 일부 표현이 부정확할 수 있습니다.</>
          : book === 'lite'
            ? <><br />유의어는 첨부 본문의 문맥 기준으로 선정한 학습용 자료입니다. Mini Test 3의 8·10·11번은 원본 자료에 없어 제외했습니다.</>
            : <><br />영미문 교과서 어휘는 제공된 The Tempest / The Giver / Wonder 자료에서 단어를 선정했습니다. Wonder Part 5~7은 영어 줄거리 요약을 기준으로 합니다. 유의어는 문맥상 가까운 학습용 대표 표현이며 공식 유의어 목록은 아닙니다.</>}
      </footer>
    </main>
  </div>;
}
