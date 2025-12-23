import { forwardRef } from 'react'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

// Custom input component to pass to PhoneInput to reuse Shadcn styling
const CustomInput = forwardRef<HTMLInputElement, any>((props, ref) => {
    return <Input {...props} ref={ref} />
})
CustomInput.displayName = 'CustomInput'

interface PhoneInputProps {
    value?: string
    onChange: (value?: string) => void
    className?: string
    placeholder?: string
    disabled?: boolean
    id?: string
    name?: string
    defaultCountry?: any
    numberInputProps?: any
}

export const PhoneInputComponent = forwardRef<any, PhoneInputProps>(({ className, value, onChange, numberInputProps, ...props }: any, ref) => {
    return (
        <div className={cn("flex", className)}>
            <PhoneInput
                value={value}
                onChange={onChange}
                {...props}
                ref={ref}
                inputComponent={CustomInput}
                className="flex w-full gap-2"
                numberInputProps={{
                    ...numberInputProps,
                    className: cn(
                        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        numberInputProps?.className
                    )
                }}
            />
        </div>
    )
})
PhoneInputComponent.displayName = 'PhoneInputComponent'
