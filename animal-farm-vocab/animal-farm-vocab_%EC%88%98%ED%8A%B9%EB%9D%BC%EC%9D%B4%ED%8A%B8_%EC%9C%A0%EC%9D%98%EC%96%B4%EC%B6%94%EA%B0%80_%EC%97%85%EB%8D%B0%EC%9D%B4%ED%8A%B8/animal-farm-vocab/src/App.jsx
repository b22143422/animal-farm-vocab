import { useState } from 'react';
import QuizSetup from './components/QuizSetup.jsx';
import Quiz from './components/Quiz.jsx';
import QuizResult from './components/QuizResult.jsx';
import SynonymStudy from './components/SynonymStudy.jsx';
import { missedQuestions } from './components/WrongAnswers.jsx';
import { vocabulary } from './data/vocabulary.js';
import { vocabularyLite } from './data/vocabularyLite.js';
import { makeQuestions, chapterOf, selectLiteWords } from './utils/quiz.js';

const KEY = 'animal-farm-vocab-last-result-v1';
const LITE_KEY = 'light-erd-synonyms-last-result-v1';
function loadHistory(book) {
  try {
    const result = JSON.parse(localStorage.getItem(book === 'lite' ? LITE_KEY : KEY));
    return result && result.total > 0 ? result : null;
  } catch { return null; }
}

export default function App() {
  const [book, setBook] = useState('animal');
  const [settings, setSettings] = useState({ chapter: 'all', unit: 'all', passage: 'all', mode: 'mixed', amount: 'all' });
  const [screen, setScreen] = useState('setup');
  const [questions, setQuestions] = useState([]);
  const [optionPool, setOptionPool] = useState(vocabulary);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [historyAnimal, setHistoryAnimal] = useState(() => loadHistory('animal'));
  const [historyLite, setHistoryLite] = useState(() => loadHistory('lite'));

  const currentWords = book === 'animal'
    ? vocabulary.filter((w) => settings.chapter === 'all' || chapterOf(w) === Number(settings.chapter))
    : selectLiteWords(vocabularyLite, settings.unit, settings.passage);

  function changeBook(nextBook) {
    setBook(nextBook);
    setSettings({ chapter: 'all', unit: 'all', passage: 'all', mode: nextBook === 'lite' ? 'syn' : 'mixed', amount: nextBook === 'lite' ? '20' : 'all' });
    setScreen('setup');
  }

  function begin(items, words = optionPool) {
    if (!items.length) return;
    setOptionPool(words);
    setQuestions(items);
    setIndex(0);
    setResults([]);
    setScreen('quiz');
    window.scrollTo(0, 0);
  }

  function start() { begin(makeQuestions(currentWords, settings.mode, settings.amount, book), currentWords); }
  function answer(entry) { setResults((prev) => [...prev, entry]); }
  function next() {
    if (index < questions.length - 1) { setIndex((prev) => prev + 1); return; }
    const record = {
      correct: results.filter((r) => r.ok).length,
      total: questions.length, date: new Date().toISOString(),
    };
    try { localStorage.setItem(book === 'lite' ? LITE_KEY : KEY, JSON.stringify(record)); } catch { /* optional */ }
    if (book === 'lite') setHistoryLite(record); else setHistoryAnimal(record);
    setScreen('result');
    window.scrollTo(0, 0);
  }

  return <div className="app">
    <header className="hero">
      <div className="hero-inner"><span className="brand">OPTIMUM ENGLISH · VOCAB LAB</span>
        <h1>{book === 'animal' ? <>Animal Farm<br /><em>어휘 암기 체크</em></> : <>수특 라이트 영독연<br /><em>유의어 암기 체크</em></>}</h1>
        <p>{book === 'animal' ? 'Chapter 1 · 5 · 7 | 43개 어휘 · 4지선다 평가' : '8강 #4 · 9~12강 · Mini Test 3 | 35개 지문 · 핵심 유의어 296개'}</p>
      </div>
    </header>
    <main className="content">
      <nav className="book-nav" aria-label="교재 선택">
        <button className={book === 'animal' ? 'book-active' : ''} onClick={() => changeBook('animal')}>Animal Farm</button>
        <button className={book === 'lite' ? 'book-active' : ''} onClick={() => changeBook('lite')}>수특 라이트 영독연</button>
      </nav>
      {screen === 'setup' && <QuizSetup book={book} settings={settings} setSettings={setSettings}
        history={book === 'animal' ? historyAnimal : historyLite} onStart={start}
        onStudy={() => { setScreen('study'); window.scrollTo(0, 0); }} />}
      {screen === 'study' && <SynonymStudy words={currentWords} onBack={() => setScreen('setup')}
        onTest={() => begin(makeQuestions(currentWords, 'syn', 'all', 'lite'), currentWords)} />}
      {screen === 'quiz' && questions[index] && <Quiz key={questions[index].id + '-' + index}
        question={questions[index]} optionPool={optionPool} index={index} total={questions.length}
        correct={results.filter((r) => r.ok).length} onAnswer={answer} onNext={next} />}
      {screen === 'result' && <QuizResult results={results} book={book}
        onRedo={() => begin(missedQuestions(results), optionPool)}
        onRestart={() => { setScreen('setup'); window.scrollTo(0, 0); }} />}
      <footer>학생의 점수는 서버에 전송되지 않고 현재 기기에만 보관됩니다.
        {book === 'lite' ? <><br />새 유의어 목록은 첨부 원문과 해석을 참고하여 만든 학습용 자료이며 출판사 공식 유의어 목록은 아닙니다. Mini Test 3의 8·10·11번은 제공 자료에 없어 제외했습니다.</> : <><br />학교 필기는 원본 메모를 옮긴 내용으로 일부 표현이 부정확할 수 있습니다.</>}
      </footer>
    </main>
  </div>;
}
