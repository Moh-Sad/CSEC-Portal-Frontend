"use client"

import { Pencil, Trash2 } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import api from "@/lib/axios"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface Member {
  _id: string
  user: {
    _id: string
    name: string
    avatar?: string
    role: string
  }
  division: {
    _id: string
    name: string
  }
  role: string
}

export default function HeadsTable() {
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null)
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
    const fetchHeads = async () => {
      const token = getAuthToken()
      if (!token) {
        router.push('/login')
        return
      }

      setIsLoading(true)
      try {
        const response = await api.get("/head", {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json'
          }
        })

        if (response.data?.data) {
          setMembers(response.data.data)
        } else {
          throw new Error("Invalid response structure")
        }
      } catch (error: any) {
        console.error("API Error:", error)
        if (error.response?.status === 403) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to view this resource",
            variant: "destructive",
            id: ""
          })
          router.push('/dashboard')
        } else {
          toast({
            title: "Error",
            description: error.response?.data?.message || "Failed to fetch data",
            variant: "destructive",
            id: ""
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchHeads()
  }, [toast, router])

  const handleDeleteClick = (member: Member) => {
    setMemberToDelete(member)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    if (!memberToDelete) return
    
    const token = getAuthToken()
    if (!token) {
      router.push('/login')
      return
    }

    try {
      // Using DELETE endpoint with user ID
      const response = await api.delete(`/head/${memberToDelete.user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json'
        }
      })

      // Remove the member from the heads list
      setMembers(members.filter(m => m._id !== memberToDelete._id))
      
      toast({
        title: "Success",
        description: response.data?.message || "Head removed successfully",
        id: ""
      })
    } catch (error: any) {
      console.error("Error removing head:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to remove head",
        variant: "destructive",
        id: ""
      })
    } finally {
      setShowDeleteConfirm(false)
      setMemberToDelete(null)
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
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 text-sm">
              <th className="pb-2 font-normal">Member Name</th>
              <th className="pb-2 font-normal">Division</th>
              <th className="pb-2 font-normal">Role</th>
              <th className="pb-2 font-normal">Action</th>
            </tr>
          </thead>
          <tbody>
            {members.length > 0 ? (
              members.map((member) => (
                <tr key={member._id} className="border-t border-gray-100">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        <Image
                          src={member.user.avatar || "/images/adminstartion.png"}
                          alt={member.user.name || "User Avatar"}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <span>{member.user.name}</span>
                    </div>
                  </td>
                  <td className="py-3">{member.division.name}</td>
                  <td className="py-3">{member.role === "division_head" ? "Head" : member.role}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button className="text-gray-500 hover:text-blue-600">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-gray-500 hover:text-red-600"
                        onClick={() => handleDeleteClick(member)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t border-gray-100">
                <td colSpan={4} className="py-8 text-center text-gray-500">
                  No members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && memberToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-4">
            <h2 className="text-xl font-semibold">Confirm Removal</h2>
            <p>Are you sure you want to remove {memberToDelete.user.name} as head of {memberToDelete.division.name}?</p>
            <div className="flex justify-end gap-3 pt-4">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="h-10 px-6 rounded-[8px] border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="h-10 px-6 rounded-[8px] bg-red-600 hover:bg-red-700 text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}