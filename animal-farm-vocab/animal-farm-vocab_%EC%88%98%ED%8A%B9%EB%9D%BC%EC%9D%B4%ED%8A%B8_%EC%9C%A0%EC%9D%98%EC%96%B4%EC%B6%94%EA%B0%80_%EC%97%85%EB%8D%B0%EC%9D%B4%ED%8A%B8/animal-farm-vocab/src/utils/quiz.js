export const categories = { meaning: '뜻', syn: '유의어', definition: '영영풀이' };

export function shuffle(items) {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function makeQuestions(words, mode, amount, book = 'animal') {
  const available = book === 'lite' ? ['meaning', 'syn'] : ['meaning', 'syn', 'definition'];
  const fields = mode === 'mixed' ? available : [mode];
  const questions = shuffle(words.flatMap((word) => fields.map((field) => ({
    id: `${book}-${word.id}-${field}`, word, field, book
  }))));
  return amount === 'all' ? questions : questions.slice(0, Number(amount));
}

export function makeOptions(question, allWords) {
  const { word, field } = question;
  const right = word[field];
  // 보기에는 동일한 답을 중복 배치하지 않으며 현재 교재의 어휘만 활용한다.
  const unique = [...new Set(allWords.filter((item) => item.id !== word.id)
    .map((item) => item[field]).filter((v) => v && v !== right && v !== '—'))];
  return shuffle([right, ...shuffle(unique).slice(0, 3)]);
}

export function chapterOf(word) {
  return Number(word.chapter.match(/Chapter (\d+)/)?.[1]);
}

export function selectLiteWords(words, unit, passage) {
  return words.filter((w) =>
    (unit === 'all' || String(w.unit) === String(unit)) &&
    (passage === 'all' || String(w.number) === String(passage))
  );
}
