'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { useGameActions } from '@/lib/game-store'
import { getTodayDateString } from '@/lib/words'

interface CalendarModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CalendarModal({ open, onOpenChange }: CalendarModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const { setDate } = useGameActions()

  const handleSelect = (date: Date | undefined) => {
    if (!date) return
    setSelectedDate(date)
  }

  const handleConfirm = () => {
    if (!selectedDate) return
    
    const dateString = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
    setDate(dateString)
    onOpenChange(false)
  }

  const handleToday = () => {
    const today = new Date()
    setSelectedDate(today)
    setDate(getTodayDateString())
    onOpenChange(false)
  }

  // Disable future dates
  const today = new Date()
  today.setHours(23, 59, 59, 999)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle className="text-center">اختر تاريخ التحدي</DialogTitle>
          <DialogDescription className="text-center">
            العب تحديات سابقة أو ارجع لتحدي اليوم
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            disabled={{ after: today }}
            className="rounded-md border border-border"
          />
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              onClick={handleToday}
              className="flex-1"
            >
              اليوم
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1"
              disabled={!selectedDate}
            >
              تأكيد
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
