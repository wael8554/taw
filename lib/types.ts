export interface Guess {
  id: string
  word: string
  score: number
  rank: number
  timestamp: number
}

export interface GameState {
  targetWord: string
  guesses: Guess[]
  isWon: boolean
  hintsUsed: number
  currentDate: string
}

export interface HintInfo {
  level: number
  content: string
  type: 'first_letter' | 'length' | 'category' | 'second_letter'
}

export type ScoreCategory = 'win' | 'hot' | 'warm' | 'cool' | 'cold'

// Lower score = better (1 is perfect match, 5000 is completely unrelated)
export function getScoreCategory(score: number): ScoreCategory {
  if (score === 1) return 'win'
  if (score <= 100) return 'hot'      // Very close semantically
  if (score <= 500) return 'warm'     // Related words
  if (score <= 1500) return 'cool'    // Somewhat related
  return 'cold'                       // Distant or unrelated
}

export function getScoreGradientClass(category: ScoreCategory): string {
  const classes: Record<ScoreCategory, string> = {
    win: 'score-gradient-win',
    hot: 'score-gradient-hot',
    warm: 'score-gradient-warm',
    cool: 'score-gradient-cool',
    cold: 'score-gradient-cold',
  }
  return classes[category]
}
