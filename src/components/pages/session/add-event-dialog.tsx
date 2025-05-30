"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Cookies from "js-cookie"
import api from "@/lib/axios"
import { Textarea } from "@/components/ui/text-area"

interface AddEventFormProps {
  onCancel: () => void
  onSuccess?: () => void
}

export default function AddEventForm({ onCancel, onSuccess }: AddEventFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [visibility, setVisibility] = useState<"public" | "member">("public")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [division, setDivision] = useState("")
  const [status, setStatus] = useState<"planned" | "started" | "ended">("planned")
  const [loading, setLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [divisions, setDivisions] = useState<{_id: string, name: string}[]>([])

  // Fetch divisions from API
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const token = Cookies.get('accessToken')
        if (!token) return

        const response = await api.get('/division', {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          }
        })
        setDivisions(response.data.data)
      } catch (err) {
        console.error("Failed to fetch divisions:", err)
      }
    }

    fetchDivisions()
  }, [])

  const handleSubmit = async () => {
    if (!title || !date) {
      setToastMessage("Title and date are required")
      setToastType('error')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }

    setLoading(true)
    try {
      const token = Cookies.get('accessToken')
      if (!token) throw new Error("No authentication token found")

        const eventData = {
          title,
          description,
          date: new Date(date).toISOString(), 
          time: time || undefined,
          visibility,
          status: "planned"
        }

      await api.post('/event', eventData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        },
        withCredentials: false
      })

      setToastMessage("Event created successfully!")
      setToastType('success')
      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
        onCancel()
        if (onSuccess) onSuccess() 
      }, 3000)
    } catch (error) {
      console.error("Failed to create event:", error)
      setToastMessage("Failed to create event")
      setToastType('error')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 rounded-lg border max-w-2xl mx-auto relative">
      <h2 className="text-xl font-bold mb-6">Add New Event</h2>

      {/* Toast Notification */}
      {showToast && (
        <div className={`absolute top-4 right-4 text-white px-4 py-2 rounded-md shadow-lg ${
          toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {toastMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="event-title">Event Title</Label>
            <Input 
              id="event-title" 
              placeholder="Enter event title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-fit justify-start text-left font-normal p-2 border-1 border-gray-200 rounded-[10px]"
            />
          </div>

          <div>
            <Label htmlFor="event-description">Description</Label>
            <Textarea 
              id="event-description" 
              placeholder="Enter event description" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="md:w-70 w-auto"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="event-date">Select Date</Label>
            <Input
              id="event-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-40 justify-start text-left font-normal p-2 border-1 border-gray-200 rounded-[10px]"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="block mb-2">Select Visibility</Label>
            <RadioGroup
              value={visibility}
              className="flex justify-between"
              onValueChange={(value) => setVisibility(value as "public" | "member")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public">Public</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="member" id="member" />
                <Label htmlFor="member">Only for Members</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="event-time">Time</Label>
            <Input 
              id="event-time" 
              type="time" 
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-40 justify-start text-left font-normal p-2 border-1 border-gray-200 rounded-[10px]"
            />
          </div>

        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          onClick={onCancel} 
          className="h-10 border-1 border-gray-300 rounded-[8px] p-2 cursor-pointer"
        >
          Cancel
        </Button>
        <Button 
          className="bg-[#003081] h-10 rounded-[8px] p-2 text-white hover:bg-[#00206077] cursor-pointer"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
        </Button>
      </div>
    </div>
  )
}