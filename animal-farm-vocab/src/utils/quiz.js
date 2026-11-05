export const categories = {
  meaning: '뜻',
  syn: '유의어',
  definition: '영영풀이',
};

export function shuffle(items) {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function makeQuestions(words, mode, amount) {
  const fields = mode === 'mixed' ? Object.keys(categories) : [mode];
  const questions = shuffle(words.flatMap((word) =>
    fields.map((field) => ({ id: `${word.id}-${field}`, word, field }))
  ));
  return amount === 'all' ? questions : questions.slice(0, Number(amount));
}

export function makeOptions(question, allWords) {
  const { word, field } = question;
  const right = word[field];
  const distractors = shuffle(
    [...new Set(allWords.filter((item) => item.id !== word.id).map((item) => item[field]))]
      .filter((answer) => answer && answer !== right && answer !== '—')
  ).slice(0, 3);
  return shuffle([right, ...distractors]);
}

export function chapterOf(word) {
  return Number(word.chapter.match(/Chapter (\d+)/)?.[1]);
}
