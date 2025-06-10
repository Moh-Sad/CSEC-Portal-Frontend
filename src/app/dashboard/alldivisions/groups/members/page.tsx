"use client"

import { useState, useEffect } from "react"
import { TableFilter } from "@/components/common/TableFilter"
import { TablePagination } from "@/components/common/TablePagination"
import { MembersTable } from "@/components/pages/alldivisions/groups/members/GroupMembersTable"
import api from "@/lib/axios"
import Cookies from "js-cookie"
import { useSearchParams } from "next/navigation"

export default function TableUsage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [canAddMembers, setCanAddMembers] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [divisionName, setDivisionName] = useState("")
  const [groupName, setGroupName] = useState("")
  const searchParams = useSearchParams()
  const groupId = searchParams.get("groupId")
  const divisionId = searchParams.get("divisionId")

  useEffect(() => {
    const checkUserPermissions = async () => {
      try {
        const role = Cookies.get("role")
        if (!role || role === "member") {
          setCanAddMembers(false)
          return
        }

        const userString = localStorage.getItem("user")
        if (!userString) {
          setCanAddMembers(false)
          return
        }

        const user = JSON.parse(userString)
        const userId = user._id

        if (!divisionId) {
          setCanAddMembers(false)
          return
        }

        const token = Cookies.get("accessToken")
        if (!token) {
          setCanAddMembers(false)
          return
        }

        const response = await api.get(`/group/${divisionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        })

        const groups = response.data
        const isMember = groups.some((group: any) => group.members.includes(userId))

        setCanAddMembers(isMember)
      } catch (err) {
        console.error("Error checking user permissions:", err)
        setCanAddMembers(false)
      }
    }

    checkUserPermissions()
  }, [divisionId])

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true)
      setError(null)

      try {
        const token = Cookies.get("accessToken")
        if (!token) {
          throw new Error("Authentication required")
        }

        if (groupId) {
          // Fetch group-specific members
          const groupResponse = await api.get(`/group/${divisionId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          })

          const groupData = groupResponse.data.find((g: any) => g._id === groupId)
          if (!groupData) throw new Error("Group not found")

          setGroupName(groupData.name)

          // Get division details to get division name and all members
          const divisionResponse = await api.get(`/division/${groupData.division}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          })

          setDivisionName(divisionResponse.data.name)

          // Filter division members to only those in this group
          const divisionMembers = divisionResponse.data.members || []
          const groupMembers = divisionMembers.filter((member: any) => groupData.members.includes(member._id))

          setMembers(groupMembers)
        } else if (divisionId) {
          // Fetch all division members
          const divisionResponse = await api.get(`/division/${divisionId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          })

          const divisionData = divisionResponse.data
          setDivisionName(divisionData.name)
          setMembers(divisionData.members || [])
        } else {
          throw new Error("No group or division ID provided")
        }
      } catch (err) {
        setError("Failed to load members. Some information may be incomplete.")
        console.error("Fetch error:", err)

        if (
          err instanceof Error &&
          (err.message === "Authentication required" || (err as any).response?.status === 401)
        ) {
          window.location.href = "/login"
        }
      } finally {
        setLoading(false)
      }
    }

    if (groupId || divisionId) {
      fetchMembers()
    }
  }, [groupId, divisionId, refreshKey])

  const handleSearch = (value: string) => {
    console.log("Searching for:", value)
  }

  const handleFilter = () => {
    console.log("Filter button clicked")
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    console.log("Page changed to:", page)
  }

  const handleMemberAdded = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const handleDeleteSuccess = () => {
    setRefreshKey((prev) => prev + 1)
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003087]"></div>
      </div>
    )
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  return (
    <div className="flex flex-col h-fit min-w-0 max-w-full p-3 mr-0 sm:mr-5 my-3 gap-4 rounded-[8px] border-1 border-gray-300">
      <main className="flex-1 flex flex-col gap-6">
        <TableFilter
          onSearch={handleSearch}
          onFilter={handleFilter}
          placeholder="Search members..."
          addMembersButton={canAddMembers}
          onMemberAdded={handleMemberAdded}
        />
        <div className="min-h-98 overflow-hidden">
          <MembersTable
            apiMembers={members}
            divisionName={divisionName}
            groupName={groupName}
            onDeleteSuccess={handleDeleteSuccess}
          />
        </div>
        <TablePagination
          currentPage={currentPage}
          totalPages={5}
          totalItems={42}
          itemsPerPage={10}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  )
}
