"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { HeadsupDialog } from "./HeadsupDialog";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import Cookies from "js-cookie";

interface Member {
  _id: string;
  personal_info?: {
    first_name?: string;
    last_name?: string;
    profile_picture?: string;
  };
  email: string;
}

interface AttendanceTableProps {
  onAttendanceChange?: (id: string, status: "present" | "absent" | null) => void;
  pendingAttendance?: Record<string, "present" | "absent">;
}

export default function AttendanceTable({ 
  onAttendanceChange,
  pendingAttendance = {}
}: AttendanceTableProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");
  const sessionId = searchParams.get("sessionId");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = Cookies.get("accessToken");
        if (!token) {
          throw new Error("No authentication token found");
        }
        if (!groupId) {
          throw new Error("No group ID in URL");
        }

        const response = await api.get(`/group/group/${groupId}/members`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
          withCredentials: false,
        });

        setMembers(response.data);
      } catch (err) {
        console.error("Failed to fetch members:", err);
        setError(err instanceof Error ? err.message : "Failed to load members");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [groupId]);

  const handleAttendanceChange = (id: string, status: "present" | "absent") => {
    if (onAttendanceChange) {
      if (pendingAttendance[id] === status) {
        onAttendanceChange(id, null);
      } else {
        onAttendanceChange(id, status);
      }
    }
  };

  const getMemberDisplayInfo = (member: Member) => {
    const firstName = member.personal_info?.first_name || "";
    const lastName = member.personal_info?.last_name || "";
    const profilePicture = member.personal_info?.profile_picture;
    const fullName = `${firstName} ${lastName}`.trim() || member.email.split("@")[0];
    const initials = (firstName?.charAt(0) || "") + (lastName?.charAt(0) || "") || "?";

    return { fullName, profilePicture, initials };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40 sm:h-64">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-[#003087]"></div>
      </div>
    );
  }

  if (error) {
    return <div className="py-3 sm:py-4 text-center text-xs sm:text-sm text-red-500">{error}</div>;
  }

  if (members.length === 0) {
    return <div className="py-3 sm:py-4 text-center text-xs sm:text-sm">No members found in this group</div>;
  }

  return (
    <div className="divide-y">
      {members.map((member) => {
        const { fullName, profilePicture, initials } = getMemberDisplayInfo(member);

        return (
          <div key={member._id} className="grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-4 py-3 sm:py-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2 sm:gap-3 col-span-1 xs:col-span-1">
              <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                <AvatarImage
                  src={profilePicture || "/placeholder.svg"}
                  alt={fullName}
                />
                <AvatarFallback className="text-xs sm:text-sm">{initials}</AvatarFallback>
              </Avatar>
              <span className="truncate">{fullName}</span>
            </div>
            <div className="flex items-center justify-start xs:justify-end gap-2 sm:gap-4 col-span-1 xs:col-span-1">
              <button
                className={
                  pendingAttendance[member._id] === "present"
                    ? "bg-green-500 text-white px-2 sm:px-3 py-[1px] sm:py-[2px] rounded-2xl text-xs sm:text-sm"
                    : "border-1 border-gray-300 px-2 sm:px-3 py-[1px] sm:py-[2px] rounded-2xl text-xs sm:text-sm"
                }
                onClick={() => handleAttendanceChange(member._id, "present")}
              >
                Present
              </button>
              <button
                className={
                  pendingAttendance[member._id] === "absent"
                    ? "bg-red-500 text-white px-2 sm:px-3 py-[1px] sm:py-[2px] rounded-2xl text-xs sm:text-sm"
                    : "border-1 border-gray-300 px-2 sm:px-3 py-[1px] sm:py-[2px] rounded-2xl text-xs sm:text-sm"
                }
                onClick={() => handleAttendanceChange(member._id, "absent")}
              >
                Absent
              </button>
            </div>
            <div className="flex justify-start xs:justify-end pr-0 sm:pr-10 col-span-1 xs:col-span-1">
              <HeadsupDialog memberId={member._id} sessionId={sessionId || undefined} />
            </div>
          </div>
        );
      })}
    </div>
  );
}