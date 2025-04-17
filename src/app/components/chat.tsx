'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useChat } from "ai/react"
import { useRef, useEffect, useState } from 'react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sparkles } from "lucide-react"

export function Chat() {
    const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat();
    const chatParent = useRef<HTMLUListElement>(null)
    const [showError, setShowError] = useState<boolean>(false);

    useEffect(() => {
        const domNode = chatParent.current
        if (domNode) {
            domNode.scrollTop = domNode.scrollHeight
        }
    })

    useEffect(() => {
        if (error) {
            setShowError(true);
            const timer = setTimeout(() => setShowError(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    return (
        <main className="flex flex-col w-full min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {/* Header with gradient and logo */}
            <header className="sticky top-0 z-10 backdrop-blur-md bg-white/75 dark:bg-slate-900/75 border-b border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="max-w-4xl mx-auto p-4 flex items-center">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-purple-500" />
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
                            SparkAI
                        </h1>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 ml-2">
                        Powered by OpenRouter
                    </span>
                </div>
            </header>

            {showError && (
                <Alert variant="destructive" className="w-full max-w-4xl mx-auto mt-2">
                    <AlertDescription>
                        {error?.message || "Something went wrong. Please try again."}
                    </AlertDescription>
                </Alert>
            )}

            {/* Chat messages area */}
            <section className="flex-grow px-4 py-6">
                <div className="max-w-4xl mx-auto h-full flex flex-col">
                    <ul ref={chatParent} className="flex-grow mb-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-y-auto flex flex-col gap-6">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                <Sparkles className="h-12 w-12 text-purple-400 mb-4" />
                                <h2 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-200">Welcome to SparkAI</h2>
                                <p className="text-slate-600 dark:text-slate-400 max-w-md">
                                    Your intelligent conversation partner. Ask me anything to get started!
                                </p>
                            </div>
                        ) : (
                            messages.map((m, index) => (
                                <li key={index} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div 
                                        className={`
                                            max-w-[80%] rounded-2xl p-4 shadow-sm
                                            ${m.role === 'user' 
                                                ? 'bg-purple-500 text-white rounded-tr-none' 
                                                : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-tl-none'
                                            }
                                        `}
                                    >
                                        <p className={m.role === 'user' ? 'text-white' : 'text-slate-800 dark:text-slate-100'}>
                                            {m.content}
                                        </p>
                                    </div>
                                </li>
                            ))
                        )}
                        {isLoading && (
                            <li className="flex justify-start">
                                <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl rounded-tl-none p-4 max-w-[80%] shadow-sm">
                                    <div className="flex items-center space-x-2">
                                        <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                        <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                        <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
                                    </div>
                                </div>
                            </li>
                        )}
                    </ul>

                    {/* Input form */}
                    <div className="sticky bottom-0 p-4 bg-white white:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                        <form onSubmit={handleSubmit} className="flex items-center gap-2">
                            <Input 
                                className="flex-1 bg-blue-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus-visible:ring-purple-500"
                                placeholder="Ask anything..." 
                                value={input} 
                                onChange={handleInputChange} 
                                disabled={isLoading}
                            />
                            <Button 
                                type="submit" 
                                disabled={isLoading || !input.trim()}
                                className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
                            >
                                {isLoading ? 'Thinking...' : 'Send'}
                            </Button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    )
}