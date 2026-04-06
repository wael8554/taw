'use client'

import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Send } from 'lucide-react'
import { useGameState, useGameActions } from '@/lib/game-store'
import { checkSimilarity } from '@/app/actions'
import type { Guess } from '@/lib/types'

export function GuessInput() {
  const [input, setInput] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  
  const gameState = useGameState()
  const { addGuess } = useGameActions()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const word = input.trim()
    if (!word || gameState.isWon) return
    
    // Check if already guessed
    if (gameState.guesses.some(g => g.word === word)) {
      setError('لقد خمنت هذه الكلمة من قبل')
      return
    }
    
    setError(null)
    
    startTransition(async () => {
      try {
        const result = await checkSimilarity(word, gameState.targetWord)
        
        if (result.error) {
          setError(result.error)
          return
        }
        
        const score = result.score ?? 0
        const currentGuesses = gameState.guesses
        
        // Calculate rank based on score
        const rank = currentGuesses.filter(g => g.score > score).length + 1
        
        const guess: Guess = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          word,
          score,
          rank,
          timestamp: Date.now(),
        }
        
        addGuess(guess)
        setInput('')
      } catch (err) {
        setError('حدث خطأ أثناء التحقق من الكلمة')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اكتب تخمينك هنا..."
          className="flex-1 text-lg text-right bg-secondary border-border focus:border-primary"
          disabled={isPending || gameState.isWon}
          dir="rtl"
        />
        <Button 
          type="submit" 
          disabled={isPending || !input.trim() || gameState.isWon}
          className="px-6"
        >
          {isPending ? (
            <Spinner className="h-5 w-5" />
          ) : (
            <Send className="h-5 w-5 rotate-180" />
          )}
        </Button>
      </div>
      {error && (
        <p className="text-destructive text-sm">{error}</p>
      )}
      {gameState.isWon && (
        <p className="text-primary text-center font-bold text-lg">
          مبروك! لقد وجدت الكلمة الصحيحة!
        </p>
      )}
    </form>
  )
}
