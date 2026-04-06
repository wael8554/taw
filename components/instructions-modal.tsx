'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface InstructionsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InstructionsModal({ open, onOpenChange }: InstructionsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">كيف تلعب؟</DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <div className="flex flex-col gap-4 text-foreground">
            <p className="text-base leading-relaxed">
              الهدف هو اكتشاف الكلمة السرية من خلال التخمين. كل يوم هناك كلمة جديدة!
            </p>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">1</span>
                <p className="text-sm text-muted-foreground">
                  اكتب كلمة عربية في خانة التخمين واضغط إرسال
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">2</span>
                <p className="text-sm text-muted-foreground">
                  ستحصل على ترتيب من 1 إلى 5000 بناءً على التشابه الدلالي
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">3</span>
                <p className="text-sm text-muted-foreground">
                  كلما اقترب الترتيب من 1، كلما اقتربت من الكلمة الصحيحة
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">4</span>
                <p className="text-sm text-muted-foreground">
                  استخدم التلميحات إذا احتجت مساعدة (4 تلميحات متاحة)
                </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <p className="text-sm font-semibold">دليل الألوان (الأقل = الأفضل):</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded score-gradient-win" />
                  <span>1 - فوز!</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded score-gradient-hot" />
                  <span>2-100 - قريب جداً</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded score-gradient-warm" />
                  <span>101-500 - قريب</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded score-gradient-cool" />
                  <span>501-1500 - متوسط</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded score-gradient-cold" />
                  <span>1501-5000 - بعيد</span>
                </div>
              </div>
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
