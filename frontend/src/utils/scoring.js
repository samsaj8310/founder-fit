import { CATEGORIES, QUESTIONS } from '../data/questions'

export function generateSessionId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for non-secure environments/older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


export function generateDemoAnswers() {
  const ans = {}
  QUESTIONS.forEach(q => { ans[q.id] = Math.floor(Math.random() * q.opts.length) })
  return ans
}

export function computeScores(answersA, answersB) {
  const cats = Object.keys(CATEGORIES)
  const qByCat = {}
  cats.forEach(c => (qByCat[c] = []))
  QUESTIONS.forEach(q => qByCat[q.cat].push(q))
  const catScores = {}
  cats.forEach(cat => {
    const qs = qByCat[cat]
    let match = 0
    qs.forEach(q => {
      const a = answersA[q.id], b = answersB[q.id]
      if (a === undefined || b === undefined) { match += 0.5; return }
      const diff = Math.abs(a - b)
      match += diff === 0 ? 1 : diff === 1 ? 0.65 : diff === 2 ? 0.3 : 0
    })
    catScores[cat] = Math.round((match / qs.length) * 100)
  })
  const overall = Math.round(Object.values(catScores).reduce((a, b) => a + b, 0) / cats.length)
  return { catScores, overall }
}

export function getIndividualScores(answers) {
  const cats = Object.keys(CATEGORIES)
  const qByCat = {}
  cats.forEach(c => (qByCat[c] = []))
  QUESTIONS.forEach(q => qByCat[q.cat].push(q))
  const scores = {}
  cats.forEach(cat => {
    const qs = qByCat[cat]
    let sum = 0
    qs.forEach(q => {
      const a = answers[q.id]
      if (a === undefined) { sum += 50; return }
      sum += [100, 75, 50, 30][a]
    })
    scores[cat] = Math.round(sum / qs.length)
  })
  return scores
}
