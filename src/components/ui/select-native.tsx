import * as React from "react"
import { cn } from "@/lib/utils"
// Using native select for simplicity since radix-select is not installed

export const Select = ({ children }: { children: React.ReactNode }) => <>{children}</>

export const SelectTrigger = ({ children }: { children: React.ReactNode }) => <>{children}</>

export const SelectValue = ({ placeholder }: { placeholder: string }) => <>{placeholder}</>

export const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>

export const SelectItem = ({ value, children }: { value: string, children: React.ReactNode }) => <option value={value}>{children}</option>

// This is a "fake" module that actually renders a native select if used with correct composition,
// BUT the LeadForm uses the Radix composition pattern <Select><SelectTrigger>...
// I must adapt LeadForm to use a simplified Select OR implement a native wrapper that looks okay.

// Let's reimplement a NativeSelect wrapper that accepts the same slots but ignores them and just expects a 'name' and 'options' prop?
// No, LeadForm code is already written.
// I will implement a "Polyfill" that renders a NATIVE select but tries to consume the nested children.
// Actually, easier to just rewrite LeadForm to use this NativeSelect component which I'll define here properly.

// Redefining for LeadForm usage:
// The LeadForm uses:
// <Select name="source_id">
//    <SelectTrigger><SelectValue placeholder="..." /></SelectTrigger>
//    <SelectContent>{map(SelectItem)}</SelectContent>
// </Select>

// I will make a Native Select component that captures the `name` from the root,
// and expects `SelectItem` children to just be <option>s.
// The Trigger and Content wrappers will be pass-throughs or simplified.

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { }

export const SelectNative = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div className="relative">
                <select
                    className={cn(
                        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        className
                    )}
                    ref={ref}
                    {...props}
                >
                    {children}
                </select>
            </div>
        )
    }
)
SelectNative.displayName = "Select"
