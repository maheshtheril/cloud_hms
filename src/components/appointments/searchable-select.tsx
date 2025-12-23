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
    isDark?: boolean
}

export function SearchableSelect({
    options,
    value: initialValue,
    onChange,
    placeholder = "Search...",
    name,
    required = false,
    className = "",
    isDark = false
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [selectedValue, setSelectedValue] = useState(initialValue || '')
    const [highlightedIndex, setHighlightedIndex] = useState(0)
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
    const containerRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)

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

    // Reset highlighted index when filtered options change
    useEffect(() => {
        setHighlightedIndex(0)
    }, [search])

    // Handle keyboard navigation
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault()
                    setHighlightedIndex(prev =>
                        prev < filteredOptions.length - 1 ? prev + 1 : prev
                    )
                    break
                case 'ArrowUp':
                    e.preventDefault()
                    setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev)
                    break
                case 'Enter':
                    e.preventDefault()
                    if (filteredOptions[highlightedIndex]) {
                        handleSelect(filteredOptions[highlightedIndex].id)
                    }
                    break
                case 'Escape':
                    e.preventDefault()
                    setIsOpen(false)
                    setSearch('')
                    break
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, highlightedIndex, filteredOptions])

    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Check if click is outside BOTH the trigger container AND the dropdown portal
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
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
            ref={dropdownRef}
            style={{
                position: 'absolute',
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`,
                zIndex: 99999
            }}
            className={`bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-xl shadow-2xl max-h-80 overflow-hidden ${isDark ? 'dark' : ''}`}
        >
            {/* Search Input */}
            < div className="p-2 border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50" >
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={`Search ${placeholder.toLowerCase()}...`}
                        className="w-full pl-9 pr-4 py-1.5 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 dark:text-white"
                        autoFocus
                    />
                </div>
            </div >

            {/* Options List */}
            < div className="overflow-y-auto max-h-64" >
                {
                    filteredOptions.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                            No results found
                        </div>
                    ) : (
                        filteredOptions.map((option, index) => (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => handleSelect(option.id)}
                                onMouseEnter={() => setHighlightedIndex(index)}
                                className={`w-full px-4 py-2 text-left transition-colors border-b border-gray-100 dark:border-slate-800 last:border-0 ${index === highlightedIndex
                                    ? 'bg-blue-50 dark:bg-blue-900/20'
                                    : selectedValue === option.id
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                        : 'hover:bg-blue-50 dark:hover:bg-slate-800 text-gray-900 dark:text-gray-100'
                                    }`}
                            >
                                <div className="font-medium text-sm">{option.label}</div>
                                {option.subtitle && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{option.subtitle}</div>
                                )}
                            </button>
                        ))
                    )
                }
            </div >
        </div >,
        document.body
    ) : null

    return (
        <div ref={containerRef} className="relative">
            {/* Hidden input for form submission */}
            <input type="hidden" name={name} value={selectedValue} required={required} />

            {/* Display/Trigger Button */}
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full p-2.5 bg-white dark:bg-slate-950 text-left border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium transition-all flex items-center justify-between text-sm ${className}`}
            >
                <span className={selectedOption ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>
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
