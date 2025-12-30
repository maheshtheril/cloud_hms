'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Loader2 } from 'lucide-react'

// Check browser support
const isSpeechSupported = typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

interface VoiceControlProps {
    onTranscript?: (text: string) => void
    className?: string
    children: React.ReactElement // The Input or Textarea
}

/**
 * A wrapper that adds a microphone button to any input/textarea.
 * It handles the speech recognition and updates the child input's value.
 */
export function VoiceWrapper({ children, onTranscript, className }: VoiceControlProps) {
    const [isListening, setIsListening] = useState(false)
    const [recognition, setRecognition] = useState<any>(null)

    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).webkitSpeechRecognition) {
            const Recognition = (window as any).webkitSpeechRecognition
            const rec = new Recognition()
            rec.continuous = false
            rec.interimResults = false
            rec.lang = 'en-US'

            rec.onstart = () => setIsListening(true)
            rec.onend = () => setIsListening(false)
            rec.onError = (e: any) => { console.error("Speech Error", e); setIsListening(false); }

            // On Result
            rec.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript
                // Programmatically update the input value
                updateInput(transcript)
                if (onTranscript) onTranscript(transcript)
            }

            setRecognition(rec)
        }
    }, [])

    const updateInput = (text: string) => {
        // Find the input element inside this wrapper
        // We use a query selector on the parent div/wrapper ref?
        // Actually, we can assume the child is the input and verify later.
        // But since we cloneElement, we can pass a ref... but only if child accepts ref.
        // EASIER: Just use the wrapperRef to find 'input' or 'textarea' child.
    }

    const wrapperRef = useRef<HTMLDivElement>(null)

    const handleMicClick = () => {
        if (!recognition) {
            alert("Voice recognition is not supported in this browser.")
            return;
        }
        if (isListening) recognition.stop()
        else recognition.start()
    }

    const handleResult = (transcript: string) => {
        if (wrapperRef.current) {
            const input = wrapperRef.current.querySelector('input, textarea') as HTMLInputElement | HTMLTextAreaElement
            if (input) {
                // React requires setting value via prototype setter for Change events to fire properly on dispatch
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
                const nativeTextAreaSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;

                const setter = input.tagName === 'INPUT' ? nativeInputValueSetter : nativeTextAreaSetter;

                if (setter) {
                    setter.call(input, transcript);
                } else {
                    input.value = transcript;
                }

                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.focus();
            }
        }
    }

    // Quick Fix: Re-implement logic inside handleMicClick/onresult because closures.
    // Actually, storing 'handleResult' in ref or using recognition object correctly.
    useEffect(() => {
        if (recognition) {
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript
                handleResult(transcript)
            }
        }
    }, [recognition])


    return (
        <div ref={wrapperRef} className={`relative group ${className || ''}`}>
            {children}
            <button
                type="button"
                onClick={handleMicClick}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all z-10 ${isListening
                        ? 'bg-rose-100 text-rose-600 animate-pulse ring-2 ring-rose-200'
                        : 'text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800'
                    }`}
                title="Dictate"
            >
                {isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
            </button>
        </div>
    )
}
