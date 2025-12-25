"use client"

import Link from "next/link"
import { MoreHorizontal, Pencil, Eye, Printer, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface BillingActionsProps {
    invoiceId: string
    invoiceNumber: string
}

export function BillingActions({ invoiceId, invoiceNumber }: BillingActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100 data-[state=open]:bg-gray-100 transition-colors">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4 text-gray-500" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                    <Link href={`/hms/billing/${invoiceId}/edit`} className="cursor-pointer flex items-center gap-2">
                        <Pencil className="h-4 w-4 text-gray-500" />
                        Edit
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={`/hms/billing/${invoiceId}`} className="cursor-pointer flex items-center gap-2">
                        <Eye className="h-4 w-4 text-gray-500" />
                        View Details
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={`/hms/billing/${invoiceId}/print`} target="_blank" className="cursor-pointer flex items-center gap-2">
                        <Printer className="h-4 w-4 text-gray-500" />
                        Print
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
