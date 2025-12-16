'use client'

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Layers } from "lucide-react"
import { SignupForm } from "@/components/auth/signup-form"

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true)

    // Form State for Login
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault() // Client-side submit for login
        await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            callbackUrl: "/"
        })
    }

    if (isLogin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Layers className="text-white h-6 w-6" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                        <p className="text-gray-500 mt-2">Sign in to your dashboard</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="name@company.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-gray-100 pt-6">
                        <p className="text-gray-600">Don't have an account?</p>
                        <button
                            onClick={() => setIsLogin(false)}
                            className="text-blue-600 font-medium hover:text-blue-700 mt-2 hover:underline"
                        >
                            Start your 14-day free trial
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return <SignupForm setIsLogin={setIsLogin} />
}
