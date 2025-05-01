"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ResourcesProps {
  formData: {
    resources: { name: string; link: string }[]
  }
  handleChange: (field: string, value: File | null) => void
  handleResourceChange: (index: number, field: string, value: string) => void
  addResource: () => void
  onSave?: () => void
  onCancel?: () => void
}

export default function Resources({ 
  formData, 
  handleResourceChange, 
  addResource,
  onSave,
  onCancel
}: ResourcesProps) {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Resources</h3>

        {formData.resources.map((resource, index) => (
          <div key={index} className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor={`resourceName-${index}`}>Resource Name</Label>
              <Input
                id={`resourceName-${index}`}
                value={resource.name}
                onChange={(e) => handleResourceChange(index, "name", e.target.value)}
                placeholder="Resource Name"
                className="border border-gray-300 rounded-[8px] h-10"
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor={`resourceLink-${index}`}>Resource Link</Label>
              <Input
                id={`resourceLink-${index}`}
                value={resource.link}
                onChange={(e) => handleResourceChange(index, "link", e.target.value)}
                placeholder="Resource Link"
                className="border border-gray-300 rounded-[8px] h-10"
              />
            </div>
            {index === formData.resources.length - 1 && (
              <Button 
                type="button" 
                onClick={addResource} 
                className="flex items-center gap-2 h-10 px-4 py-2 rounded-lg bg-[#003081] hover:bg-[#003081]/90 text-white mb-[2px]"
              >
                Add
              </Button>
            )}
          </div>
        ))}

        <div className="flex justify-end gap-4 pt-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
            className="h-10 px-4 py-2 rounded-lg border border-gray-300"
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={onSave}
            className="h-10 px-4 py-2 rounded-lg bg-[#003081] hover:bg-[#003081]/90 text-white"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}