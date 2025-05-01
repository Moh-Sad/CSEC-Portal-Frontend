'use client';

import { FormData } from "@/components/features/Validation/LoginValidate";
import Cookies from "js-cookie";

export async function handleLogin(data: FormData) {
  const API_URL = `${process.env.NEXT_PUBLIC_API_ENDPOINT}auth/login`;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data }),
      credentials: "include",
    });

    const responseData = await response.json();
    const accessToken = responseData.accessToken;
    const refreshToken = responseData.refreshToken || null;
    const role = responseData.user?.role || null;
    const user = responseData.user || null;

    if (!accessToken && !role) {
      throw new Error("Missing access token or role from server.");
    }

    // Build cookie options
    const cookieOptions = {
      secure: process.env.NODE_ENV === 'production',
      ...(data.rememberMe ? { expires: 7 } : {}),
    };

    // Set cookies
    Cookies.set('accessToken', accessToken, cookieOptions);
    Cookies.set('refreshToken', refreshToken, cookieOptions);
    Cookies.set('role', role, cookieOptions);

    // Store only the user object in localStorage
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }

    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    console.log("Login failed:", error);
    // Clear user data on error
    localStorage.removeItem('user');
    return {
      success: false,
      error: error instanceof Error ? error.message : "Login failed. Please try again.",
    };
  }
}