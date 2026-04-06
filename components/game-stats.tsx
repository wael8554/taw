'use client'

import { useGameState } from '@/lib/game-store'
import { useMemo } from 'react'

export function GameStats() {
  const gameState = useGameState()
  
  const stats = useMemo(() => {
    const guesses = gameState.guesses
    if (guesses.length === 0) {
      return { total: 0, bestScore: '-', avgScore: '-' }
    }
    
    const scores = guesses.map(g => g.score)
    // Lower score = better (1 is best, 5000 is worst)
    const bestScore = Math.min(...scores)
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    
    return { total: guesses.length, bestScore, avgScore }
  }, [gameState.guesses])

  return (
    <div className="flex items-center justify-around p-4 bg-card rounded-lg border border-border">
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-foreground">{stats.total}</span>
        <span className="text-xs text-muted-foreground">المحاولات</span>
      </div>
      <div className="w-px h-10 bg-border" />
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-primary">{stats.bestScore}</span>
        <span className="text-xs text-muted-foreground">أفضل نتيجة</span>
      </div>
      <div className="w-px h-10 bg-border" />
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-foreground">{stats.avgScore}</span>
        <span className="text-xs text-muted-foreground">المتوسط</span>
      </div>
      <div className="w-px h-10 bg-border" />
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-foreground">{gameState.hintsUsed}/4</span>
        <span className="text-xs text-muted-foreground">التلميحات</span>
      </div>
    </div>
  )
}
