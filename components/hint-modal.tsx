'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useGameState, useGameActions } from '@/lib/game-store'
import { Lightbulb, Lock } from 'lucide-react'

interface HintModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const HINT_LABELS = [
  { label: 'الحرف الأول', description: 'يكشف الحرف الأول من الكلمة' },
  { label: 'عدد الحروف', description: 'يكشف طول الكلمة' },
  { label: 'الفئة', description: 'يكشف فئة الكلمة' },
  { label: 'الحرف الثاني', description: 'يكشف الحرف الثاني من الكلمة' },
]

export function HintModal({ open, onOpenChange }: HintModalProps) {
  const gameState = useGameState()
  const { useHint, getHint } = useGameActions()
  
  const currentHint = getHint()
  const canUseMoreHints = gameState.hintsUsed < 4

  const handleUseHint = () => {
    useHint()
  }

  const formatHintContent = () => {
    if (!currentHint) return null
    
    switch (currentHint.type) {
      case 'first_letter':
        return (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">الحرف الأول:</p>
            <span className="text-4xl font-bold text-primary">{currentHint.content}</span>
          </div>
        )
      case 'length':
        return (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">عدد الحروف:</p>
            <span className="text-4xl font-bold text-primary">{currentHint.content}</span>
          </div>
        )
      case 'category':
        return (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">الفئة:</p>
            <span className="text-2xl font-bold text-primary">{currentHint.content}</span>
          </div>
        )
      case 'second_letter':
        return (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">الحرف الثاني:</p>
            <span className="text-4xl font-bold text-primary">{currentHint.content}</span>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            التلميحات
          </DialogTitle>
          <DialogDescription className="text-center">
            استخدمت {gameState.hintsUsed} من 4 تلميحات
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4">
          {/* Progress indicators */}
          <div className="flex justify-center gap-2">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index < gameState.hintsUsed
                    ? 'bg-primary'
                    : 'bg-secondary'
                }`}
              />
            ))}
          </div>
          
          {/* Current hint display */}
          {currentHint && (
            <div className="p-4 bg-secondary rounded-lg">
              {formatHintContent()}
            </div>
          )}
          
          {/* Hint list */}
          <div className="flex flex-col gap-2">
            {HINT_LABELS.map((hint, index) => {
              const isUnlocked = index < gameState.hintsUsed
              const isNext = index === gameState.hintsUsed
              
              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    isUnlocked
                      ? 'border-primary/30 bg-primary/5'
                      : 'border-border bg-secondary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isUnlocked
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </span>
                    <div>
                      <p className={`text-sm font-medium ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {hint.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{hint.description}</p>
                    </div>
                  </div>
                  {!isUnlocked && (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              )
            })}
          </div>
          
          {/* Use hint button */}
          {canUseMoreHints && (
            <Button onClick={handleUseHint} className="w-full">
              استخدم التلميح التالي
            </Button>
          )}
          
          {!canUseMoreHints && (
            <p className="text-center text-sm text-muted-foreground">
              لقد استخدمت جميع التلميحات
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
