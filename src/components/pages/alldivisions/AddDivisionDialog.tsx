"use client"

import { MdAddCircleOutline } from "react-icons/md"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import Cookies from "js-cookie"
import api from "@/lib/axios"

interface AddDivisionDialogProps {
  onDivisionAdded: () => void
}

export function AddDivisionDialog({ onDivisionAdded }: AddDivisionDialogProps) {
  const [open, setOpen] = useState(false)
  const [head, setHead] = useState("")
  const [divisionName, setDivisionName] = useState("")
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  // Show toast for 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  useEffect(() => {
    if (open) {
      fetchUsers()
    }
  }, [open])

  const fetchUsers = async () => {
    try {
      const token = Cookies.get("accessToken")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await api.get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      })

      setUsers(response.data.data)
    } catch (error) {
      console.error("Failed to fetch users:", error)
      setToast({ message: "Failed to load users. Please try again.", type: "error" })
    }
  }

  const handleSubmit = async () => {
    if (!divisionName) {
      setToast({ message: "Division name is required", type: "error" })
      return
    }

    try {
      setLoading(true)
      const token = Cookies.get("accessToken")
      if (!token) {
        throw new Error("Authentication required")
      }

      const payload = {
        name: divisionName,
        ...(head && { head }),
      }

      await api.post("/division", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      })

      setToast({ message: "Division created successfully!", type: "success" })
      setDivisionName("")
      setHead("")
      setOpen(false)
      setTimeout(() => {
        onDivisionAdded()
      }, 3000)
    } catch (error) {
      console.error("Failed to create division:", error)
      setToast({ message: "Failed to create division. Please try again.", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 p-3 md:p-4 rounded-md shadow-md max-w-xs md:max-w-sm ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white text-sm md:text-base`}
        >
          {toast.message}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            className="flex rounded-md bg-[#003087] text-white h-12 w-full p-2 items-center justify-center cursor-pointer hover:bg-[#002f87a2]"
          >
            <div className="flex gap-1 items-center justify-center">
              <MdAddCircleOutline size={50} />
              <div className="text-sm sm:text-base">Add Division</div>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[95vw] max-w-[350px] sm:max-w-[400px] h-fit p-4 mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold mb-3">Add New Division</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-3 gap-3">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Division Name"
                className="flex w-full h-11 px-3 py-6 border-1 border-gray-300 rounded-[8px]"
                value={divisionName}
                onChange={(e) => setDivisionName(e.target.value)}
                required
              />
            </div>

            <Select value={head} onValueChange={setHead}>
              <SelectTrigger className="flex w-full h-11 px-3 py-6 border-1 border-gray-300 rounded-[8px]">
                <SelectValue placeholder="Select Division Head" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user._id} value={user._id}>
                    {user.personal_info?.first_name} {user.personal_info?.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex h-10 w-full sm:w-auto px-6 rounded-md items-center justify-center bg-[#34495E0D] cursor-pointer hover:bg-[#48637e0d] order-2 sm:order-1"
                aria-label="Cancel"
                disabled={loading}
              >
                <span className="text-sm sm:text-base">Cancel</span>
              </Button>

              <Button
                variant="outline"
                className="flex h-10 w-full sm:w-auto px-6 rounded-md items-center justify-center bg-[#003087] cursor-pointer hover:bg-[#002f87a2] order-1 sm:order-2"
                aria-label="Add Division"
                onClick={handleSubmit}
                disabled={loading}
              >
                <span className="text-[#F8F8F8] text-sm sm:text-base">{loading ? "Adding..." : "Add Division"}</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
