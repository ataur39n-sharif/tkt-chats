'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import Link from "next/link"
import { useState } from "react"

export default function SignUpPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const validateForm = () => {
        let isValid = true
        const newErrors = {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        }

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required'
            isValid = false
        }

        if (!formData.email) {
            newErrors.email = 'Email is required'
            isValid = false
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid'
            isValid = false
        }

        if (!formData.password) {
            newErrors.password = 'Password is required'
            isValid = false
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters'
            isValid = false
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (validateForm()) {
                console.log('Form submitted with values:', formData)
                const data = await axios.post('https://api.tkteats.com/api/v1/auth/register', {
                    ...formData,
                    role: "USER"
                })
                console.log({ data });
                if(data.status === 201) {
                    alert('User registered successfully. You can now login.')
                    // Redirect to login page
                    window.location.href = '/login'
                }
            }
        } catch (error) {
            console.error('Error registering user:', error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
                    <CardDescription>Create your account to get started</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    aria-invalid={errors.name ? 'true' : 'false'}
                                />
                                {errors.name && <p className="text-sm text-red-500" role="alert">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    aria-invalid={errors.email ? 'true' : 'false'}
                                />
                                {errors.email && <p className="text-sm text-red-500" role="alert">{errors.email}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    aria-invalid={errors.password ? 'true' : 'false'}
                                />
                                {errors.password && <p className="text-sm text-red-500" role="alert">{errors.password}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                                />
                                {errors.confirmPassword && <p className="text-sm text-red-500" role="alert">{errors.confirmPassword}</p>}
                            </div>
                        </div>
                        <Button className="w-full mt-6" type="submit">Sign Up</Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <p className="text-sm text-center text-gray-600 w-full">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary hover:underline">
                            Log in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}