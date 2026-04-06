'use client'

import { useMemo } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useGameState } from '@/lib/game-store'
import { getScoreCategory, getScoreGradientClass } from '@/lib/types'
import { cn } from '@/lib/utils'

export function GuessList() {
  const gameState = useGameState()
  
  // Sort by score ascending (lower score = better = closer to target word)
  const sortedGuesses = useMemo(() => {
    return [...gameState.guesses].sort((a, b) => a.score - b.score)
  }, [gameState.guesses])

  if (sortedGuesses.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>لم تقم بأي تخمين بعد</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-2 p-1">
        {sortedGuesses.map((guess, index) => {
          const category = getScoreCategory(guess.score)
          const gradientClass = getScoreGradientClass(category)
          // Score 1 = perfect match (win)
          const isWinningGuess = guess.score === 1
          
          return (
            <div
              key={guess.id}
              className={cn(
                'flex items-center justify-between rounded-lg px-4 py-3 animate-slide-in',
                gradientClass,
                isWinningGuess && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <span className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                  isWinningGuess ? 'bg-background/30 text-foreground' : 'bg-background/20 text-foreground'
                )}>
                  {index + 1}
                </span>
                <span className={cn(
                  'font-semibold text-lg',
                  isWinningGuess ? 'text-foreground' : 'text-foreground'
                )}>
                  {guess.word}
                </span>
              </div>
              <div className={cn(
                'flex items-center gap-2 animate-pulse-score',
                isWinningGuess ? 'text-foreground' : 'text-foreground'
              )}>
                <span className="text-2xl font-bold">{guess.score}</span>
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}
