'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { GameState, Guess, HintInfo } from './types'
import { getWordForDate, getTodayDateString } from './words'

const STORAGE_KEY = 'contexto-arab-game'

interface StoredState {
  [dateKey: string]: {
    guesses: Guess[]
    isWon: boolean
    hintsUsed: number
  }
}

function getStoredState(): StoredState {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function saveState(state: StoredState): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage might be full or unavailable
  }
}

interface GameContextValue {
  state: GameState
  addGuess: (guess: Guess) => void
  setDate: (date: string) => void
  useHint: () => void
  getHint: () => HintInfo | null
  resetGame: () => void
}

const GameContext = createContext<GameContextValue | null>(null)

function createInitialState(date: string): GameState {
  const wordData = getWordForDate(date)
  return {
    targetWord: wordData.word,
    guesses: [],
    isWon: false,
    hintsUsed: 0,
    currentDate: date,
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [currentDate, setCurrentDate] = useState(() => getTodayDateString())
  const [storedState, setStoredState] = useState<StoredState>({})
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage after hydration
  useEffect(() => {
    setStoredState(getStoredState())
    setIsHydrated(true)
  }, [])

  // Compute current game state
  const state: GameState = (() => {
    const wordData = getWordForDate(currentDate)
    const dateState = storedState[currentDate]
    
    if (!dateState) {
      return {
        targetWord: wordData.word,
        guesses: [],
        isWon: false,
        hintsUsed: 0,
        currentDate,
      }
    }
    
    return {
      targetWord: wordData.word,
      guesses: dateState.guesses,
      isWon: dateState.isWon,
      hintsUsed: dateState.hintsUsed,
      currentDate,
    }
  })()

  const addGuess = useCallback((guess: Guess) => {
    setStoredState(prev => {
      const current = prev[currentDate] || {
        guesses: [],
        isWon: false,
        hintsUsed: 0,
      }

      // Check if word already guessed
      if (current.guesses.some(g => g.word === guess.word)) {
        return prev
      }

      const newGuesses = [...current.guesses, guess]
      // Score 1 = perfect match (win condition)
      const isWon = guess.score === 1

      const newState = {
        ...prev,
        [currentDate]: {
          ...current,
          guesses: newGuesses,
          isWon: current.isWon || isWon,
        },
      }

      saveState(newState)
      return newState
    })
  }, [currentDate])

  const setDate = useCallback((date: string) => {
    setCurrentDate(date)
  }, [])

  const useHintAction = useCallback(() => {
    setStoredState(prev => {
      const current = prev[currentDate] || {
        guesses: [],
        isWon: false,
        hintsUsed: 0,
      }

      if (current.hintsUsed >= 4) return prev

      const newState = {
        ...prev,
        [currentDate]: {
          ...current,
          hintsUsed: current.hintsUsed + 1,
        },
      }

      saveState(newState)
      return newState
    })
  }, [currentDate])

  const getHint = useCallback((): HintInfo | null => {
    const wordData = getWordForDate(currentDate)
    const word = wordData.word
    const dateState = storedState[currentDate]
    const hintsUsed = dateState?.hintsUsed || 0
    
    if (hintsUsed === 0) return null
    
    const hints: HintInfo[] = [
      { level: 1, content: word[0], type: 'first_letter' },
      { level: 2, content: String(word.length), type: 'length' },
      { level: 3, content: wordData.category, type: 'category' },
      { level: 4, content: word.length > 1 ? word[1] : word[0], type: 'second_letter' },
    ]
    
    return hints[Math.min(hintsUsed - 1, hints.length - 1)]
  }, [currentDate, storedState])

  const resetGame = useCallback(() => {
    setStoredState(prev => {
      const newState = { ...prev }
      delete newState[currentDate]
      saveState(newState)
      return newState
    })
  }, [currentDate])

  const value: GameContextValue = {
    state,
    addGuess,
    setDate,
    useHint: useHintAction,
    getHint,
    resetGame,
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}

export function useGameState(): GameState {
  const context = useContext(GameContext)
  if (!context) {
    // Return a default state for SSR
    const date = getTodayDateString()
    const wordData = getWordForDate(date)
    return {
      targetWord: wordData.word,
      guesses: [],
      isWon: false,
      hintsUsed: 0,
      currentDate: date,
    }
  }
  return context.state
}

export function useGameActions() {
  const context = useContext(GameContext)
  if (!context) {
    // Return no-op functions for SSR
    return {
      addGuess: () => {},
      setDate: () => {},
      useHint: () => {},
      getHint: () => null,
      resetGame: () => {},
    }
  }
  return {
    addGuess: context.addGuess,
    setDate: context.setDate,
    useHint: context.useHint,
    getHint: context.getHint,
    resetGame: context.resetGame,
  }
}
