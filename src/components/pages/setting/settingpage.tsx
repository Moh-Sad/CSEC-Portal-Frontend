"use client"

import { ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import Cookies from "js-cookie"
import api from "@/lib/axios"

export default function SettingsPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [autoAddEvents, setAutoAddEvents] = useState(true)
  const [phonePublic, setPhonePublic] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  // Initialize phonePublic state from API (only runs once on mount)
  useEffect(() => {
    const fetchUserPhoneVisibility = async () => {
      try {
        const token = Cookies.get('accessToken')
        if (!token) return

        // Get user ID from localStorage
        const userString = localStorage.getItem("user")
        if (!userString) return
        
        const user = JSON.parse(userString)
        const memberId = user._id

        // Fetch current visibility status from API
        const response = await api.get(`/user/${memberId}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          },
          withCredentials: false
        })

        // Set initial state from API response
        setPhonePublic(response.data.user.displayPhoneNumber || false)
        setInitialized(true)
      } catch (error) {
        console.error("Error fetching user phone visibility:", error)
        setInitialized(true) // Still mark as initialized
      }
    }

    fetchUserPhoneVisibility()
  }, [])

  const handlePhoneToggle = async () => {
    if (!initialized) return
    
    const newValue = !phonePublic
    setPhonePublic(newValue) // Optimistic UI update

    try {
      const token = Cookies.get('accessToken')
      if (!token) {
        setPhonePublic(phonePublic) // Revert if no token
        return
      }

      await api.patch('/user/toggle-phone-visibility', null, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        },
        withCredentials: false
      })

      // Update local storage with new value
      const userString = localStorage.getItem("user")
      if (userString) {
        const user = JSON.parse(userString)
        const updatedUser = {
          ...user,
          displayPhoneNumber: newValue
        }
        localStorage.setItem("user", JSON.stringify(updatedUser))
      }
    } catch (error) {
      console.error("Error toggling phone visibility:", error)
      setPhonePublic(phonePublic) // Revert on error
    }
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : ''}`}>
      {/* Settings content */}
      <div className="p-4 mx-auto w-full max-w-2xl flex-1 overflow-auto">
        <div className="w-full">
          {/* Appearance Setting with Theme button */}
          <div className={`py-4 border-b ${theme === 'dark' ? 'border-gray-700' : ''} flex justify-between items-center`}>
            <div className="flex-1 pr-4">
              <h3 className="font-medium mb-1 text-base sm:text-lg">Appearance</h3>
              <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                Customise how your theme looks on your device
              </p>
            </div>
            <div className="ml-4">
              <button 
                className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100'} text-xs sm:text-sm px-3 py-1.5 rounded flex items-center`}
                onClick={toggleTheme}
              >
                {theme === 'light' ? 'Light' : 'Dark'}
                <ChevronRight className="h-3 w-3 ml-1" />
              </button>
            </div>
          </div>

          {/* Calendar Setting */}
          <div className={`hidden py-4 border-b ${theme === 'dark' ? 'border-gray-700' : ''} flex justify-between items-center`}>
            <div className="flex-1 pr-4">
              <h3 className="font-medium mb-1 text-base sm:text-lg">Automatically Add Sessions to Calendar</h3>
              <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                Save time by auto-adding sessions to your calendar, or manually enter them for more control.
              </p>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input 
                type="checkbox" 
                id="calendar-toggle" 
                className="sr-only" 
                checked={autoAddEvents}
                onChange={() => setAutoAddEvents(!autoAddEvents)}
              />
              <label
                htmlFor="calendar-toggle"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer ${autoAddEvents ? 'bg-blue-600' : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}
              >
                <span className="block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out" 
                  style={{ transform: autoAddEvents ? 'translateX(16px)' : 'translateX(0)' }}></span>
              </label>
            </div>
          </div>

          {/* Phone Privacy Setting */}
          <div className={`py-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
            <div className="flex-1 pr-4">
              <h3 className="font-medium mb-1 text-base sm:text-lg">Make your Phone Public</h3>
              <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                Keep your phone private for safety, or share it for convenience.
              </p>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input 
                type="checkbox" 
                id="phone-toggle" 
                className="sr-only" 
                checked={phonePublic}
                onChange={handlePhoneToggle}
                disabled={!initialized}
              />
              <label
                htmlFor="phone-toggle"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer ${!initialized ? 'bg-gray-400' : phonePublic ? 'bg-blue-600' : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}
              >
                <span className={`block h-6 w-6 rounded-full shadow transform transition-transform duration-200 ease-in-out ${!initialized ? 'bg-gray-200' : 'bg-white'}`} 
                  style={{ transform: phonePublic ? 'translateX(16px)' : 'translateX(0)' }}></span>
              </label>
              {!initialized && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}