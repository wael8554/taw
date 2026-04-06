'use client'

import { useState, useEffect } from 'react'
import { GameHeader } from './game-header'
import { GuessInput } from './guess-input'
import { GuessList } from './guess-list'
import { GameStats } from './game-stats'
import { InstructionsModal } from './instructions-modal'
import { CalendarModal } from './calendar-modal'
import { HintModal } from './hint-modal'
import { GameProvider } from '@/lib/game-store'

function GameContent() {
  const [showInstructions, setShowInstructions] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Show instructions on first visit
  useEffect(() => {
    setMounted(true)
    
    const hasSeenInstructions = localStorage.getItem('contexto-arab-seen-instructions')
    
    if (!hasSeenInstructions) {
      setShowInstructions(true)
      localStorage.setItem('contexto-arab-seen-instructions', 'true')
    }
  }, [])

  // Render a shell that matches server/client to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex flex-col" suppressHydrationWarning>
        <div className="h-16 border-b border-border bg-card" />
        <main className="flex-1 p-4 flex flex-col lg:flex-row gap-4 max-w-7xl mx-auto w-full">
          <div className="lg:w-1/3 flex flex-col gap-4">
            <div className="bg-card rounded-lg border border-border p-4 h-40" />
          </div>
          <div className="lg:w-2/3 flex flex-col min-h-[300px] lg:min-h-0">
            <div className="bg-card rounded-lg border border-border p-4 flex-1" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GameHeader
        onOpenInstructions={() => setShowInstructions(true)}
        onOpenCalendar={() => setShowCalendar(true)}
        onOpenHint={() => setShowHint(true)}
      />
      
      {/* Main content - responsive layout */}
      <main className="flex-1 p-4 flex flex-col lg:flex-row gap-4 max-w-7xl mx-auto w-full">
        {/* Desktop: Two columns / Mobile: Stacked */}
        
        {/* Left column (Desktop) / Top section (Mobile): Input and Stats */}
        <div className="lg:w-1/3 flex flex-col gap-4 order-1 lg:order-1">
          <div className="bg-card rounded-lg border border-border p-4">
            <h2 className="text-lg font-semibold mb-4 text-center">خمّن الكلمة</h2>
            <GuessInput />
          </div>
          
          <GameStats />
          
          {/* Instructions summary on desktop */}
          <div className="hidden lg:block bg-card rounded-lg border border-border p-4">
            <h3 className="text-sm font-semibold mb-2 text-muted-foreground">تلميحات سريعة:</h3>
            <ul className="text-xs text-muted-foreground flex flex-col gap-1">
              <li>- كلما ارتفعت النتيجة، اقتربت من الكلمة</li>
              <li>- النتيجة 1000 تعني الكلمة الصحيحة</li>
              <li>- استخدم التلميحات إذا علقت</li>
            </ul>
          </div>
        </div>
        
        {/* Right column (Desktop) / Bottom section (Mobile): Guess history */}
        <div className="lg:w-2/3 flex flex-col order-2 lg:order-2 min-h-[300px] lg:min-h-0">
          <div className="bg-card rounded-lg border border-border p-4 flex-1 flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-center">سجل التخمينات</h2>
            <div className="flex-1 min-h-0">
              <GuessList />
            </div>
          </div>
        </div>
      </main>
      
      {/* Modals */}
      <InstructionsModal
        open={showInstructions}
        onOpenChange={setShowInstructions}
      />
      <CalendarModal
        open={showCalendar}
        onOpenChange={setShowCalendar}
      />
      <HintModal
        open={showHint}
        onOpenChange={setShowHint}
      />
    </div>
  )
}

export function GameContainer() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  )
}
