'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Loader2, Plus, Search, X } from 'lucide-react';
// import { Portal } from '@radix-ui/react-portal'; // If utilizing Radix
import { createPortal } from 'react-dom';

function useDebouncedCallback<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
) {
    const timeoutRef = React.useRef<NodeJS.Timeout>(null);

    return React.useCallback(
        (...args: Parameters<T>) => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);

            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    );
}

export type Option = {
    id: string;
    label: string;
    subLabel?: string;
    [key: string]: any;
};

interface SearchableSelectProps {
    value?: string | null;
    valueLabel?: string; // Explicit label for programmatically set value
    onChange: (value: string | null, option?: Option | null) => void;
    onSearch: (query: string) => Promise<Option[]>;
    placeholder?: string;
    defaultOptions?: Option[];
    onCreate?: (query: string) => Promise<Option | null>;
    label?: string;
    className?: string;
    disabled?: boolean;
    variant?: 'default' | 'ghost';
    isDark?: boolean;
    inputId?: string;
}

export function SearchableSelect({
    value,
    valueLabel,
    onChange,
    onSearch,
    placeholder = "Select...",
    defaultOptions = [],
    onCreate,
    label,
    className = "",
    disabled = false,
    variant = 'default',
    isDark = false,
    inputId,
}: SearchableSelectProps) {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [options, setOptions] = React.useState<Option[]>(defaultOptions);
    const [loading, setLoading] = React.useState(false);
    const [creating, setCreating] = React.useState(false);
    const [selectedOption, setSelectedOption] = React.useState<Option | null>(null);
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [position, setPosition] = React.useState({ top: 0, left: 0, width: 0 });

    React.useEffect(() => {
        // Stop updating if user is searching. 
        // We only want to sync options with defaultOptions when search is cleared/idle.
        if (query) return;

        setOptions(defaultOptions);
    }, [defaultOptions, query]);

    // Reset active index when options change
    React.useEffect(() => {
        setActiveIndex(0);
    }, [options]);

    const containerRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const listRef = React.useRef<HTMLUListElement>(null);

    // Initial value handling
    React.useEffect(() => {
        if (!value) {
            setSelectedOption(null);
            if (valueLabel) {
                setQuery(valueLabel);
            } else {
                setQuery("");
            }
            return;
        }

        // Try finding in current options or default options
        const found = options.find(o => o.id === value) || defaultOptions.find(o => o.id === value);

        if (found) {
            setSelectedOption(found);
            // In ghost variant, we want the text in the input
            if (variant === 'ghost') {
                if (!open) setQuery(found.label);
            } else if (!open) {
                setQuery("");
            }
        } else if (valueLabel) {
            // Fallback to valueLabel if provided (e.g. after AI scan)
            setSelectedOption({ id: value, label: valueLabel });
            if (variant === 'ghost' && !open) setQuery(valueLabel);
        }
    }, [value, valueLabel, options, defaultOptions, variant, open]);

    // Calculate position for portal
    React.useEffect(() => {
        if (open && containerRef.current) {
            const updatePosition = () => {
                const rect = containerRef.current?.getBoundingClientRect();
                if (rect) {
                    setPosition({
                        top: rect.bottom + window.scrollY,
                        left: rect.left + window.scrollX,
                        width: rect.width,
                    });
                }
            };

            updatePosition();
            window.addEventListener('resize', updatePosition);
            window.addEventListener('scroll', updatePosition, true); // true for capture (all scrollable ancestors)

            return () => {
                window.removeEventListener('resize', updatePosition);
                window.removeEventListener('scroll', updatePosition, true);
            };
        }
    }, [open]);

    // Handle clicks outside - modified for Portal
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            // Check if click is inside container (input) OR inside dropdown (portal)
            if (
                containerRef.current &&
                !containerRef.current.contains(target) &&
                listRef.current &&
                !listRef.current.parentElement?.contains(target) // check portal wrapper
            ) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Scroll active item into view
    React.useEffect(() => {
        if (open && listRef.current) {
            const activeItem = listRef.current.children[activeIndex] as HTMLElement;
            if (activeItem) {
                activeItem.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [activeIndex, open]);


    const performSearch = useDebouncedCallback(async (searchTerm: string) => {
        setLoading(true);
        try {
            const results = await onSearch(searchTerm);
            setOptions(results);
        } catch (err) {
            console.error(err);
            setOptions([]);
        } finally {
            setLoading(false);
        }
    }, 300);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        setOpen(true);
        performSearch(val);
    };

    const handleSelect = (option: Option) => {
        setSelectedOption(option);
        onChange(option.id, option);
        setOpen(false);
        setQuery("");
    };

    const handleCreate = async () => {
        if (!onCreate || !query) return;
        setCreating(true);
        try {
            const newOption = await onCreate(query);
            if (newOption) {
                handleSelect(newOption);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setCreating(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!open) {
            if (e.key === 'ArrowDown' || e.key === 'Enter') {
                setOpen(true);
                performSearch(query);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex(prev => (prev < options.length - 1 ? prev + 1 : prev));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
                break;
            case 'Enter':
                e.preventDefault();
                if (options[activeIndex]) {
                    handleSelect(options[activeIndex]);
                } else if (onCreate && query && options.length === 0) {
                    handleCreate();
                }
                break;
            case 'Escape':
                setOpen(false);
                break;
        }
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedOption(null);
        onChange(null, null);
        setQuery("");
    };

    const baseStyles = variant === 'default'
        ? "bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 rounded-lg px-3"
        : "bg-transparent border-none shadow-none focus-within:ring-0 focus-within:bg-gray-50/50 dark:focus-within:bg-white/5 rounded-md px-1";

    const dropdownContent = (
        <div
            className={`fixed z-[99999] mt-1 overflow-hidden rounded-xl py-1 text-base shadow-2xl ring-1 ring-black/5 focus:outline-none sm:text-sm ${isDark ? 'bg-neutral-900 border border-white/10 text-white shadow-black' : 'bg-white border border-gray-100 text-gray-900 shadow-lg'}`}
            style={{
                top: position.top,
                left: position.left,
                width: position.width,
                maxHeight: '240px'
            }}
        >
            {loading && (
                <div className="px-4 py-3 text-center text-gray-500 dark:text-neutral-500 flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                </div>
            )}

            {!loading && options.length === 0 && !query && (
                <div className="px-4 py-3 text-center text-gray-500 dark:text-neutral-500">
                    Start typing to search...
                </div>
            )}

            {!loading && options.length === 0 && query && (
                <div className="px-2 py-2">
                    <div className="px-2 py-2 text-gray-500 dark:text-neutral-500 text-center text-sm">No results found.</div>
                    {onCreate && (
                        <button
                            type="button"
                            onClick={handleCreate}
                            disabled={creating}
                            className="w-full text-left flex items-center gap-2 px-3 py-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-md transition-colors"
                        >
                            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                            <span className="font-medium">Create "{query}"</span>
                        </button>
                    )}
                </div>
            )}

            {!loading && options.length > 0 && (
                <ul className="py-1 overflow-auto max-h-[240px]" ref={listRef}>
                    {options.map((option, index) => (
                        <li
                            key={option.id}
                            onClick={() => handleSelect(option)}
                            className={`
                                relative cursor-pointer select-none py-2.5 pl-3 pr-9 
                                ${index === activeIndex ? (isDark ? 'bg-white/10' : 'bg-indigo-50 dark:bg-white/10') : ''}
                                ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 dark:text-neutral-200 hover:bg-indigo-50 dark:hover:bg-white/5'}
                                transition-colors flex flex-col
                            `}
                            onMouseEnter={() => setActiveIndex(index)}
                        >
                            <span className="block truncate font-medium">{option.label}</span>
                            {option.subLabel && (
                                <span className="block truncate text-xs text-gray-500 dark:text-neutral-500 mt-0.5">{option.subLabel}</span>
                            )}

                            {value === option.id && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 dark:text-indigo-400">
                                    <Check className="h-4 w-4" />
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

    return (
        <>
            <div className={`relative ${className}`} ref={containerRef}>
                {label && <label className="block text-sm font-medium text-gray-700 dark:text-neutral-400 mb-1">{label}</label>}

                <div
                    className={`
                        relative w-full cursor-text text-left transition-all duration-200
                        ${baseStyles}
                        ${disabled ? 'opacity-70 cursor-not-allowed bg-gray-50 dark:bg-neutral-800' : ''}
                    `}
                    onClick={() => {
                        if (disabled) return;
                        if (selectedOption && !open) {
                            setOpen(true);
                            // Small timeout to allow render to happen so input exists
                            setTimeout(() => inputRef.current?.focus(), 0);
                        } else {
                            inputRef.current?.focus();
                        }
                    }}
                >
                    <div className="flex items-center min-h-[42px] gap-2">
                        {variant === 'default' && <Search className="h-4 w-4 text-gray-400 dark:text-neutral-500 shrink-0" />}

                        {selectedOption && !open && variant === 'default' ? (
                            <div className="flex-1 flex items-center justify-between">
                                <div className="flex flex-col overflow-hidden">
                                    <span className={`block truncate font-medium text-gray-900 dark:text-neutral-200`}>{selectedOption.label}</span>
                                    {selectedOption.subLabel && (
                                        <span className={`block truncate text-xs text-gray-500 dark:text-neutral-500`}>{selectedOption.subLabel}</span>
                                    )}
                                </div>
                                {!disabled && (
                                    <button type="button" onClick={handleClear} className="text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 p-1 shrink-0">
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <input
                                ref={inputRef}
                                id={inputId}
                                type="text"
                                className={`w-full border-none p-0 focus:ring-0 bg-transparent ${variant === 'ghost' ? `${isDark ? 'text-white' : 'text-gray-900'} font-inherit placeholder:text-inherit placeholder:opacity-30` : 'text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-neutral-600'}`}
                                placeholder={selectedOption && variant === 'default' ? selectedOption.label : placeholder}
                                value={query}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                onFocus={() => {
                                    if (!disabled) {
                                        setOpen(true);
                                        performSearch(query);
                                    }
                                }}
                                disabled={disabled}
                                autoComplete="off"
                            />
                        )}

                        {selectedOption && variant === 'ghost' && !disabled && (
                            <button type="button" onClick={handleClear} className="text-neutral-500 hover:text-neutral-300 p-1 shrink-0 mr-2">
                                <X className="h-4 w-4" />
                            </button>
                        )}

                        {!selectedOption && (
                            <div className="shrink-0 text-gray-400 dark:text-neutral-600">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronsUpDown className="h-4 w-4 opacity-50" />}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Render Dropdown via Portal */}
            {open && !disabled && (
                typeof document !== 'undefined' ? createPortal(dropdownContent, document.body) : null
            )}
        </>
    );
}
