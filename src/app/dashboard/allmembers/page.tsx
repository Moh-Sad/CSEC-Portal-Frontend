"use client"

import { useState, useEffect, useMemo } from "react"
import Cookies from "js-cookie"
import { MembersTable } from "@/components/pages/allmembers/MembersTable"
import { TableFilter } from "@/components/common/TableFilter"
import { TablePagination } from "@/components/common/TablePagination"
import api from "@/lib/axios"
import { Button } from "@/components/ui/button"

interface FilterOptions {
  divisions: string[]
  years: string[]
  statuses: string[]
}

export default function MembersPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [canAddMembers, setCanAddMembers] = useState(false)
  const [allMembers, setAllMembers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalItems, setTotalItems] = useState(0)
  const [refreshKey, setRefreshKey] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterOptions>({
    divisions: [],
    years: [],
    statuses: [],
  })
  const [divisions, setDivisions] = useState<{ name: string }[]>([])
  const itemsPerPage = 8

  useEffect(() => {
    const role = Cookies.get("role")
    setCanAddMembers(!!role && role !== "member")
    fetchAllMembers()
    fetchDivisions()
  }, [refreshKey])

  const fetchAllMembers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const token = Cookies.get("accessToken")
      if (!token) {
        setError("Please login again to view members")
        setIsLoading(false)
        return
      }

      const countResponse = await api.get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        withCredentials: false,
      })

      const totalCount = countResponse.data?.total || 0
      setTotalItems(totalCount)

      if (totalCount === 0) {
        setAllMembers([])
        setIsLoading(false)
        return
      }

      const totalPages = Math.ceil(totalCount / 10)
      const requests = []

      for (let page = 1; page <= totalPages; page++) {
        requests.push(
          api.get(`/user?page=${page}&limit=10`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
            withCredentials: false,
          }),
        )
      }

      const responses = await Promise.all(requests)
      const allMembersData = responses.flatMap((response) =>
        Array.isArray(response.data?.data) ? response.data.data : [],
      )

      setAllMembers(allMembersData)
    } catch (error: any) {
      setError(error.message || "Failed to fetch members")
    } finally {
      setIsLoading(false)
    }
  }

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
    }
  }

  const getMemberDisplayName = (member: any) => {
    return member.personal_info?.first_name || member.personal_info?.last_name
      ? `${member.personal_info.first_name || ""} ${member.personal_info.last_name || ""}`.trim()
      : member.email.split("@")[0]
  }

  const getMemberYear = (member: any) => {
    if (!member.personal_info?.graduation_year) return "N/A"
    const currentYear = new Date().getFullYear()
    const diff = member.personal_info.graduation_year - currentYear
    if (diff === 0) return "5th"
    if (diff === 1) return "4th"
    if (diff === 2) return "3rd"
    if (diff === 3) return "2nd"
    if (diff === 4) return "1st"
    return "N/A"
  }

  const getMemberAttendance = (member: any) => {
    const lastUpdated = new Date(member.updatedAt)
    const currentDate = new Date()
    const monthsSinceUpdate =
      (currentDate.getFullYear() - lastUpdated.getFullYear()) * 12 + (currentDate.getMonth() - lastUpdated.getMonth())

    return monthsSinceUpdate < 3 ? "Active" : monthsSinceUpdate < 6 ? "Needs Attention" : "Inactive"
  }

  const getMemberDivision = (member: any, allDivisions: any[]) => {
    if (!allDivisions || !Array.isArray(allDivisions)) return "No Division"

    const division = allDivisions.find((div) => {
      if (!div.members || !Array.isArray(div.members)) return false
      return div.members.some((m: any) => m._id === member._id)
    })

    return division ? division.name : "No Division"
  }

  const filteredMembers = useMemo(() => {
    let result = [...allMembers]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((member) => {
        const displayName = getMemberDisplayName(member).toLowerCase()
        return displayName.includes(query)
      })
    }

    // Apply other filters
    if (filters.divisions.length > 0 || filters.years.length > 0 || filters.statuses.length > 0) {
      result = result.filter((member) => {
        const memberDivision = getMemberDivision(member, divisions)
        const memberYear = getMemberYear(member)
        const memberAttendance = getMemberAttendance(member)

        const divisionMatch = filters.divisions.length === 0 || filters.divisions.includes(memberDivision)

        const yearMatch = filters.years.length === 0 || filters.years.includes(memberYear)

        const statusMatch = filters.statuses.length === 0 || filters.statuses.includes(memberAttendance)

        return divisionMatch && yearMatch && statusMatch
      })
    }

    return result
  }, [allMembers, searchQuery, filters, divisions])

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredMembers.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredMembers, currentPage, itemsPerPage])

  const handleRetry = () => {
    setError(null)
    fetchAllMembers()
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleMemberAdded = () => {
    setRefreshKey((prev) => prev + 1)
    setCurrentPage(1)
  }

  const handleDeleteSuccess = () => {
    setRefreshKey((prev) => prev + 1)
    if (paginatedMembers.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleFilter = (newFilters: FilterOptions) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[75vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003087]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[100vh] gap-4 px-4">
        <div className="text-red-500 text-center max-w-md text-sm sm:text-base">{error}</div>
        <Button onClick={handleRetry} className="bg-[#003087] hover:bg-[#002f87a2] text-white rounded-[10px] p-2">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-fit w-aufto max-w-full mx-auto px-2 sm:px-4 lg:px-5 my-2 gap-4 rounded-[8px] border border-gray-300 mr-3">
      <div className="flex-1 gap-3 flex flex-col p-2 sm:p-4 mt-2">
        <main className="flex-1 flex flex-col gap-4 sm:gap-6">
          <TableFilter
            onSearch={handleSearch}
            onFilter={handleFilter}
            placeholder="Search members..."
            addMembersButton={canAddMembers}
            onMemberAdded={handleMemberAdded}
            divisions={divisions.map((div) => div.name)}
          />
          <div className="overflow-hidden">
            <MembersTable apiMembers={paginatedMembers} onDeleteSuccess={handleDeleteSuccess} isLoading={isLoading} />
            {filteredMembers.length > 0 && (
              <TablePagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredMembers.length / itemsPerPage)}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
