"use client"

import { useState } from "react"
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Logo from '@/components/icons/images/Logoipsum.png'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter();

  return (
    <div className="flex flex-col mx-auto w-100 max-w-md space-y-6 p-6">
      <div className="flex items-center space-x-2">
        <Image src={Logo} alt="Logoipsum" className="h-8 w-55" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Welcome 👋</h1>
        <p className="text-sm text-muted-foreground">Please login here</p>
      </div>

      <form className="flex flex-col space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#0a2463] font-medium">
            Email Address
          </Label>
          <Input id="email" type="email" placeholder="robertallen@example.com" className="p-5 focus:border-[#003081] focus:outline-none"/>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-[#0a2463] font-medium">
            Password
          </Label>
          <div className="relative">
            <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••••••" />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
            </Button>
          </div>
        </div>

        <div className="flex gap-2 items-center space-x-2">
          <Checkbox id="remember" defaultChecked />
          <Label htmlFor="remember" className="text-sm font-medium text-gray-700">
            Remember Me
          </Label>
        </div>

        <Button
          type="button"
          className="w-full h-10 rounded-[8px] text-white bg-[#0a2463] hover:bg-[#0a2463]/90"
          onClick={() => {
            router.push('/dashboard');
          }}
        >
          Login
        </Button>
      </form>
    </div>
  )
}
