"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  formSchema,
  FormData,
} from "@/components/features/Validation/LoginValidate";
import { handleLogin } from "@/components/features/Auth/LoginAuth";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/components/icons/images/Logoipsum.png";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const remember = watch("rememberMe");

  const onSubmit = async (data: FormData) => {
  setLoginError(null);
  setIsLoading(true);

  try {
    const result = await handleLogin(data);

    if (result.success) {
      window.location.href = '/dashboard';
    } else {
      setLoginError(result.error || "Login failed");
    }
  } catch (error) {
    setLoginError("An unexpected error occurred");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="relative flex flex-col mx-auto w-full max-w-md space-y-6 p-6">
      <div className="flex items-center space-x-2">
        <Image src={logo} alt="Logoipsum" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Welcome 👋</h1>
        <p className="text-sm text-muted-foreground">Please login here</p>
      </div>

      {loginError && <div className="text-red-500 text-sm">{loginError}</div>}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        {/* Email Input */}
        <div className="flex flex-col justify-end space-y-2">
          <div className="relative bg-white">
            <Input
              id="email"
              type="email"
              placeholder="robertallen@example.com"
              className={`transition-all duration-200 p-4 rounded-xl border-1 border-gray-300 ${
                emailFocused ? "h-16" : "h-12"
              }`}
              {...register("email")}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
            {emailFocused && (
              <div className="absolute left-3 top-1 text-[#0a2463] font-medium text-sm">
                Email Address
              </div>
            )}
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              className={`transition-all duration-200 py-5 rounded-xl border-1 border-gray-300 ${
                passwordFocused ? "h-16" : "h-12"
              }`}
              {...register("password")}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            {passwordFocused && (
              <div className="absolute left-3 top-1 text-[#0a2463] font-medium text-sm">
                Password
              </div>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </Button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex gap-2 items-center space-x-2">
          <Checkbox
            id="remember"
            checked={remember}
            onCheckedChange={(checked) =>
              setValue("rememberMe", Boolean(checked))
            }
          />
          <Label
            htmlFor="remember"
            className="text-sm font-medium text-gray-700"
          >
            Remember Me
          </Label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-10 rounded-[8px] text-white bg-[#0a2463] hover:bg-[#0a2463]/90 flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>

      <div className="absolute right-4 flex justify-center items-center">
        <Popover>
          <PopoverTrigger className="text-xl  border-1 border-[#003087] rounded-full p-2 h-11 w-11 cursor-pointer hover:bg-black/5">
            ?
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col gap-1">
              <h1 className="flex justify-center font-bold">
                Want to Explore?!
              </h1>
              <div>
                <p className="font-semibold">President:</p>
                <p>Email: kiyakebe799@gmail.com</p>
                <p>Password: 12345678</p>
              </div>
              <div>
                <p className="font-semibold">Divison Head:</p>
                <p>Email: mohsad.7676@gmail.com</p>
                <p>Password: 12345678</p>
              </div>
              <div>
                <p className="font-semibold">Member:</p>
                <p>Email: user1@example.com</p>
                <p>Password: 12345678</p>
              </div>
              <Link href={'/FAQs'} className="flex justify-end text-[#003087] cursor-pointer">Need to know more!</Link>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
