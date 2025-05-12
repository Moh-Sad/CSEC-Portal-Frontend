"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/text-area"
import api from "@/lib/axios"
import Cookies from "js-cookie"

interface AddCalendarFormProps {
  onCancel: () => void
  onSuccess?: () => void
}

export default function AddCalendarForm({ onCancel, onSuccess }: AddCalendarFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    division: "",
    groups: [] as string[],
    date: "",
    startTime: "",
    endTime: "",
    status: "planned"
  })
  const [toast, setToast] = useState<{show: boolean, message: string, type: 'success' | 'error'}>({show: false, message: '', type: 'success'})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = Cookies.get('accessToken')
      if (!token) throw new Error("No authentication token")

      const response = await api.post('/calendar', {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        status: "planned"
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      })

      showToast("Calendar created successfully!", 'success')
      setTimeout(() => {
        onCancel()
        if (onSuccess) onSuccess() 
      }, 3000)
    } catch (err) {
      console.error("Failed to create Calendar:", err)
      showToast("Failed to create Calendar", 'error')
    }
  }

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({show: true, message, type})
    setTimeout(() => setToast({show: false, message: '', type: 'success'}), 3000)
  }

  const handleGroupToggle = (groupId: string) => {
    setFormData(prev => ({
      ...prev,
      groups: prev.groups.includes(groupId)
        ? prev.groups.filter(id => id !== groupId)
        : [...prev.groups, groupId]
    }))
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`
          fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg
          ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white
          animate-fade-in
        `}>
          {toast.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-5 w-fit h-fit border-1 border-gray-300 rounded-[8px] bg-white dark:bg-gray-800">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter session title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-fit justify-start text-left font-normal p-2 border-1 border-gray-200 rounded-[10px]"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter session description"
            value={formData.description}
            onChange={(e: { target: { value: any } }) => setFormData({...formData, description: e.target.value})}
            className="w-70"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-40 justify-start text-left font-normal p-2 border-1 border-gray-200 rounded-[10px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({...formData, startTime: e.target.value})}
              className="w-fit justify-start text-left font-normal p-2 border-1 border-gray-200 rounded-[10px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({...formData, endTime: e.target.value})}
              className="w-fit justify-start text-left font-normal p-2 border-1 border-gray-200 rounded-[10px]"
              required
            />
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="none"
            onClick={onCancel}
            className="h-10 border-1 border-gray-300 rounded-[8px] p-2 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="none"
            className="bg-[#003081] h-10 rounded-[8px] p-2 text-white hover:bg-[#00206077] cursor-pointer"
          >
            Create Calendar
          </Button>
        </div>
      </form>

      {/* CSS for the toast animation */}
      <style jsx>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}