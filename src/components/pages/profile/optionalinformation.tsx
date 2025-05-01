"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "../../ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Textarea } from "../../ui/text-area"
import { format } from "date-fns"
import { CalendarIcon, FileIcon, UploadIcon, X } from "lucide-react"

interface OptionalInformationProps {
  formData: {
    university_id: string
    linkedin_handle: string
    codeforce_handle: string
    leetcode_handle: string
    instagram_handle: string
    optional_birth_date: string
    joining_date: string
    bio: string
    cv: File | null
    cv_link: string
  }
  handleChange: (field: string, value: string | File | null) => void
  onCancel: () => void
}

export default function OptionalInformation({ formData, handleChange, onCancel }: OptionalInformationProps) {
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(
    formData.optional_birth_date ? new Date(formData.optional_birth_date) : undefined,
  )

  const [joiningDate, setJoiningDate] = useState<Date | undefined>(
    formData.joining_date ? new Date(formData.joining_date) : undefined,
  )

  const [dragActive, setDragActive] = useState(false)

  const handleDateOfBirthChange = (date: Date | undefined) => {
    setDateOfBirth(date)
    if (date) {
      handleChange("optional_birth_date", format(date, "yyyy-MM-dd"))
    }
  }

  const handleJoiningDateChange = (date: Date | undefined) => {
    setJoiningDate(date)
    if (date) {
      handleChange("joining_date", format(date, "yyyy-MM-dd"))
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      handleChange("cv", file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      handleChange("cv", file)
    }
  }

  const removeFile = () => {
    handleChange("cv", null)
    handleChange("cv_link", "")
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="space-y-1">
            <Label htmlFor="university_id" className="text-gray-500 text-sm">University ID</Label>
            <Input
              id="university_id"
              value={formData.university_id}
              onChange={(e) => handleChange("university_id", e.target.value)}
              placeholder=""
              className="border border-gray-300 rounded-[8px] h-10"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="linkedin_handle" className="text-gray-500 text-sm">LinkedIn Handle</Label>
            <Input
              id="linkedin_handle"
              value={formData.linkedin_handle}
              onChange={(e) => handleChange("linkedin_handle", e.target.value)}
              placeholder=""
              className="border border-gray-300 rounded-[8px] h-10"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="codeforce_handle" className="text-gray-500 text-sm">Codeforces Handle</Label>
            <Input
              id="codeforce_handle"
              value={formData.codeforce_handle}
              onChange={(e) => handleChange("codeforce_handle", e.target.value)}
              placeholder=""
              className="border border-gray-300 rounded-[8px] h-10"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="leetcode_handle" className="text-gray-500 text-sm">LeetCode Handle</Label>
            <Input
              id="leetcode_handle"
              value={formData.leetcode_handle}
              onChange={(e) => handleChange("leetcode_handle", e.target.value)}
              placeholder=""
              className="border border-gray-300 rounded-[8px] h-10"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-1">
            <Label htmlFor="instagram_handle" className="text-gray-500 text-sm">Instagram Handle</Label>
            <Input
              id="instagram_handle"
              value={formData.instagram_handle}
              onChange={(e) => handleChange("instagram_handle", e.target.value)}
              placeholder=""
              className="border border-gray-300 rounded-[8px] h-10"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="optional_birth_date" className="text-gray-500 text-sm">Date of Birth</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button id="optional_birth_date" variant="outline" className="w-full justify-start text-left font-normal border border-gray-300 rounded-[8px] h-10">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateOfBirth ? format(dateOfBirth, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dateOfBirth} onSelect={handleDateOfBirthChange} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1">
            <Label htmlFor="cv" className="text-gray-500 text-sm">CV</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-4 w-full flex flex-col items-center justify-center space-y-2 h-10 ${
                dragActive ? "border-primary bg-primary/5" : "border-gray-300"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {formData.cv ? (
                <div className="flex items-center justify-between w-full p-2 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-2">
                    <FileIcon className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">{formData.cv.name}</p>
                      <p className="text-xs text-gray-500">{(formData.cv.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={removeFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : formData.cv_link ? (
                <div className="flex items-center justify-between w-full p-2 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-2">
                    <FileIcon className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Current CV</p>
                      <p className="text-xs text-gray-500">Previously uploaded</p>
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={removeFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <UploadIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-500">Upload CV</span>
                  <input
                    id="cv-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("cv-upload")?.click()}
                    className="border border-gray-300 rounded-[8px]"
                  >
                    Browse
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="joining_date" className="text-gray-500 text-sm">Joining Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button id="joining_date" variant="outline" className="w-full justify-start text-left font-normal border border-gray-300 rounded-[8px] h-10">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {joiningDate ? format(joiningDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={joiningDate} onSelect={handleJoiningDateChange} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1">
            <Label htmlFor="bio" className="text-gray-500 text-sm">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder=""
              className="min-h-[100px] border border-gray-300 rounded-[8px]"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-4 mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="rounded-[8px] h-10 px-6 bg-white border border-gray-300 hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="rounded-[8px] h-10 px-6 bg-[#003081] hover:bg-[#003081]/90 text-white"
        >
          Save
        </Button>
      </div>
    </div>
  )
}