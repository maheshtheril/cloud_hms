'use client'

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Check, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface DateTimeSelectionProps {
    value?: string;
    onChange: (dateTime: string) => void;
    placeholder?: string;
    className?: string;
}

export function DateTimeSelection({ value, onChange, placeholder = "Pick Date & Time", className }: DateTimeSelectionProps) {
    const [date, setDate] = React.useState<Date | undefined>(value ? new Date(value) : undefined)
    const [time, setTime] = React.useState<string>(value ? format(new Date(value), "HH:mm") : "12:00")
    const [open, setOpen] = React.useState(false)

    const handleSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate)
    }

    const handleConfirm = () => {
        if (date) {
            const [hours, minutes] = time.split(':')
            const newDate = new Date(date)
            newDate.setHours(parseInt(hours), parseInt(minutes))
            onChange(newDate.toISOString())
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
                    {date ? format(date, "PPP") + " @ " + time : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-2xl border-white/20 shadow-2xl bg-white dark:bg-slate-900" align="start">
                <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x dark:divide-slate-800">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleSelect}
                        initialFocus
                        className="p-3"
                    />
                    <div className="p-4 flex flex-col gap-4 min-w-[120px] bg-slate-50/50 dark:bg-slate-800/20">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                <Clock className="w-3 h-3" />
                                Set Time
                            </p>
                            <Input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="h-10 border-none bg-transparent text-lg font-bold p-0 focus-visible:ring-0"
                            />
                        </div>
                    </div>
                </div>
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
                        Confirm
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
