'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import Link from "next/link"
import { useState } from "react"

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({ email: '', password: '' })

    const validateForm = () => {
        let isValid = true
        const newErrors = { email: '', password: '' }

        if (!email) {
            newErrors.email = 'Email is required'
            isValid = false
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid'
            isValid = false
        }

        if (!password) {
            newErrors.password = 'Password is required'
            isValid = false
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (validateForm()) {
                console.log('Form submitted with values:', { email, password })
                // Here you would typically call your login API
                const response = await axios.post('https://api.tkteats.com/api/v1/auth/login', { email, password })
                console.log({ response });
                if (response.status === 200) {
                    console.log(response.data.data.token);
                    
                    localStorage.setItem('token', response.data.data.token)
                    localStorage.setItem('uid', response.data.data.uid)
                    alert('Login successful. You can now access your account.')
                    // Redirect to home page
                    window.location.href = '/chat'
                }
            }
        } catch (error) {
            console.error('Error logging in:', error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Login</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    aria-invalid={errors.email ? 'true' : 'false'}
                                />
                                {errors.email && <p className="text-sm text-red-500" role="alert">{errors.email}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    aria-invalid={errors.password ? 'true' : 'false'}
                                />
                                {errors.password && <p className="text-sm text-red-500" role="alert">{errors.password}</p>}
                            </div>
                        </div>
                        <Button className="w-full mt-6" type="submit">Log in</Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <p className="text-sm text-center text-gray-600 w-full">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-primary hover:underline">
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}