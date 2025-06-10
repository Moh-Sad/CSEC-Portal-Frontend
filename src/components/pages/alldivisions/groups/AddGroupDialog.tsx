"use client"
import { MdAddCircleOutline } from "react-icons/md"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import Cookies from "js-cookie"
import api from "@/lib/axios"
import { useSearchParams } from "next/navigation"

interface AddGroupDialogProps {
  onGroupAdded?: () => void
}

export function AddGroupDialog({ onGroupAdded }: AddGroupDialogProps) {
  const [open, setOpen] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [loading, setLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error">("success")
  const searchParams = useSearchParams()
  const divisionId = searchParams.get("divisionId")

  const handleSubmit = async () => {
    if (!groupName) {
      setToastMessage("Group name is required")
      setToastType("error")
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }

    try {
      setLoading(true)
      const token = Cookies.get("accessToken")
      if (!token) {
        throw new Error("Authentication required")
      }

      if (!divisionId) {
        throw new Error("Division ID is required")
      }

      await api.post(
        "/group",
        {
          name: groupName,
          division: divisionId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        },
      )

      setToastMessage("Group created successfully!")
      setToastType("success")
      setShowToast(true)
      setGroupName("")
      setOpen(false)
      setTimeout(() => onGroupAdded?.(), 3000)
    } catch (error) {
      console.error("Failed to create group:", error)
      setToastMessage("Failed to create group. Please try again.")
      setToastType("error")
      setShowToast(true)
    } finally {
      setLoading(false)
      setTimeout(() => setShowToast(false), 3000)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            className="flex rounded-md bg-[#003087] text-white h-10 sm:h-12 w-24 sm:w-32 items-center justify-center cursor-pointer hover:bg-[#002f87a2] text-xs sm:text-sm"
          >
            <div className="flex gap-1 items-center justify-center">
              <MdAddCircleOutline size={20} className="sm:hidden" />
              <MdAddCircleOutline size={50} className="hidden sm:block" />
              <div>Add Group</div>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[350px] max-w-[320px] h-fit p-3 sm:p-4 overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Add New Group</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-2 sm:space-y-3 gap-2 sm:gap-3">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Group Name"
                className="flex w-full h-10 sm:h-11 px-3 py-4 sm:py-6 border-1 border-gray-300 rounded-[8px] text-sm sm:text-base"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-center items-center gap-2 sm:gap-3">
              <div className="flex gap-2 sm:gap-3 items-center justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setOpen(false)}
                  className="flex h-9 sm:h-10 w-20 sm:w-35 rounded-md items-center justify-center bg-[#34495E0D] cursor-pointer hover:bg-[#48637e0d] text-xs sm:text-sm"
                  aria-label="Cancel"
                  disabled={loading}
                >
                  <h3 className="ml-1"> Cancel </h3>
                </Button>
              </div>

              <div className="flex gap-2 sm:gap-5 items-center justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="flex h-9 sm:h-10 w-24 sm:w-35 rounded-md items-center justify-center bg-[#003087] cursor-pointer hover:bg-[#002f87a2] text-xs sm:text-sm"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  <h3 className="text-[#F8F8F8] ml-1">{loading ? "Adding..." : "Add Group"}</h3>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showToast && (
        <div
          className={`fixed top-4 right-4 p-3 sm:p-4 rounded-md shadow-md z-50 max-w-[280px] sm:max-w-none text-sm sm:text-base ${
            toastType === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {toastMessage}
        </div>
      )}
    </>
  )
}
