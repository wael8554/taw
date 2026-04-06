'use client'

import { Button } from '@/components/ui/button'
import { HelpCircle, Calendar, Lightbulb } from 'lucide-react'
import { useGameState } from '@/lib/game-store'

interface GameHeaderProps {
  onOpenInstructions: () => void
  onOpenCalendar: () => void
  onOpenHint: () => void
}

export function GameHeader({
  onOpenInstructions,
  onOpenCalendar,
  onOpenHint,
}: GameHeaderProps) {
  const gameState = useGameState()
  
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-')
    return `${day}/${month}/${year}`
  }

  return (
    <header className="flex items-center justify-between p-4 border-b border-border">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenInstructions}
          title="تعليمات اللعبة"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold text-primary">كونتكستو عربي</h1>
        <p className="text-sm text-muted-foreground">
          التحدي اليومي: {formatDate(gameState.currentDate)}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenHint}
          title="تلميح"
          disabled={gameState.isWon}
        >
          <Lightbulb className="h-5 w-5" />
          {gameState.hintsUsed > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
              {gameState.hintsUsed}
            </span>
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenCalendar}
          title="اختر تاريخ"
        >
          <Calendar className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
