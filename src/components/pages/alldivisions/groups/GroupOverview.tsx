"use client"
import { useState, useEffect } from "react"
import GroupCardComponents from "@/components/pages/alldivisions/groups/GroupCard"
import api from "@/lib/axios"
import Cookies from "js-cookie"
import { useSearchParams } from "next/navigation"

interface Member {
  _id: string
  personal_info: {
    first_name: string
    last_name: string
    specialization: string
    profile_picture?: string
  }
}

interface Group {
  _id: string
  name: string
  division: string
  members: string[]
}

interface GroupWithMembers extends Group {
  memberDetails: Member[]
}

export default function GroupOverview({ linkText = "View All" }: { linkText?: string }) {
  const [searchQuery] = useState("")
  const [groups, setGroups] = useState<GroupWithMembers[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const divisionId = searchParams.get("divisionId")
  const groupId = searchParams.get("groupId")

  useEffect(() => {
    const fetchGroupsAndMembers = async () => {
      setLoading(true)
      setError(null)

      try {
        const token = Cookies.get("accessToken")
        if (!token) {
          throw new Error("Authentication required")
        }

        let groupsResponse
        if (divisionId) {
          const response = await api.get(`/group/${divisionId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          })
          groupsResponse = response.data
        } else {
          throw new Error("No division or group ID provided")
        }

        const groupsWithMembers = await Promise.all(
          groupsResponse.map(async (group: Group) => {
            const memberDetails = await Promise.all(
              group.members.map((memberId) =>
                api
                  .get(`/user/${memberId}`, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "ngrok-skip-browser-warning": "true",
                    },
                  })
                  .then((res) => res.data.user),
              ),
            )

            return {
              ...group,
              memberDetails,
            }
          }),
        )

        setGroups(groupsWithMembers)
      } catch (err) {
        setError("Failed to load group data. Some information may be incomplete.")
        console.error("Fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchGroupsAndMembers()
  }, [divisionId, groupId])

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003087]"></div>
      </div>
    )
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  const filteredGroups = groups.filter((group) => group.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 w-full">
        {filteredGroups.map((group) => (
          <GroupCardComponents
            key={group._id}
            group={{
              id: group._id,
              divisionId: divisionId || "unknown-division",
              name: group.name,
              totalMembers: group.members.length,
              members: group.memberDetails.map((member) => ({
                id: member._id,
                name: `${member.personal_info.first_name} ${member.personal_info.last_name}`,
                speciality: member.personal_info.specialization,
                imgUrl: member.personal_info.profile_picture,
              })),
            }}
            className="w-full sm:flex-1 sm:min-w-[calc(50%-1rem)]"
            linkText={linkText}
          />
        ))}
      </div>
    </div>
  )
}
