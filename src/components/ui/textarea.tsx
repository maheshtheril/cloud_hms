import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, onChange, ...props }, ref) => {
        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const val = e.target.value;
            if (val && val.length > 0) {
                const start = e.target.selectionStart;
                const newVal = val.replace(/(^|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());

                if (newVal !== val) {
                    e.target.value = newVal;
                    e.target.setSelectionRange(start, start);
                }
            }
            onChange?.(e);
        }

        return (
            <textarea
                className={cn(
                    "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                spellCheck={true}
                autoCapitalize="sentences"
                onChange={handleChange}
                {...props}
            />
        )
    }
)
Textarea.displayName = "Textarea"

export { Textarea }
