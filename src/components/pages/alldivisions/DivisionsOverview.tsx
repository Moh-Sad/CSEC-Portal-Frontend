"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import DivisionCardComponent from "@/components/pages/alldivisions/DivisionCard"

interface Member {
  _id: string
  name?: string
  email?: string
}

interface Group {
  _id: string
  name: string
  division: string
  members: string[]
  createdAt: string
  updatedAt: string
  __v: number
}

interface Division {
  _id: string
  name: string
  members: any[]
  year_of_establishment: number
  createdAt: string
  updatedAt: string
  __v: number
}

interface FrontendDivision {
  id: string
  name: string
  totalMembers: number
  groups: {
    id: string
    name: string
    members: number
    memberDetails?: Member[]
  }[]
}

interface DivisionsOverviewProps {
  searchQuery?: string
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
  withCredentials: true,
})

export default function DivisionsOverview({ searchQuery = "" }: DivisionsOverviewProps) {
  const [divisions, setDivisions] = useState<FrontendDivision[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDivisionsAndGroups = async () => {
    setLoading(true)
    setError(null)

    try {
      const token = Cookies.get("accessToken")
      if (!token) {
        throw new Error("Authentication required")
      }

      const divisionsResponse = await api.get("/division", {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      })

      const allDivisions: Division[] = divisionsResponse.data.data

      const results = await Promise.all(
        allDivisions.map(async (division) => {
          try {
            const response = await api.get(`/group/${division._id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "ngrok-skip-browser-warning": "true",
              },
            })

            const groups: Group[] = response.data

            const groupsWithMembers = await Promise.all(
              groups.map(async (group) => {
                try {
                  if (group.members.length === 0) {
                    return {
                      id: group._id,
                      name: group.name,
                      members: 0,
                      memberDetails: [],
                    }
                  }

                  const memberDetails = await Promise.all(
                    group.members.map((memberId) =>
                      api
                        .get(`/user/${memberId}`, {
                          headers: {
                            Authorization: `Bearer ${token}`,
                            "ngrok-skip-browser-warning": "true",
                          },
                        })
                        .then((res) => res.data),
                    ),
                  )

                  return {
                    id: group._id,
                    name: group.name,
                    members: group.members.length,
                    memberDetails,
                  }
                } catch (err) {
                  console.error(`Error fetching members for group ${group._id}`)
                  return {
                    id: group._id,
                    name: group.name,
                    members: group.members.length,
                    memberDetails: [],
                  }
                }
              }),
            )

            return {
              id: division._id,
              name: division.name,
              totalMembers: groupsWithMembers.reduce((sum, group) => sum + group.members, 0),
              groups: groupsWithMembers,
            }
          } catch (err) {
            console.error(`Error processing ${division.name}`)
            return {
              id: division._id,
              name: division.name,
              totalMembers: 0,
              groups: [],
            }
          }
        }),
      )

      setDivisions(results)
    } catch (err) {
      setError("Failed to load division data. Some information may be incomplete.")
      console.error("Overall fetch error:", err)

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

  useEffect(() => {
    fetchDivisionsAndGroups()
  }, [])

  const filteredDivisions = divisions.filter((division) =>
    division.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[75vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003087]"></div>
      </div>
    )
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>
  }

  return (
    <div className="space-y-4 md:space-y-6 p-1 md:p-3 w-full">
      {/* Mobile: Single column, Desktop: Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-4">
        {filteredDivisions.map((division) => (
          <div key={division.id} className="w-full">
            <DivisionCardComponent division={division} />
          </div>
        ))}
      </div>
    </div>
  )
}
