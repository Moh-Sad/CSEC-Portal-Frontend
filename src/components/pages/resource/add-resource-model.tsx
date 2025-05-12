"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { X } from "lucide-react"

interface DivisionOption {
  id: string
  name: string
}

interface AddResourceModalProps {
  open: boolean
  onClose: () => void
  onAddSuccess: (newResource: { name: string; link: string; division: string }) => Promise<void>
  division: string
  divisions: DivisionOption[]
}

export default function AddResourceModal({
  open,
  onClose,
  onAddSuccess,
  division: initialDivision,
  divisions,
}: AddResourceModalProps) {
  const [resourceName, setResourceName] = useState("")
  const [resourceLink, setResourceLink] = useState("")
  const [division, setDivision] = useState<string>(initialDivision)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      setDivision(initialDivision)
      setResourceName("")
      setResourceLink("")
    }
  }, [open, initialDivision])

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
      await onAddSuccess({
        name: resourceName,
        link: resourceLink,
        division: division,
      })
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 rounded-[8px]">
      <div className="rounded-[8px] w-100 mx-2">
        <form onSubmit={handleSubmit}>
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Resource</h2>
              <button 
                type="button" 
                onClick={onClose} 
                className="text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col space-y-4 items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
                <Select 
                  value={division} 
                  onValueChange={(value: string) => setDivision(value)}
                  disabled={isLoading}
                >
                  <SelectTrigger 
                  className="flex w-70 h-11 px-3 py-6 border-1 border-gray-300 rounded-[8px]">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Resource Name</label>
                <Input
                  type="text"
                  value={resourceName}
                  onChange={(e) => setResourceName(e.target.value)}
                  placeholder="Enter resource name"
                  required
                  disabled={isLoading}
                  className="flex w-70 h-11 px-3 py-6 border-1 border-gray-300 rounded-[8px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resource Link</label>
                <Input
                  type="url"
                  value={resourceLink}
                  onChange={(e) => setResourceLink(e.target.value)}
                  placeholder="Enter resource URL"
                  required
                  disabled={isLoading}
                  className="flex w-70 h-11 px-3 py-6 border-1 border-gray-300 rounded-[8px]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose} 
                  disabled={isLoading}
                  className="flex h-10 w-35 rounded-md items-center justify-center bg-[#34495E0D] cursor-pointer hover:bg-[#48637e0d]"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex h-10 w-35 rounded-md items-center justify-center text-white bg-[#003087] cursor-pointer hover:bg-[#002f87a2]"
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