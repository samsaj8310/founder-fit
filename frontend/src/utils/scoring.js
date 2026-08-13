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

export function computeScores(...args) {
  let answerSets = []

  if (args.length === 1 && Array.isArray(args[0])) {
    answerSets = args[0].filter(ans => ans && typeof ans === 'object')
  } else if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
    answerSets = Object.values(args[0]).filter(ans => ans && typeof ans === 'object')
  } else {
    answerSets = args.filter(ans => ans && typeof ans === 'object')
  }

  // Fallback if empty or single set
  if (answerSets.length < 2) {
    const single = answerSets[0] || {}
    const cats = Object.keys(CATEGORIES)
    const catScores = {}
    cats.forEach(c => catScores[c] = 75)
    return { catScores, overall: 75 }
  }

  const cats = Object.keys(CATEGORIES)
  const qByCat = {}
  cats.forEach(c => (qByCat[c] = []))
  QUESTIONS.forEach(q => {
    if (qByCat[q.cat]) qByCat[q.cat].push(q)
  })

  // Generate all unique founder pairs (i, j)
  const pairs = []
  for (let i = 0; i < answerSets.length; i++) {
    for (let j = i + 1; j < answerSets.length; j++) {
      pairs.push([answerSets[i], answerSets[j]])
    }
  }

  const catScores = {}
  cats.forEach(cat => {
    const qs = qByCat[cat] || []
    if (qs.length === 0) {
      catScores[cat] = 70
      return
    }

    let totalMatchSum = 0
    pairs.forEach(([ansA, ansB]) => {
      qs.forEach(q => {
        const a = ansA[q.id], b = ansB[q.id]
        if (a === undefined || b === undefined) {
          totalMatchSum += 0.5
          return
        }
        const diff = Math.abs(a - b)
        totalMatchSum += diff === 0 ? 1 : diff === 1 ? 0.65 : diff === 2 ? 0.3 : 0
      })
    })

    const maxPossible = pairs.length * qs.length
    catScores[cat] = Math.round((totalMatchSum / maxPossible) * 100)
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
