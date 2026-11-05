import { useState } from 'react';
import QuizSetup from './components/QuizSetup.jsx';
import Quiz from './components/Quiz.jsx';
import QuizResult from './components/QuizResult.jsx';
import { missedQuestions } from './components/WrongAnswers.jsx';
import { vocabulary } from './data/vocabulary.js';
import { makeQuestions, chapterOf } from './utils/quiz.js';

const KEY = 'animal-farm-vocab-last-result-v1';
function loadHistory() {
  try {
    const result = JSON.parse(localStorage.getItem(KEY));
    return result && result.total > 0 ? result : null;
  } catch { return null; }
}

export default function App() {
  const [settings, setSettings] = useState({ chapter: 'all', mode: 'mixed', amount: 'all' });
  const [screen, setScreen] = useState('setup');
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState(loadHistory);

  function begin(items) {
    if (!items.length) return;
    setQuestions(items);
    setIndex(0);
    setResults([]);
    setScreen('quiz');
    window.scrollTo(0, 0);
  }

  function start() {
    const words = vocabulary.filter((w) => settings.chapter === 'all' || chapterOf(w) === Number(settings.chapter));
    begin(makeQuestions(words, settings.mode, settings.amount));
  }

  function answer(entry) {
    setResults((prev) => [...prev, entry]);
  }

  function next() {
    if (index < questions.length - 1) {
      setIndex((prev) => prev + 1);
    } else {
      const record = {
        correct: results.filter((r) => r.ok).length,
        total: questions.length,
        date: new Date().toISOString(),
      };
      try { localStorage.setItem(KEY, JSON.stringify(record)); } catch { /* 저장 차단 시에도 시험 진행 */ }
      setHistory(record);
      setScreen('result');
      window.scrollTo(0, 0);
    }
  }

  return <div className="app">
    <header className="hero">
      <div className="hero-inner"><span className="brand">OPTIMUM ENGLISH · VOCAB LAB</span>
        <h1>Animal Farm<br /><em>어휘 암기 체크</em></h1>
        <p>Chapter 1 · 5 · 7 | 총 43개 어휘<br />뜻 · 유의어 · 영영풀이 4지선다 평가</p>
      </div>
    </header>
    <main className="content">
      {screen === 'setup' && <QuizSetup settings={settings} setSettings={setSettings} history={history} onStart={start} />}
      {screen === 'quiz' && questions[index] && <Quiz
        key={questions[index].id + '-' + index} question={questions[index]} index={index}
        total={questions.length} correct={results.filter((r) => r.ok).length}
        onAnswer={answer} onNext={next}
      />}
      {screen === 'result' && <QuizResult results={results}
        onRedo={() => begin(missedQuestions(results))}
        onRestart={() => { setScreen('setup'); window.scrollTo(0, 0); }} />}
      <footer>학생별 점수는 서버로 전송되지 않습니다. 최근 성적만 현재 브라우저에 보관됩니다.<br />학교 필기는 원본 메모를 옮긴 내용으로 일부 표현이 부정확할 수 있습니다.</footer>
    </main>
  </div>;
}
