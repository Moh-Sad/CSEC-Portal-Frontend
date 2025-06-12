"use client";

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
    gender?: string;
    birth_date?: string;
    phone_number?: string;
    telegram_handle?: string;
    github_handle?: string;
    department?: string;
    specialization?: string;
    mentor?: string;
    university_id?: string;
    graduation_year?: number;
  };
  displayPhoneNumber?: boolean;
  createdAt: string;
  updatedAt: string;
}

export function RequiredInformation() {
  const [member, setMember] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const token = Cookies.get("accessToken");
        if (!token) return;

        const urlParams = new URLSearchParams(window.location.search);
        const memberId = urlParams.get("id");

        if (!memberId) return;

        const response = await api.get(`/user/${memberId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
          withCredentials: false,
        });

        if (response.data?.user) {
          setMember(response.data.user);
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
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003087]"></div>
      </div>
    );
  }

  if (!member) {
    return <div className="p-4">Member not found</div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row md:gap-8" style={{ marginTop: "10px" }}>
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col gap-1 my-3 md:my-5">
            <span className="text-sm font-medium text-gray-500">
              First Name
            </span>
            <span className="text-gray-800 font-medium">
              {member.personal_info?.first_name || "N/A"}
            </span>
            <div className="w-full border-b border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-1" style={{ marginBottom: "15px" }}>
            <span className="text-sm font-medium text-gray-500">
              Mobile Number
            </span>
            <span className="text-gray-800 font-medium">
              {member.displayPhoneNumber ? member.personal_info?.phone_number || "N/A" : "Hidden"}
            </span>
            <div className="w-full border-b border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-1" style={{ marginBottom: "15px" }}>
            <span className="text-sm font-medium text-gray-500">
              Date of Birth
            </span>
            <span className="text-gray-800 font-medium">
              {member.personal_info?.birth_date
                ? new Date(member.personal_info.birth_date).toLocaleDateString()
                : "N/A"}
            </span>
            <div className="w-full border-b border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-1" style={{ marginBottom: "15px" }}>
            <span className="text-sm font-medium text-gray-500">Gender</span>
            <span className="text-gray-800 font-medium">
              {member.personal_info?.gender
                ? member.personal_info.gender.charAt(0).toUpperCase() +
                  member.personal_info.gender.slice(1)
                : "N/A"}
            </span>
            <div className="w-full border-b border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-1" style={{ marginBottom: "15px" }}>
            <span className="text-sm font-medium text-gray-500">
              Expected Graduation Year
            </span>
            <span className="text-gray-800 font-medium">
              {member.personal_info?.graduation_year || "N/A"}
            </span>
            <div className="w-full border-b border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-1 pb-3 md:pb-5">
            <span className="text-sm font-medium text-gray-500">
              Department
            </span>
            <span className="text-gray-800 font-medium">
              {member.personal_info?.department || "N/A"}
            </span>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 flex flex-col gap-4 mt-4 md:mt-0">
          <div className="flex flex-col gap-1 my-3 md:my-5">
            <span className="text-sm font-medium text-gray-500">Last Name</span>
            <span className="text-gray-800 font-medium">
              {member.personal_info?.last_name || "N/A"}
            </span>
            <div className="w-full border-b border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-1" style={{ marginBottom: "15px" }}>
            <span className="text-sm font-medium text-gray-500">
              Email Address
            </span>
            <span className="text-gray-800 font-medium">{member.email}</span>
            <div className="w-full border-b border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-1" style={{ marginBottom: "15px" }}>
            <span className="text-sm font-medium text-gray-500">Github</span>
            {member.personal_info?.github_handle ? (
              <a
                href={`https://github.com/${member.personal_info.github_handle}`}
                className="text-blue-600 hover:underline font-medium break-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/{member.personal_info.github_handle}
              </a>
            ) : (
              <span className="text-gray-800 font-medium">N/A</span>
            )}
            <div className="w-full border-b border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-1" style={{ marginBottom: "15px" }}>
            <span className="text-sm font-medium text-gray-500">
              Telegram Handle
            </span>
            <span className="text-gray-800 font-medium">
              {member.personal_info?.telegram_handle || "N/A"}
            </span>
            <div className="w-full border-b border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-1" style={{ marginBottom: "15px" }}>
            <span className="text-sm font-medium text-gray-500">
              Specialization
            </span>
            <span className="text-gray-800 font-medium">
              {member.personal_info?.specialization || "N/A"}
            </span>
            <div className="w-full border-b border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-1 pb-3 md:pb-5">
            <span className="text-sm font-medium text-gray-500">
              University ID
            </span>
            <span className="text-gray-800 font-medium">
              {member.personal_info?.university_id || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}