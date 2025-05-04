"use client"

import { Pencil, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import api from "@/lib/axios"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface Role {
  role: string
  permissions: string[]
  status?: string
}

export default function RolesTable() {
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      const match = document.cookie.match(/accessToken=([^;]+)/)
      return match?.[1] || null
    }
    return null
  }

  useEffect(() => {
    const fetchRoles = async () => {
      const token = getAuthToken()
      if (!token) {
        router.push('/login')
        return
      }

      setIsLoading(true)
      try {
        const response = await api.get("/user/roles", {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json'
          }
        })
        
        if (response.data?.roles) {
          const formattedRoles = response.data.roles.map((role: { role: string }) => ({
            ...role,
            status: "active",
            name: formatRoleName(role.role)
          }))
          setRoles(formattedRoles)
        } else {
          throw new Error("Invalid roles data structure")
        }
      } catch (error: any) {
        console.error("Error fetching roles:", error)
        
        let errorMessage = "Failed to fetch roles"
        if (error.response) {
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
      } finally {
        setIsLoading(false)
      }
    }

    fetchRoles()
  }, [toast, router])

  const formatRoleName = (role: string) => {
    return role.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {roles.length > 0 ? (
        roles.map((role, index) => (
          <div key={index} className="border border-gray-100 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    role.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}
                >
                  {role.status === "active" ? "Active" : "Inactive"}
                </span>
                <span className="font-medium">{formatRoleName(role.role)}</span>
              </div>
              <div className="flex gap-2">
                <button className="text-gray-500 hover:text-blue-600">
                  <Pencil className="w-4 h-4" />
                </button>
                <button className="text-gray-500 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-2">Permissions</div>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission, idx) => (
                  <span key={idx} className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                    {permission.charAt(0).toUpperCase() + permission.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          No roles found
        </div>
      )}
    </div>
  )
}