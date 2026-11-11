import { shuffle } from '../utils/quiz.js';
// White Lies 영영풀이: [학습지] white lie - 4반 필기(1).pdf 마지막 2쪽의 인쇄된 Very Simple Meaning 35개
// 영문 정의는 인쇄물 그대로, 한국어 해석은 학습 편의를 위한 별도 번역.
export const whiteLiesDefinitions = [
  {
    "id": "wld-01",
    "word": "stability",
    "definition": "being steady and not changing suddenly",
    "translation": "안정적이며 갑자기 변하지 않는 상태",
    "part": "noun"
  },
  {
    "id": "wld-02",
    "word": "embellishing",
    "definition": "adding extra details to make something sound better or more interesting",
    "translation": "무언가가 더 좋아 보이거나 흥미롭게 들리도록 세부 사항을 덧붙이는 것",
    "part": "verb"
  },
  {
    "id": "wld-03",
    "word": "white",
    "definition": "a color; also sometimes connected with purity or innocence",
    "translation": "하나의 색깔이며, 때로 순수함이나 결백함과 연관되는 것",
    "part": "adj"
  },
  {
    "id": "wld-04",
    "word": "malicious",
    "definition": "wanting to hurt someone or cause trouble",
    "translation": "누군가를 해치거나 문제를 일으키려 하는",
    "part": "adj"
  },
  {
    "id": "wld-05",
    "word": "consideration",
    "definition": "thinking about other people and their feelings",
    "translation": "다른 사람과 그들의 감정을 생각하는 것",
    "part": "noun"
  },
  {
    "id": "wld-06",
    "word": "fibs",
    "definition": "small or unimportant lies",
    "translation": "작거나 중요하지 않은 거짓말들",
    "part": "noun"
  },
  {
    "id": "wld-07",
    "word": "maturity",
    "definition": "behaving in a responsible, adult-like way",
    "translation": "책임감 있고 어른스럽게 행동하는 것",
    "part": "noun"
  },
  {
    "id": "wld-08",
    "word": "harmony",
    "definition": "a peaceful situation where people get along",
    "translation": "사람들이 사이좋게 지내는 평화로운 상태",
    "part": "noun"
  },
  {
    "id": "wld-09",
    "word": "inconsequential",
    "definition": "not important; having little effect",
    "translation": "중요하지 않거나 영향이 거의 없는",
    "part": "adj"
  },
  {
    "id": "wld-10",
    "word": "protect",
    "definition": "to keep someone or something safe",
    "translation": "사람이나 사물을 안전하게 지키다",
    "part": "verb"
  },
  {
    "id": "wld-11",
    "word": "British",
    "definition": "relating to Britain or its people",
    "translation": "영국이나 영국 사람들과 관련된",
    "part": "adj"
  },
  {
    "id": "wld-12",
    "word": "deception",
    "definition": "trying to make someone believe something that is not true",
    "translation": "다른 사람이 사실이 아닌 것을 믿게 하려는 것",
    "part": "noun"
  },
  {
    "id": "wld-13",
    "word": "small",
    "definition": "little in size or amount",
    "translation": "크기나 양이 적은",
    "part": "adj"
  },
  {
    "id": "wld-14",
    "word": "consequence",
    "definition": "something that happens because of an action",
    "translation": "어떤 행동 때문에 일어나는 일",
    "part": "noun"
  },
  {
    "id": "wld-15",
    "word": "honest",
    "definition": "telling the truth; not lying",
    "translation": "진실을 말하고 거짓말하지 않는",
    "part": "adj"
  },
  {
    "id": "wld-16",
    "word": "morally",
    "definition": "in a way that relates to right and wrong",
    "translation": "옳고 그름에 관련된 방식으로",
    "part": "adv"
  },
  {
    "id": "wld-17",
    "word": "censor",
    "definition": "to remove or block something because it is considered inappropriate",
    "translation": "부적절하다고 여겨지는 것을 제거하거나 차단하다",
    "part": "verb"
  },
  {
    "id": "wld-18",
    "word": "benefit",
    "definition": "a good result or something helpful",
    "translation": "좋은 결과 또는 도움이 되는 것",
    "part": "noun"
  },
  {
    "id": "wld-19",
    "word": "falsehood",
    "definition": "a lie; something that is not true",
    "translation": "거짓말 또는 사실이 아닌 것",
    "part": "noun"
  },
  {
    "id": "wld-20",
    "word": "perspective",
    "definition": "the way someone sees or thinks about something",
    "translation": "누군가가 무언가를 바라보거나 생각하는 방식",
    "part": "noun"
  },
  {
    "id": "wld-21",
    "word": "despise",
    "definition": "to strongly dislike someone or something",
    "translation": "누군가나 무언가를 몹시 싫어하다",
    "part": "verb"
  },
  {
    "id": "wld-22",
    "word": "unqualified",
    "definition": "not having the skills or experience needed",
    "translation": "필요한 기술이나 경험을 갖추지 못한",
    "part": "adj"
  },
  {
    "id": "wld-23",
    "word": "real",
    "definition": "true or actually existing",
    "translation": "진짜이거나 실제로 존재하는",
    "part": "adj"
  },
  {
    "id": "wld-24",
    "word": "bending",
    "definition": "changing or breaking a rule a little",
    "translation": "규칙을 조금 바꾸거나 어기는 것",
    "part": "verb"
  },
  {
    "id": "wld-25",
    "word": "evil",
    "definition": "very bad or morally wrong",
    "translation": "매우 나쁘거나 도덕적으로 잘못된",
    "part": "adj"
  },
  {
    "id": "wld-26",
    "word": "socially",
    "definition": "in a way that involves people and society",
    "translation": "사람들과 사회에 관련되는 방식으로",
    "part": "adv"
  },
  {
    "id": "wld-27",
    "word": "harmful",
    "definition": "causing damage or hurt",
    "translation": "손해나 상처를 일으키는",
    "part": "adj"
  },
  {
    "id": "wld-28",
    "word": "distinction",
    "definition": "an important difference between two things",
    "translation": "두 가지 사이의 중요한 차이",
    "part": "noun"
  },
  {
    "id": "wld-29",
    "word": "ego",
    "definition": "how important someone thinks they are",
    "translation": "스스로를 얼마나 중요하게 생각하는지에 관한 자기 인식",
    "part": "noun"
  },
  {
    "id": "wld-30",
    "word": "serious",
    "definition": "important; not silly or joking",
    "translation": "중요하며 장난스럽거나 농담이 아닌",
    "part": "adj"
  },
  {
    "id": "wld-31",
    "word": "purity",
    "definition": "being clean or free from anything bad or unwanted",
    "translation": "깨끗하거나 나쁘고 원치 않는 것이 없는 상태",
    "part": "noun"
  },
  {
    "id": "wld-32",
    "word": "avoid",
    "definition": "to stay away from something",
    "translation": "무언가를 피하거나 멀리하다",
    "part": "verb"
  },
  {
    "id": "wld-33",
    "word": "uncomfortable",
    "definition": "not feeling relaxed and comfortable",
    "translation": "긴장이 풀리지 않고 편안하지 않은",
    "part": "adj"
  },
  {
    "id": "wld-34",
    "word": "motivates",
    "definition": "makes someone want to do something",
    "translation": "누군가가 어떤 일을 하고 싶게 만들다",
    "part": "verb"
  },
  {
    "id": "wld-35",
    "word": "manners",
    "definition": "polite ways of behaving",
    "translation": "예의 바르게 행동하는 방식들",
    "part": "noun"
  }
];

// 인쇄된 영영풀이 중에서 같은 품사의 정의를 우선 오답 보기로 활용합니다.
export function makeDefinitionQuestions(items, amount, direction) {
  const selected = shuffle(items).slice(0, amount === 'all' ? items.length : Number(amount));
  return selected.map((item) => {
    const answer = direction === 'word-to-definition' ? item.definition : item.word;
    const related = shuffle(items.filter((other) => other.id !== item.id && other.part === item.part));
    const remaining = shuffle(items.filter((other) => other.id !== item.id && other.part !== item.part));
    const distractors = [...related, ...remaining]
      .map((other) => direction === 'word-to-definition' ? other.definition : other.word)
      .filter((option) => option !== answer);
    const options = shuffle([...new Set([answer, ...distractors])].slice(0, 4));
    return { id: `${item.id}-${direction}`, word: item, answer, options, type: 'definition', direction };
  });
}

