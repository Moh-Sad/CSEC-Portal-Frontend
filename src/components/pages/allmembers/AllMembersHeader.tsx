"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Cookies from "js-cookie";

interface MemberData {
  _id: string;
  email: string;
  role: string;
  personal_info?: {
    first_name?: string;
    last_name?: string;
    profile_picture?: string;
    university_id?: string;
    graduation_year?: number;
    phone_number?: string;
    specialization?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export function ProfileHeader() {
  const [member, setMember] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastSeen, setLastSeen] = useState<string>("");

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const token = Cookies.get('accessToken');
        if (!token) return;

        const urlParams = new URLSearchParams(window.location.search);
        const memberId = urlParams.get('id');
        
        if (!memberId) return;

        const response = await api.get(`/user/${memberId}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          },
          withCredentials: false
        });

        if (response.data?.user) {
          setMember(response.data.user);
        }

        const lastSeenResponse = await api.get(`/user/${memberId}/last-seen`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          },
          withCredentials: false
        });

        if (lastSeenResponse.data?.lastSeen) {
          const now = new Date();
          const lastSeenDate = new Date(lastSeenResponse.data.lastSeen);
          const diffInSeconds = Math.floor((now.getTime() - lastSeenDate.getTime()) / 1000);
          
          if (diffInSeconds < 120) {
            setLastSeen("online");
          } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            setLastSeen(`${minutes}min ago`);
          } else if (now.toDateString() === lastSeenDate.toDateString()) {
            setLastSeen(`at ${lastSeenDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`);
          } else {
            setLastSeen(lastSeenDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch member data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-54">Loading...</div>;
  }

  if (!member) {
    return <div className="flex justify-center items-center h-54">Member not found</div>;
  }

  const fullName = member.personal_info?.first_name || member.personal_info?.last_name
    ? `${member.personal_info.first_name || ""} ${member.personal_info.last_name || ""}`.trim()
    : member.email.split("@")[0];

  const getInitials = () => {
    const firstName = member.personal_info?.first_name || '';
    const lastName = member.personal_info?.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getBackgroundStyle = () => {
    if (member.personal_info?.profile_picture) {
      return {
        backgroundImage: `url('${member.personal_info.profile_picture}')`
      };
    } else {
      return {
        backgroundColor: '#001C5D',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '48px',
        fontWeight: 'bold'
      };
    }
  };

  return (
    <div className="flex relative h-54 rounded-[8px] w-auto mr-5">
      <div
        className="h-52 bg-[#001C5DCC] rounded-[8px] relative w-full"
        style={{ padding: "12px" }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center blur-lg opacity-50" 
          style={getBackgroundStyle()}
        >
          {!member.personal_info?.profile_picture && (
            <span>{getInitials()}</span>
          )}
        </div>
        <div className="relative left-25 z-10 h-full w-full">
          <div className="absolute bottom-7 left-13 transform translate-y-1/2 flex items-end gap-6">
            <div className="flex items-center justify-center h-33 w-33 rounded-full bg-gray-200">
              {member.personal_info?.profile_picture ? (
                <Image
                  src={member.personal_info.profile_picture}
                  alt={fullName}
                  width={92}
                  height={92}
                  className="flex items-center justify-center h-33 w-33 rounded-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full rounded-full text-2xl font-bold">
                  {getInitials()}
                </div>
              )}
            </div>
            <div className="flex gap-20 text-white" style={{ marginBottom: "30px" }}>
              <div>
                <h2 className="font-semibold text-3xl">{fullName}</h2>
                <p className="text-[20px] opacity-90 capitalize">{member.personal_info?.specialization}</p>
              </div>
              {lastSeen === "online" ? (
                <p className="flex items-end text-lg text-green-400 font-medium">online</p>
              ) : (
                <p className="flex items-end text-lg opacity-90">last seen {lastSeen || "long time ago"}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}