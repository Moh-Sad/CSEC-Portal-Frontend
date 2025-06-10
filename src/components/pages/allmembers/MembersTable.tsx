"use client"

import type React from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Cookies from "js-cookie"
import { useState, useEffect } from "react"
import api from "@/lib/axios"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ApiMember {
  _id: string
  email: string
  role: string
  personal_info?: {
    first_name?: string
    last_name?: string
    profile_picture?: string
    university_id?: string
    graduation_year?: number
    resources?: any[]
  }
  createdAt: string
  updatedAt: string
}

interface Division {
  _id: string
  name: string
  members: {
    _id: string
    email: string
  }[]
  coordinators: any[]
  year_of_establishment: number
  createdAt: string
  updatedAt: string
  __v: number
}

interface MembersTableProps {
  apiMembers: ApiMember[]
  className?: string
  onDeleteSuccess?: () => void
  isLoading?: boolean
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
}

export function MembersTable({
  apiMembers,
  className,
  onDeleteSuccess,
  isLoading = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: MembersTableProps) {
  const router = useRouter()
  const currentUserRole = Cookies.get("role")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<ApiMember | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [divisions, setDivisions] = useState<Division[]>([])
  const [loadingDivisions, setLoadingDivisions] = useState(true)

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const token = Cookies.get("accessToken")
        if (!token) return

        const response = await api.get("/division", {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
          withCredentials: false,
        })

        if (response.data && Array.isArray(response.data.data)) {
          setDivisions(response.data.data)
        }
      } catch (error) {
        console.error("Failed to fetch divisions:", error)
      } finally {
        setLoadingDivisions(false)
      }
    }

    fetchDivisions()
  }, [])

  const getMemberDivision = (memberId: string) => {
    if (loadingDivisions) return "Loading..."

    const division = divisions.find((div) => div.members.some((m) => m._id === memberId))

    return division ? division.name : "No Division"
  }

  const getMemberDisplayData = (member: ApiMember) => {
    const name =
      member.personal_info?.first_name || member.personal_info?.last_name
        ? `${member.personal_info.first_name || ""} ${member.personal_info.last_name || ""}`.trim()
        : member.email.split("@")[0]

    const avatar = member.personal_info?.profile_picture
    const id = member.personal_info?.university_id || "N/A"

    let year = "N/A"
    if (member.personal_info?.graduation_year) {
      const currentYear = new Date().getFullYear()
      const diff = member.personal_info.graduation_year - currentYear
      if (diff === 0) year = "5th"
      else if (diff === 1) year = "4th"
      else if (diff === 2) year = "3rd"
      else if (diff === 3) year = "2nd"
      else if (diff === 4) year = "1st"
    }

    const lastUpdated = new Date(member.updatedAt)
    const currentDate = new Date()
    const monthsSinceUpdate =
      (currentDate.getFullYear() - lastUpdated.getFullYear()) * 12 + (currentDate.getMonth() - lastUpdated.getMonth())

    const status = monthsSinceUpdate < 6 ? "OnCampus" : "OffCampus"
    const attendance = monthsSinceUpdate < 3 ? "Active" : monthsSinceUpdate < 6 ? "Needs Attention" : "Inactive"

    return {
      id,
      name,
      avatar,
      email: member.email,
      role: member.role,
      year,
      status,
      attendance,
    }
  }

  const handleDeleteClick = (member: ApiMember, e: React.MouseEvent) => {
    e.stopPropagation()
    setMemberToDelete(member)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!memberToDelete) return

    setIsDeleting(true)
    try {
      const token = Cookies.get("accessToken")
      if (!token) throw new Error("Authentication required")

      await api.delete(`/user/${memberToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        withCredentials: false,
      })

      if (onDeleteSuccess) {
        onDeleteSuccess()
      }
    } catch (error) {
      console.error("Failed to delete member:", error)
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003087]"></div>
      </div>
    )
  }

  if (!apiMembers || apiMembers.length === 0) {
    return <div className="p-4 text-gray-500 text-center">No members found</div>
  }

  return (
    <>
      <div className={cn("rounded-lg border overflow-hidden", className)}>
        {/* Mobile Card View */}
        <div className="block sm:hidden">
          <div className="space-y-3 p-3">
            {apiMembers.map((member) => {
              const displayData = getMemberDisplayData(member)
              return (
                <div
                  key={member._id}
                  className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => router.push(`/dashboard/allmembers/profile?id=${member._id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={displayData.avatar || "/placeholder.svg"} alt={displayData.name} />
                        <AvatarFallback>{getInitials(displayData.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{displayData.name}</div>
                        <div className="text-xs text-gray-500">ID: {displayData.id}</div>
                      </div>
                    </div>
                    {currentUserRole === "president" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-transparent group"
                        onClick={(e) => handleDeleteClick(member, e)}
                      >
                        <Trash2 className="h-4 w-4 group-hover:text-red-500" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Division:</span>
                      <Badge variant="outline" className="ml-1 text-xs">
                        {getMemberDivision(member._id)}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-500">Year:</span>
                      <span className="ml-1">{displayData.year}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Attendance:</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "ml-1 text-xs",
                          displayData.attendance === "Active" ? "text-green-500 bg-green-50" : "",
                          displayData.attendance === "Inactive" ? "text-red-500 bg-red-50" : "",
                          displayData.attendance === "Needs Attention" ? "text-amber-500 bg-amber-50" : "",
                        )}
                      >
                        {displayData.attendance}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <Badge
                        variant={displayData.status === "OnCampus" ? "outline" : "secondary"}
                        className={cn(
                          "ml-1 text-xs",
                          displayData.status === "OnCampus" ? "text-green-500 bg-green-50" : "",
                          displayData.status === "OffCampus" ? "text-red-500 bg-red-50" : "",
                        )}
                      >
                        {displayData.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-500 min-w-[200px]">Member Name</TableHead>
                <TableHead className="text-gray-500 min-w-[100px]">Member ID</TableHead>
                <TableHead className="text-gray-500 min-w-[120px]">Division</TableHead>
                <TableHead className="text-gray-500 min-w-[120px]">Attendance</TableHead>
                <TableHead className="text-gray-500 min-w-[80px]">Year</TableHead>
                <TableHead className="text-gray-500 min-w-[100px]">Status</TableHead>
                {currentUserRole === "president" && (
                  <TableHead className="text-gray-500 text-center min-w-[80px]">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiMembers.map((member) => {
                const displayData = getMemberDisplayData(member)
                return (
                  <TableRow
                    key={member._id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => router.push(`/dashboard/allmembers/profile?id=${member._id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3 p-1">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src={displayData.avatar || "/placeholder.svg"} alt={displayData.name} />
                          <AvatarFallback>{getInitials(displayData.name)}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium truncate">{displayData.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="truncate">{displayData.id}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize text-xs">
                        {getMemberDivision(member._id)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          displayData.attendance === "Active" ? "text-green-500 bg-green-50" : "",
                          displayData.attendance === "Inactive" ? "text-red-500 bg-red-50" : "",
                          displayData.attendance === "Needs Attention" ? "text-amber-500 bg-amber-50" : "",
                        )}
                      >
                        {displayData.attendance}
                      </Badge>
                    </TableCell>
                    <TableCell>{displayData.year}</TableCell>
                    <TableCell>
                      <Badge
                        variant={displayData.status === "OnCampus" ? "outline" : "secondary"}
                        className={cn(
                          "text-xs",
                          displayData.status === "OnCampus" ? "text-green-500 bg-green-50" : "",
                          displayData.status === "OffCampus" ? "text-red-500 bg-red-50" : "",
                        )}
                      >
                        {displayData.status}
                      </Badge>
                    </TableCell>

                    {currentUserRole === "president" && (
                      <TableCell>
                        <div className="flex justify-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-transparent group"
                            onClick={(e) => handleDeleteClick(member, e)}
                          >
                            <Trash2 className="h-4 w-4 group-hover:text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
          <Button
            variant="outline"
            disabled={currentPage === 1 || isLoading}
            onClick={() => onPageChange && onPageChange(currentPage - 1)}
            className="w-full sm:w-auto"
          >
            Previous
          </Button>

          <span className="text-sm text-gray-600 order-first sm:order-none">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={currentPage === totalPages || isLoading}
            onClick={() => onPageChange && onPageChange(currentPage + 1)}
            className="w-full sm:w-auto"
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              {memberToDelete?.personal_info?.first_name
                ? `${memberToDelete.personal_info.first_name} ${memberToDelete.personal_info.last_name || ""}`
                : memberToDelete?.email}
              ?
              <br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
              className="rounded-[10px] p-2 w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="rounded-[10px] p-2 w-full sm:w-auto"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase()
    .substring(0, 2)
}
