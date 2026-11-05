// 틀린 문제만 복습할 때 사용할 목록 반환
export function missedQuestions(results) {
  return results.filter((entry) => !entry.ok).map((entry) => entry.question);
}
