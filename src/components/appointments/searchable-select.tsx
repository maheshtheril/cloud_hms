'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Search, X } from 'lucide-react'

interface Option {
    id: string
    label: string
    subtitle?: string
}

interface SearchableSelectProps {
    options: Option[]
    value?: string
    onChange: (value: string) => void
    placeholder?: string
    name: string
    required?: boolean
    className?: string
}

export function SearchableSelect({
    options,
    value: initialValue,
    onChange,
    placeholder = "Search...",
    name,
    required = false,
    className = ""
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [selectedValue, setSelectedValue] = useState(initialValue || '')
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
    const containerRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const selectedOption = options.find(opt => opt.id === selectedValue)

    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(search.toLowerCase()) ||
        opt.subtitle?.toLowerCase().includes(search.toLowerCase())
    )

    // Calculate dropdown position
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            setDropdownPosition({
                top: rect.bottom + window.scrollY + 8,
                left: rect.left + window.scrollX,
                width: rect.width
            })
        }
    }, [isOpen])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Check if the click is outside the main container and also not inside the portal dropdown
            // The portal dropdown is rendered outside the DOM tree of containerRef, so we need to check its parent (document.body)
            // For simplicity, we'll rely on containerRef for now, as the portal itself doesn't have a ref here.
            // A more robust solution would involve a ref on the portal's root div.
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
                setSearch('')
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (optionId: string) => {
        setSelectedValue(optionId)
        onChange(optionId)
        setIsOpen(false)
        setSearch('')
    }

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation()
        setSelectedValue('')
        onChange('')
        setSearch('')
    }

    const dropdown = isOpen ? createPortal(
        <div
            style={{
                position: 'absolute',
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`,
                zIndex: 99999
            }}
            className="bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-80 overflow-hidden"
        >
            {/* Search Input */}
            <div className="p-3 border-b border-gray-200 bg-gray-50">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={`Search ${placeholder.toLowerCase()}...`}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                        autoFocus
                    />
                </div>
            </div>

            {/* Options List */}
            <div className="overflow-y-auto max-h-64">
                {filteredOptions.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                        No results found
                    </div>
                ) : (
                    filteredOptions.map((option) => (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => handleSelect(option.id)}
                            className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0 ${selectedValue === option.id ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                                }`}
                        >
                            <div className="font-medium">{option.label}</div>
                            {option.subtitle && (
                                <div className="text-xs text-gray-500 mt-0.5">{option.subtitle}</div>
                            )}
                        </button>
                    ))
                )}
            </div>
        </div>,
        document.body
    ) : null

    return (
        <div ref={containerRef} className="relative">
            {/* Hidden input for form submission */}
            <input type="hidden" name={name} value={selectedValue} required={required} />

            {/* Display/Trigger Button */}
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full p-3.5 bg-white text-left border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium transition-all flex items-center justify-between ${className}`}
            >
                <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <div className="flex items-center gap-2">
                    {selectedValue && (
                        <X
                            className="h-4 w-4 text-gray-400 hover:text-gray-600"
                            onClick={handleClear}
                        />
                    )}
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>

            {dropdown}
        </div>
    )
}
