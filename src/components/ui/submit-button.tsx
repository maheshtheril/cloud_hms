'use client'

import { useFormStatus } from 'react-dom'
import { Button, ButtonProps } from './button'

export function SubmitButton({ children, ...props }: ButtonProps) {
    const { pending } = useFormStatus()

    return (
        <Button type="submit" disabled={pending} {...props}>
            {pending ? (
                <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Saving...
                </span>
            ) : children}
        </Button>
    )
}
