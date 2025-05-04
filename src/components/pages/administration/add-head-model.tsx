"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import api from "@/lib/axios"
import { useToast } from "@/components/ui/use-toast"

interface User {
  _id: string
  name: string
  email: string
}

interface Division {
  id: string
  name: string
}

interface DivisionResponse {
  _id: string
  name: string
  members: User[]
}

interface AddHeadModalProps {
  onClose: () => void
}

const DIVISIONS: Division[] = [
  { id: "680a9a2b9e86262d7c618bd1", name: "CPD" },
  { id: "680a9a2c9e86262d7c618bd4", name: "DEV" },
  { id: "680a9a2d9e86262d7c618bd7", name: "CYBER" },
  { id: "680a9a2e9e86262d7c618bda", name: "DATA SCIENCE" }
]

export default function AddHeadModal({ onClose }: AddHeadModalProps) {
  const [selectedRole, setSelectedRole] = useState("")
  const [selectedDivision, setSelectedDivision] = useState("")
  const [selectedUser, setSelectedUser] = useState("")
  const [divisionUsers, setDivisionUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    // Get token from cookies
    const match = document.cookie.match(/accessToken=([^;]+)/)
    setToken(match?.[1] || "")
  }, [])

  const fetchDivisionMembers = async (divisionId: string) => {
    if (!token || !divisionId) return
    
    setIsLoading(true)
    try {
      // Fetch division data including members with timeout
      const response = await api.get<DivisionResponse>(`/division/${divisionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        },
      })
      
      if (response.data?.members) {
        setDivisionUsers(response.data.members)
      } else {
        toast({
          title: "No Members Found",
          description: `No members found in ${DIVISIONS.find(d => d.id === divisionId)?.name} division`,
          variant: "default",
          id: ""
        })
        setDivisionUsers([])
      }
    } catch (error: any) {
      console.error("Error fetching division:", error)
      let errorMessage = "Failed to fetch division data"
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = "Request timed out. Please try again."
      } else if (error.response) {
        errorMessage = error.response.data?.message || errorMessage
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection."
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        id: ""
      })
      setDivisionUsers([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (selectedDivision) {
      fetchDivisionMembers(selectedDivision)
      setSelectedUser("")
    } else {
      setDivisionUsers([])
    }
  }, [selectedDivision])

  const handleAssign = async () => {
    if (!selectedUser || !selectedDivision || !selectedRole) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
        id: ""
      })
      return
    }

    try {
      const response = await api.post("/head", {
        userId: selectedUser,
        divisionId: selectedDivision,
        role: selectedRole === "head" ? "division_head" : "vice_president"
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json'
        }
      })

      toast({
        title: "Success",
        description: response.data?.message || "Head assigned successfully",
        id: ""
      })
      onClose()
    } catch (error: any) {
      console.error("Error assigning head:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to assign head",
        variant: "destructive",
        id: ""
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-6">
        <h2 className="text-xl font-semibold">Add New Head</h2>

        <div className="space-y-4">
          <div>
            <Select onValueChange={setSelectedRole} value={selectedRole}>
              <SelectTrigger className="w-full text-gray-400">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="head">Head</SelectItem>
                <SelectItem value="vice-president">Vice President</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select 
              onValueChange={setSelectedDivision} 
              value={selectedDivision}
            >
              <SelectTrigger className="w-full text-gray-400">
                <SelectValue placeholder="Select Division" />
              </SelectTrigger>
              <SelectContent>
                {DIVISIONS.map((division) => (
                  <SelectItem key={division.id} value={division.id}>
                    {division.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select 
              onValueChange={setSelectedUser} 
              value={selectedUser}
              disabled={!selectedDivision || isLoading}
            >
              <SelectTrigger className="w-full text-gray-400">
                <SelectValue placeholder={
                  isLoading ? "Loading members..." : 
                  selectedDivision ? "Select member" : "Select division first"
                } />
              </SelectTrigger>
              <SelectContent>
                {divisionUsers.length > 0 ? (
                  divisionUsers.map((user) => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))
                ) : (
                  <div className="text-sm text-gray-500 p-2">
                    {selectedDivision && !isLoading ? "No members found in this division" : ""}
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="h-10 px-6 rounded-[8px] border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAssign}
            className="h-10 px-6 rounded-[8px] bg-[#003081] hover:bg-[#002a6e] text-white"
            disabled={!selectedUser || !selectedDivision || !selectedRole || isLoading}
          >
            Assign
          </Button>
        </div>
      </div>
    </div>
  )
}