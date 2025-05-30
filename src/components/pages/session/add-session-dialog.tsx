"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/text-area"
import api from "@/lib/axios"
import Cookies from "js-cookie"

interface AddSessionFormProps {
  onCancel: () => void
  onSuccess?: () => void
}

export default function AddSessionForm({ onCancel, onSuccess }: AddSessionFormProps) {
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
  const [divisions, setDivisions] = useState<{_id: string, name: string}[]>([])
  const [availableGroups, setAvailableGroups] = useState<{_id: string, name: string}[]>([])
  const [loadingGroups, setLoadingGroups] = useState(false)

  // Fetch divisions
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

  // Fetch groups when division changes
  useEffect(() => {
    const fetchGroups = async () => {
      if (!formData.division) return
      
      try {
        setLoadingGroups(true)
        const token = Cookies.get('accessToken')
        if (!token) return

        const response = await api.get(`/group/${formData.division}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          }
        })
        setAvailableGroups(response.data)
        setFormData(prev => ({ ...prev, groups: [] })) 
      } catch (err) {
        console.error("Failed to fetch groups:", err)
      } finally {
        setLoadingGroups(false)
      }
    }

    fetchGroups()
  }, [formData.division])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = Cookies.get('accessToken')
      if (!token) throw new Error("No authentication token")

      const response = await api.post('/session', {
        title: formData.title,
        description: formData.description,
        division: formData.division,
        groups: formData.groups,
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

      showToast("Session created successfully!", 'success')
      setTimeout(() => {
        onCancel()
        if (onSuccess) onSuccess() 
      }, 3000)
    } catch (err) {
      console.error("Failed to create session:", err)
      showToast("Failed to create session", 'error')
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

      <form onSubmit={handleSubmit} className="p-6 rounded-lg border max-w-2xl mx-auto relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="space-y-2">
            <Label htmlFor="division">Division</Label>
            <Select
              value={formData.division}
              onValueChange={(value) => setFormData({...formData, division: value})}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select division" />
              </SelectTrigger>
              <SelectContent>
                {divisions.map(division => (
                  <SelectItem key={division._id} value={division._id}>
                    {division.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter session description"
            value={formData.description}
            onChange={(e: { target: { value: any } }) => setFormData({...formData, description: e.target.value})}
            className="md:w-70 w-auto"
          />
        </div>

        <div className="md:grid md:grid-cols-3 md:gap-4 flex flex-col gap-2">
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

        <div className="space-y-2">
          <Label>Groups</Label>
          {loadingGroups ? (
            <div className="text-sm text-gray-500">Loading groups...</div>
          ) : availableGroups.length > 0 ? (
            <div className="flex gap-5">
              {availableGroups.map(group => (
                <div key={group._id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`group-${group._id}`}
                    checked={formData.groups.includes(group._id)}
                    onChange={() => handleGroupToggle(group._id)}
                    className="h-4 w-4 rounded border-gray-300 text-[#003081] focus:ring-[#003081]"
                  />
                  <label htmlFor={`group-${group._id}`} className="text-sm">
                    {group.name}
                  </label>
                </div>
              ))}
            </div>
          ) : formData.division ? (
            <div className="text-sm text-gray-500">No groups available for this division</div>
          ) : (
            <div className="text-sm text-gray-500">Please select a division first</div>
          )}
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
            disabled={loadingGroups}
          >
            Create Session
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