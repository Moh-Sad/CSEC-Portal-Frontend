"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RequiredInformation from "@/components/pages/profile/requiredinformation"
import OptionalInformation from "@/components/pages/profile/optionalinformation"
import Resources from "@/components/pages/profile/resource"
import { UserIcon, FileTextIcon, FolderIcon } from "lucide-react"
import api from "@/lib/axios"
import Cookies from "js-cookie"

export default function MultiStepForm() {
  const [activeTab, setActiveTab] = useState("required")
  const [userId, setUserId] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [initialFormData, setInitialFormData] = useState({
    // Required Information
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    birth_date: "",
    gender: "",
    graduation_year: "",
    department: "",
    github_handle: "",
    telegram_handle: "",
    specialization: "",
    role: "",
    profile_picture: null as File | null,
    profile_picture_url: "",
    photo: null as File | null,

    // Optional Information
    university_id: "",
    linkedin_handle: "",
    codeforce_handle: "",
    leetcode_handle: "",
    instagram_handle: "",
    optional_birth_date: "",
    joining_date: "",
    bio: "",
    cv: null as File | null,
    cv_link: "",

    // Resources
    resources: [{ name: "", link: "" }],
  })

  const [formData, setFormData] = useState(initialFormData)
  const [toasts, setToasts] = useState<Array<{
    id: string
    title: string
    description: string
    variant: "default" | "destructive"
  }>>([])

  // Toast implementation
  const showToast = (title: string, description: string, variant: "default" | "destructive" = "default") => {
    const newToast = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      description,
      variant
    }
    setToasts(prev => [...prev, newToast])
    
    setTimeout(() => {
      removeToast(newToast.id)
    }, 5000)
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  // Toast UI component
  const Toast = ({ title, description, variant, onClose }: {
    title: string
    description: string
    variant: "default" | "destructive"
    onClose: () => void
  }) => {
    const bgColor = variant === "destructive" ? "bg-red-100" : "bg-green-100"
    const textColor = variant === "destructive" ? "text-red-800" : "text-green-800"
    const borderColor = variant === "destructive" ? "border-red-300" : "border-green-300"

    return (
      <div className={`fixed top-4 right-4 z-50 p-4 rounded-md border ${bgColor} ${borderColor} ${textColor} shadow-lg max-w-xs`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm mt-1">{description}</p>
          </div>
          <button 
            onClick={onClose}
            className="ml-4 text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
      </div>
    )
  }

  const resetForm = () => {
    setFormData(initialFormData)
    showToast("Form Reset", "All changes have been discarded")
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userString = localStorage.getItem("user")
        if (!userString) throw new Error("User data not found")
        
        const user = JSON.parse(userString)
        setUserId(user._id)
        
        const { personal_info } = user
        const initialData = {
          first_name: personal_info?.first_name || "",
          last_name: personal_info?.last_name || "",
          phone_number: personal_info?.phone_number || "",
          email: user.email || "",
          birth_date: personal_info?.birth_date ? new Date(personal_info.birth_date).toISOString().split('T')[0] : "",
          gender: personal_info?.gender || "",
          graduation_year: personal_info?.graduation_year?.toString() || "",
          department: personal_info?.department || "",
          github_handle: personal_info?.github_handle || "",
          telegram_handle: personal_info?.telegram_handle || "",
          specialization: personal_info?.specialization || "",
          role: user.role || "",
          profile_picture: null,
          profile_picture_url: personal_info?.profile_picture || "",
          photo: null,

          university_id: personal_info?.university_id || "",
          linkedin_handle: personal_info?.linkedin_handle || "",
          codeforce_handle: personal_info?.codeforce_handle || "",
          leetcode_handle: personal_info?.leetcode_handle || "",
          instagram_handle: personal_info?.instagram_handle || "",
          optional_birth_date: personal_info?.birth_date ? new Date(personal_info.birth_date).toISOString().split('T')[0] : "",
          joining_date: "",
          bio: "",
          cv: null,
          cv_link: personal_info?.cv_link || "",

          resources: personal_info?.resources?.map((res: any) => ({
            name: res.name || "",
            link: res.link || ""
          })) || [{ name: "", link: "" }]
        }

        setInitialFormData(initialData)
        setFormData(initialData)
      } catch (error) {
        showToast("Error", "Failed to load user data", "destructive")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleChange = (field: string, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleResourceChange = (index: number, field: string, value: string) => {
    const updatedResources = [...formData.resources]
    updatedResources[index] = { ...updatedResources[index], [field]: value }
    setFormData(prev => ({
      ...prev,
      resources: updatedResources
    }))
  }

  const addResource = () => {
    setFormData(prev => ({
      ...prev,
      resources: [...prev.resources, { name: "", link: "" }]
    }))
  }

  const handleSubmitRequiredOptional = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const token = Cookies.get('accessToken')
      if (!token) throw new Error("Authentication required")
  
      const formPayload = new FormData()
      
      // Append all personal info fields
      formPayload.append('first_name', formData.first_name)
      formPayload.append('last_name', formData.last_name)
      formPayload.append('phone_number', formData.phone_number)
      formPayload.append('email', formData.email)
      formPayload.append('birth_date', formData.birth_date)
      formPayload.append('gender', formData.gender)
      formPayload.append('graduation_year', formData.graduation_year)
      formPayload.append('department', formData.department)
      formPayload.append('github_handle', formData.github_handle)
      formPayload.append('telegram_handle', formData.telegram_handle)
      formPayload.append('specialization', formData.specialization)
      formPayload.append('university_id', formData.university_id)
      formPayload.append('linkedin_handle', formData.linkedin_handle)
      formPayload.append('leetcode_handle', formData.leetcode_handle)
      formPayload.append('codeforce_handle', formData.codeforce_handle)
      formPayload.append('instagram_handle', formData.instagram_handle)
      formPayload.append('bio', formData.bio)
  
      // Handle optional dates only if they exist
      if (formData.optional_birth_date) {
        formPayload.append('optional_birth_date', formData.optional_birth_date)
      }
      if (formData.joining_date) {
        formPayload.append('joining_date', formData.joining_date)
      }
  
      // Handle file uploads
      if (formData.profile_picture) {
        formPayload.append('profile_picture', formData.profile_picture)
      }
      if (formData.cv) {
        formPayload.append('cv', formData.cv)
      }
  
      const response = await api.put(`/user/update-full-info/${userId}`, formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      })
  
      showToast("Success", "Profile updated successfully")
      
      const updatedUser = response.data.user
      localStorage.setItem("user", JSON.stringify(updatedUser))
  
      // Update form data with new values from server
      setInitialFormData({
        ...initialFormData,
        ...updatedUser.personal_info,
        profile_picture_url: updatedUser.personal_info?.profile_picture || "",
        cv_link: updatedUser.personal_info?.cv_link || ""
      })
      setFormData({
        ...formData,
        ...updatedUser.personal_info,
        profile_picture_url: updatedUser.personal_info?.profile_picture || "",
        cv_link: updatedUser.personal_info?.cv_link || ""
      })
  
    } catch (error: any) {
      showToast(
        "Error", 
        error.response?.data?.message || "Failed to update profile", 
        "destructive"
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitResources = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const token = Cookies.get('accessToken')
      if (!token) throw new Error("Authentication required")

      const response = await api.put(`/user/update-full-info/${userId}`, {
        resources: formData.resources.filter(r => r.name && r.link)
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      })

      showToast("Success", "Resources updated successfully")

      const updatedUser = response.data.user
      localStorage.setItem("user", JSON.stringify(updatedUser))

    } catch (error: any) {
      showToast(
        "Error",
        error.response?.data?.message || "Failed to update resources",
        "destructive"
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    if (activeTab === "required") {
      setActiveTab("optional")
    } else if (activeTab === "optional") {
      setActiveTab("resources")
    }
  }

  const handlePrevious = () => {
    if (activeTab === "optional") {
      setActiveTab("required")
    } else if (activeTab === "resources") {
      setActiveTab("optional")
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-full mx-auto rounded-lg shadow-md">
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            title={toast.title}
            description={toast.description}
            variant={toast.variant}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="required"
            className="flex items-center gap-2 data-[state=active]:text-[#003081] data-[state=active]:border-b-2 data-[state=active]:border-[#003081]"
          >
            <UserIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Required Information</span>
          </TabsTrigger>
          <TabsTrigger
            value="optional"
            className="flex items-center gap-2 data-[state=active]:text-[#003081] data-[state=active]:border-b-2 data-[state=active]:border-[#003081]"
          >
            <FileTextIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Optional Information</span>
          </TabsTrigger>
          <TabsTrigger
            value="resources"
            className="flex items-center gap-2 data-[state=active]:text-[#003081] data-[state=active]:border-b-2 data-[state=active]:border-[#003081]"
          >
            <FolderIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Resources</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="required">
          <form onSubmit={handleSubmitRequiredOptional}>
            <RequiredInformation
              formData={formData}
              handleChange={handleChange}
              onNext={handleNext}
              onCancel={resetForm}
            />
          </form>
        </TabsContent>

        <TabsContent value="optional">
          <form onSubmit={handleSubmitRequiredOptional}>
            <OptionalInformation 
              formData={formData} 
              handleChange={handleChange} 
              onCancel={resetForm}
            />
          </form>
        </TabsContent>

        <TabsContent value="resources">
          <form onSubmit={handleSubmitResources}>
            <Resources
              formData={formData}
              handleChange={handleChange}
              handleResourceChange={handleResourceChange}
              addResource={addResource}
              onCancel={resetForm}
            />
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}