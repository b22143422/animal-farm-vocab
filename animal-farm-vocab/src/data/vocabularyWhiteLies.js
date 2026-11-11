import { shuffle } from '../utils/quiz.js';

// White Lies 36개 통합본: 전체 학교 필기 + 공통/인쇄 + 자료 간 연결의 합집합.
// 중복되는 유의어는 한 번만 저장합니다. 현재 제공된 자료에는 독립적인 반의어가 없습니다.
// 'answer'는 객관식 채점용 대표 유의어입니다. 필기상 부정확한 표현은
// synonyms에 원문대로 남기고 caution으로 구분합니다.
export const vocabularyWhiteLies = [
  {
    "id": "wl-01",
    "chapter": "White Lies",
    "word": "lie",
    "meaning": "거짓말",
    "part": "noun",
    "answer": "untruth",
    "synonyms": [
      "fibs",
      "falsehood",
      "deception",
      "deceit",
      "untruth"
    ],
    "group": "deceit"
  },
  {
    "id": "wl-02",
    "chapter": "White Lies",
    "word": "majority",
    "meaning": "대부분, 대다수",
    "part": "noun",
    "answer": "most",
    "synonyms": [
      "most"
    ]
  },
  {
    "id": "wl-03",
    "chapter": "White Lies",
    "word": "notion",
    "meaning": "생각, 개념",
    "part": "noun",
    "answer": "idea",
    "synonyms": [
      "idea"
    ]
  },
  {
    "id": "wl-04",
    "chapter": "White Lies",
    "word": "falsehood",
    "meaning": "거짓말",
    "part": "noun",
    "answer": "a lie",
    "synonyms": [
      "a lie"
    ],
    "group": "deceit"
  },
  {
    "id": "wl-05",
    "chapter": "White Lies",
    "word": "disheartening",
    "meaning": "낙담하게 하는",
    "part": "adj",
    "answer": "discouraging",
    "synonyms": [
      "sad",
      "depressive"
    ],
    "caution": "sad는 의미가 넓고 depressive는 자연스러운 직접 유의어로 보기 어렵습니다. 정확한 유의어는 discouraging / dispiriting입니다."
  },
  {
    "id": "wl-06",
    "chapter": "White Lies",
    "word": "take solace",
    "meaning": "위안을 얻다",
    "part": "verb",
    "answer": "take comfort",
    "synonyms": [
      "get hope",
      "have hope",
      "take comfort"
    ],
    "caution": "get hope / have hope는 직접적인 유의 표현이 아닙니다. take comfort가 정확합니다."
  },
  {
    "id": "wl-07",
    "chapter": "White Lies",
    "word": "criteria",
    "meaning": "기준들",
    "part": "noun",
    "answer": "standards",
    "synonyms": [
      "standard"
    ],
    "caution": "criteria는 복수형이므로 정확하게 대응시키려면 standards가 적절합니다."
  },
  {
    "id": "wl-08",
    "chapter": "White Lies",
    "word": "indicate",
    "meaning": "나타내다",
    "part": "verb",
    "answer": "show",
    "synonyms": [
      "show"
    ]
  },
  {
    "id": "wl-09",
    "chapter": "White Lies",
    "word": "inconsequential",
    "meaning": "중요하지 않은",
    "part": "adj",
    "answer": "unimportant",
    "synonyms": [
      "unimportant",
      "trivial"
    ],
    "group": "unimportant"
  },
  {
    "id": "wl-10",
    "chapter": "White Lies",
    "word": "documented",
    "meaning": "기록된",
    "part": "adj",
    "answer": "recorded",
    "synonyms": [
      "been recorded",
      "written down"
    ]
  },
  {
    "id": "wl-11",
    "chapter": "White Lies",
    "word": "manners",
    "meaning": "예절, 행동 방식",
    "part": "noun",
    "answer": "conduct",
    "synonyms": [
      "behavior",
      "conduct"
    ]
  },
  {
    "id": "wl-12",
    "chapter": "White Lies",
    "word": "British",
    "meaning": "영국의",
    "part": "adj",
    "answer": "of Britain",
    "synonyms": [
      "English"
    ],
    "caution": "British는 영국 전체, English는 잉글랜드를 가리킵니다. 항상 동일하게 바꿀 수는 없습니다."
  },
  {
    "id": "wl-13",
    "chapter": "White Lies",
    "word": "gratify",
    "meaning": "만족시키다",
    "part": "verb",
    "answer": "satisfy",
    "synonyms": [
      "satisfy"
    ]
  },
  {
    "id": "wl-14",
    "chapter": "White Lies",
    "word": "purity",
    "meaning": "순수함, 순결함",
    "part": "noun",
    "answer": "innocence",
    "synonyms": [
      "innocence"
    ]
  },
  {
    "id": "wl-15",
    "chapter": "White Lies",
    "word": "deception",
    "meaning": "속임, 기만",
    "part": "noun",
    "answer": "dishonesty",
    "synonyms": [
      "dishonesty",
      "fraud",
      "lying"
    ],
    "group": "deceit",
    "extra": "deception은 lie와 의미가 겹치는 관련 유의어입니다."
  },
  {
    "id": "wl-16",
    "chapter": "White Lies",
    "word": "censor",
    "meaning": "검열하다, 걸러 내다",
    "part": "verb",
    "answer": "suppress",
    "synonyms": [
      "suppress",
      "block",
      "edit",
      "change"
    ],
    "caution": "edit / change는 의미가 넓으며, 본문 문맥에서는 suppress / block이 더 적절합니다."
  },
  {
    "id": "wl-17",
    "chapter": "White Lies",
    "word": "circumvent",
    "meaning": "피하다, 우회하다",
    "part": "verb",
    "answer": "avoid",
    "synonyms": [
      "go around",
      "avoid"
    ],
    "extra": "“to avoid a rule”은 영영풀이 형식이어서 유의어 목록에서 제외했습니다."
  },
  {
    "id": "wl-18",
    "chapter": "White Lies",
    "word": "inevitable",
    "meaning": "피할 수 없는",
    "part": "adj",
    "answer": "unavoidable",
    "synonyms": [
      "unavoidable"
    ]
  },
  {
    "id": "wl-19",
    "chapter": "White Lies",
    "word": "capacity",
    "meaning": "능력",
    "part": "noun",
    "answer": "ability",
    "synonyms": [
      "ability"
    ]
  },
  {
    "id": "wl-20",
    "chapter": "White Lies",
    "word": "fashion",
    "meaning": "만들다, 지어내다",
    "part": "verb",
    "answer": "make",
    "synonyms": [
      "make",
      "craft"
    ]
  },
  {
    "id": "wl-21",
    "chapter": "White Lies",
    "word": "unqualified",
    "meaning": "자격이 없는, 부적합한",
    "part": "adj",
    "answer": "unfit",
    "synonyms": [
      "unfit",
      "incompetent"
    ]
  },
  {
    "id": "wl-22",
    "chapter": "White Lies",
    "word": "consideration",
    "meaning": "배려",
    "part": "noun",
    "answer": "thoughtfulness",
    "synonyms": [
      "thoughtfulness"
    ]
  },
  {
    "id": "wl-23",
    "chapter": "White Lies",
    "word": "dull",
    "meaning": "지루한",
    "part": "adj",
    "answer": "boring",
    "synonyms": [
      "boring"
    ]
  },
  {
    "id": "wl-24",
    "chapter": "White Lies",
    "word": "protect",
    "meaning": "보호하다",
    "part": "verb",
    "answer": "shield",
    "synonyms": [
      "guard",
      "shield"
    ]
  },
  {
    "id": "wl-25",
    "chapter": "White Lies",
    "word": "ego",
    "meaning": "자아",
    "part": "noun",
    "answer": "self",
    "synonyms": [
      "self",
      "identity"
    ]
  },
  {
    "id": "wl-26",
    "chapter": "White Lies",
    "word": "stability",
    "meaning": "안정성",
    "part": "noun",
    "answer": "security",
    "synonyms": [
      "balance",
      "security"
    ]
  },
  {
    "id": "wl-27",
    "chapter": "White Lies",
    "word": "intent",
    "meaning": "의도",
    "part": "noun",
    "answer": "purpose",
    "synonyms": [
      "purpose"
    ]
  },
  {
    "id": "wl-28",
    "chapter": "White Lies",
    "word": "malicious",
    "meaning": "악의적인",
    "part": "adj",
    "answer": "spiteful",
    "synonyms": [
      "mean",
      "spiteful"
    ]
  },
  {
    "id": "wl-29",
    "chapter": "White Lies",
    "word": "benign",
    "meaning": "해롭지 않은, 악의 없는",
    "part": "adj",
    "answer": "harmless",
    "synonyms": [
      "harmless",
      "not harmful"
    ],
    "caution": "not harmful은 뜻을 풀어 쓴 표현이므로, 객관식 대표 유의어는 harmless로 표시합니다."
  },
  {
    "id": "wl-30",
    "chapter": "White Lies",
    "word": "consequence",
    "meaning": "결과",
    "part": "noun",
    "answer": "result",
    "synonyms": [
      "result",
      "effect"
    ]
  },
  {
    "id": "wl-31",
    "chapter": "White Lies",
    "word": "trivial",
    "meaning": "사소한, 중요하지 않은",
    "part": "adj",
    "answer": "not important",
    "synonyms": [
      "not important",
      "not serious",
      "inconsequential",
      "unimportant"
    ],
    "group": "unimportant"
  },
  {
    "id": "wl-32",
    "chapter": "White Lies",
    "word": "benefit",
    "meaning": "이롭게 하다",
    "part": "verb",
    "answer": "help",
    "synonyms": [
      "advantage"
    ],
    "caution": "본문의 benefit은 동사입니다. 인쇄된 advantage는 주로 명사이므로 동사 benefit의 직접적인 대체어는 help가 자연스럽습니다."
  },
  {
    "id": "wl-33",
    "chapter": "White Lies",
    "word": "objectionable",
    "meaning": "불쾌한, 받아들이기 어려운",
    "part": "adj",
    "answer": "unacceptable",
    "synonyms": [
      "unacceptable",
      "offensive"
    ]
  },
  {
    "id": "wl-34",
    "chapter": "White Lies",
    "word": "socially",
    "meaning": "사회적으로",
    "part": "adv",
    "answer": "in society",
    "synonyms": [
      "publicly"
    ],
    "caution": "socially(사회적으로)와 publicly(공개적으로)는 의미가 달라 항상 교체할 수 없습니다."
  },
  {
    "id": "wl-35",
    "chapter": "White Lies",
    "word": "bear in mind",
    "meaning": "명심하다, 기억해 두다",
    "part": "verb",
    "answer": "keep in mind",
    "synonyms": [
      "remember",
      "keep in mind"
    ]
  },
  {
    "id": "wl-36",
    "chapter": "White Lies",
    "word": "perspective",
    "meaning": "관점",
    "part": "noun",
    "answer": "viewpoint",
    "synonyms": [
      "viewpoint",
      "outlook"
    ]
  }
];

export function createWhiteLiesTest(words, amount = 'all') {
  const chosen = shuffle(words).slice(0, amount === 'all' ? words.length : Number(amount));
  return chosen.map((w) => {
    const answer = w.answer;
    // lie/falsehood/deception 등 의미가 겹치는 단어군은 오답 선지에서 제외.
    const candidates = words.filter((other) => other.id !== w.id && (!w.group || w.group !== other.group));
    const matching = shuffle(candidates.filter((other) => other.part === w.part));
    const remainder = shuffle(candidates.filter((other) => other.part !== w.part));
    const incorrect = [...matching, ...remainder].map((other) => other.answer)
      .filter((option) => option !== answer);
    const options = shuffle([...new Set([answer, ...incorrect])].slice(0, 4));
    return { id: w.id, word: w, answer, options, type: 'syn' };
  });
}
