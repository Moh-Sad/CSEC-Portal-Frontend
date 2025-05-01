"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { X } from "lucide-react"
import { DivisionType } from "./resource-page"

interface DivisionOption {
  id: string
  name: string
}

interface AddResourceModalProps {
  open: boolean
  onClose: () => void
  onAddSuccess: (newResource: { name: string; link: string; division: DivisionType }) => void
  division: DivisionType
  divisions: DivisionOption[]
}

export default function AddResourceModal({ 
  open,
  onClose, 
  onAddSuccess,
  division: initialDivision,
  divisions 
}: AddResourceModalProps) {
  const [resourceName, setResourceName] = useState("")
  const [resourceLink, setResourceLink] = useState("")
  const [division, setDivision] = useState<DivisionType>(initialDivision)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!resourceName.trim() || !resourceLink.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
        id: ""
      })
      return
    }

    setIsLoading(true)
    
    try {
      onAddSuccess({
        name: resourceName,
        link: resourceLink,
        division: division
      })

      setResourceName("")
      setResourceLink("")
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add resource",
        variant: "destructive",
        id: ""
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Resource</h2>
              <button 
                type="button" 
                onClick={onClose} 
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Division
                </label>
                <Select 
                  value={division} 
                  onValueChange={(value: DivisionType) => setDivision(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select division" />
                  </SelectTrigger>
                  <SelectContent>
                    {divisions.map((div) => (
                      <SelectItem key={div.id} value={div.id}>
                        {div.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resource Name
                </label>
                <Input
                  type="text"
                  value={resourceName}
                  onChange={(e) => setResourceName(e.target.value)}
                  placeholder="Enter resource name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resource Link
                </label>
                <Input
                  type="url"
                  value={resourceLink}
                  onChange={(e) => setResourceLink(e.target.value)}
                  placeholder="Enter resource URL"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={onClose} 
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#003081] hover:bg-[#002a6e]"
                >
                  {isLoading ? "Adding..." : "Add Resource"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}