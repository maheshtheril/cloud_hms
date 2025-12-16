'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Loader2, Plus, Search, X } from 'lucide-react';

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
}

export function SearchableSelect({
    value,
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
}: SearchableSelectProps) {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [options, setOptions] = React.useState<Option[]>(defaultOptions);
    const [loading, setLoading] = React.useState(false);
    const [creating, setCreating] = React.useState(false);
    const [selectedOption, setSelectedOption] = React.useState<Option | null>(null);

    React.useEffect(() => {
        // Do not overwrite options with defaultOptions if the menu is open (user is creating or creating search results)
        if (open) return;

        setOptions(prev => {
            if (JSON.stringify(prev) === JSON.stringify(defaultOptions)) return prev;
            return defaultOptions;
        });
    }, [defaultOptions, open]);

    const containerRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    React.useEffect(() => {
        if (!value) {
            setSelectedOption(null);
            return;
        }
        const found = options.find(o => o.id === value);
        if (found) {
            setSelectedOption(found);
            setQuery("");
            setOpen(false); // Close dropdown on external selection match
        }
    }, [value, options]);

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

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedOption(null);
        onChange(null, null);
        setQuery("");
    };

    const baseStyles = variant === 'default'
        ? "bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 rounded-lg px-3"
        : "bg-transparent border-none shadow-none focus-within:ring-0 focus-within:bg-gray-50/50 dark:focus-within:bg-white/5 rounded-md px-1";

    return (
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

                    {selectedOption && !open ? (
                        <div className="flex-1 flex items-center justify-between">
                            <div className="flex flex-col overflow-hidden">
                                <span className={`block truncate font-medium ${variant === 'ghost' ? 'text-inherit' : 'text-gray-900 dark:text-neutral-200'}`}>{selectedOption.label}</span>
                                {selectedOption.subLabel && (
                                    <span className={`block truncate text-xs ${variant === 'ghost' ? 'text-inherit opacity-70' : 'text-gray-500 dark:text-neutral-500'}`}>{selectedOption.subLabel}</span>
                                )}
                            </div>
                            {!disabled && (
                                <button type="button" onClick={handleClear} className={`${variant === 'ghost' ? 'text-inherit opacity-50 hover:opacity-100' : 'text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300'} p-1 shrink-0`}>
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    ) : (
                        <input
                            ref={inputRef}
                            type="text"
                            className={`w-full border-none p-0 focus:ring-0 text-sm bg-transparent ${variant === 'ghost' ? 'text-inherit placeholder:text-inherit placeholder:opacity-50' : 'text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-neutral-600'}`}
                            placeholder={selectedOption ? selectedOption.label : placeholder}
                            value={query}
                            onChange={handleInputChange}
                            onFocus={() => {
                                if (!disabled) {
                                    setOpen(true);
                                    performSearch(query);
                                }
                            }}
                            disabled={disabled}
                        />
                    )}

                    {!selectedOption && (
                        <div className="shrink-0 text-gray-400 dark:text-neutral-600">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronsUpDown className="h-4 w-4 opacity-50" />}
                        </div>
                    )}
                </div>
            </div>

            {/* Dropdown with Dark Mode Support */}
            {open && !disabled && (
                <div className={`absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg py-1 text-base shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm animate-in fade-in zoom-in-95 duration-100 ${isDark ? 'bg-neutral-900 border border-white/10' : 'bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800'}`}>
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
                        <ul className="py-1">
                            {options.map((option) => (
                                <li
                                    key={option.id}
                                    onClick={() => handleSelect(option)}
                                    className={`
                                        relative cursor-pointer select-none py-2.5 pl-3 pr-9 
                                        ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 dark:text-neutral-200 hover:bg-indigo-50 dark:hover:bg-white/5'}
                                        transition-colors flex flex-col
                                    `}
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
            )}
        </div>
    );
}
