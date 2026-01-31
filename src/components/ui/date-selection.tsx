'use client'

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DateSelectionProps {
    value?: string;
    onChange: (date: string) => void;
    placeholder?: string;
    className?: string;
}

export function DateSelection({ value, onChange, placeholder = "Pick a date", className }: DateSelectionProps) {
    const [date, setDate] = React.useState<Date | undefined>(value ? new Date(value) : undefined)
    const [open, setOpen] = React.useState(false)

    const handleSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate)
        // We don't call onChange yet, wait for OK or just auto-update but don't close
    }

    const handleConfirm = () => {
        if (date) {
            onChange(format(date, "yyyy-MM-dd"))
        } else {
            onChange("")
        }
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal h-12 rounded-xl bg-white/50 dark:bg-slate-900/50 border-slate-200/50",
                        !date && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4 text-indigo-500" />
                    {date ? format(date, "PPP") : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-2xl border-white/20 shadow-2xl bg-white dark:bg-slate-900" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleSelect}
                    initialFocus
                    className="p-3"
                />
                <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2 bg-slate-50/50 dark:bg-slate-800/20">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs font-bold uppercase tracking-widest text-slate-500"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest text-xs px-4 flex items-center gap-2"
                        onClick={handleConfirm}
                    >
                        <Check className="w-3 h-3" />
                        Set Date
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
