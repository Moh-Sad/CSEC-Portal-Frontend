"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import GroupCardComponents from "@/components/pages/attendance/groups/GroupCard";
import api from "@/lib/axios";
import Cookies from "js-cookie";

interface Member {
  id: string;
  name: string;
  speciality: string;
  imgUrl?: string;
}

interface Group {
  id: string;
  name: string;
  totalMembers: number;
  members: Member[];
}

export default function GroupOverview({ linkText = "View All" }: { linkText?: string }) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = Cookies.get("accessToken");
        if (!token) {
          throw new Error("No authentication token found");
        }
        if (!sessionId) {
          throw new Error("No session ID in URL");
        }

        // 1. Fetch the session details
        const sessionResponse = await api.get(`/session/${sessionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          },
          withCredentials: false
        });

        const groupIds = sessionResponse.data.groups;
        if (!groupIds || groupIds.length === 0) {
          throw new Error("No groups found in this session");
        }

        // 2. Fetch all groups
        const groupsResponse = await api.get("/group/all", {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          },
          withCredentials: false
        });

        // 3. Filter groups that belong to this session
        const sessionGroups = groupsResponse.data.filter((group: any) => 
          groupIds.includes(group._id)
        );

        // 4. Transform groups to match the expected format
        const transformedGroups = await Promise.all(
          sessionGroups.map(async (group: any) => {
            const memberDetails = await Promise.all(
              group.members.map(async (memberId: string) => {
                try {
                  const memberResponse = await api.get(`/user/${memberId}`, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      'ngrok-skip-browser-warning': 'true'
                    },
                    withCredentials: false
                  });
                  
                  const member = memberResponse.data.user;
                  return {
                    id: member._id,
                    name: `${member.personal_info?.first_name || 'Unknown'} ${member.personal_info?.last_name || 'User'}`,
                    speciality: member.personal_info?.specialization || 'Not specified',
                    imgUrl: member.personal_info?.profile_picture
                  };
                } catch (error) {
                  console.error(`Failed to fetch member ${memberId}:`, error);
                  return {
                    id: memberId,
                    name: "Unknown Member",
                    speciality: "Unknown",
                    imgUrl: undefined
                  };
                }
              })
            );

            return {
              id: group._id,
              name: group.name,
              totalMembers: group.members.length,
              members: memberDetails
            };
          })
        );

        setGroups(transformedGroups);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError(error instanceof Error ? error.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40 sm:h-64">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-[#003087]"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-2 sm:p-4 text-center text-xs sm:text-sm text-red-500">{error}</div>;
  }

  if (groups.length === 0) {
    return <div className="p-2 sm:p-4 text-center text-xs sm:text-sm">No groups found for this session</div>;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 sm:gap-4 w-full">
        {groups.map((group) => (
          <GroupCardComponents
            key={group.id}
            division={group}
            className="flex-1 min-w-full sm:min-w-[calc(50%-1.5rem)]"
            linkText={linkText}
          />
        ))}
      </div>
    </div>
  );
}