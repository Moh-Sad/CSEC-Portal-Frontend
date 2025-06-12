"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Cookies from "js-cookie";

interface MemberData {
  _id: string;
  email: string;
  role: string;
  personal_info?: {
    instagram_handle?: string;
    linkedin_handle?: string;
    codeforce_handle?: string;
    leetcode_handle?: string;
    cv_link?: string;
    bio?: string;
    joining_date?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export function OptionalInformation() {
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
      <div className="flex flex-col md:flex-row md:gap-8" style={{ marginTop: "10px" }}>
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col gap-1 my-5">
            <span className="text-sm font-medium text-gray-500">
              LinkedIn Account
            </span>
            {member.personal_info?.linkedin_handle ? (
              <a
                href={member.personal_info.linkedin_handle}
                className="text-blue-600 hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                {member.personal_info.linkedin_handle}
              </a>
            ) : (
              <span className="text-gray-800 font-medium">N/A</span>
            )}
            <div className="w-full border-b border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-1" style={{ marginBottom: "20px" }}>
            <span className="text-sm font-medium text-gray-500">
              Codeforces Handle
            </span>
            {member.personal_info?.codeforce_handle ? (
              <a
                href={`https://codeforces.com/profile/${member.personal_info.codeforce_handle}`}
                className="text-blue-600 hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                {member.personal_info.codeforce_handle}
              </a>
            ) : (
              <span className="text-gray-800 font-medium">N/A</span>
            )}
            <div className="w-full border-b border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-1" style={{ marginBottom: "20px" }}>
            <span className="text-sm font-medium text-gray-500">
              Leetcode Handle
            </span>
            {member.personal_info?.leetcode_handle ? (
              <a
                href={`https://leetcode.com/${member.personal_info.leetcode_handle}`}
                className="text-blue-600 hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                {member.personal_info.leetcode_handle}
              </a>
            ) : (
              <span className="text-gray-800 font-medium">N/A</span>
            )}
            <div className="w-full border-b border-gray-300"></div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 min-w-0 md:min-w-[250px] flex flex-col gap-4 mt-4 md:mt-0">
          <div className="flex flex-col gap-1 my-5">
            <span className="text-sm font-medium text-gray-500">
              Instagram Handle
            </span>
            <span className="text-gray-800 font-medium">
              {member.personal_info?.instagram_handle || "N/A"}
            </span>
            <div className="w-full border-b border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-1" style={{ marginBottom: "20px" }}>
            <span className="text-sm font-medium text-gray-500">CV</span>
            {member.personal_info?.cv_link ? (
              <a
                href={member.personal_info.cv_link}
                className="text-blue-600 hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                View CV
              </a>
            ) : (
              <span className="text-gray-800 font-medium">N/A</span>
            )}
            <div className="w-full border-b border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-1" style={{ marginBottom: "20px" }}>
            <span className="text-sm font-medium text-gray-500">
              Joining Date
            </span>
            <span className="text-gray-800 font-medium">
              {member.personal_info?.joining_date
                ? new Date(
                    member.personal_info.joining_date
                  ).toLocaleDateString()
                : "N/A"}
            </span>
            <div className="w-full border-b border-gray-300"></div>
          </div>
        </div>
      </div>

      {/* Full width section for Short Bio */}
      <div className="mt-6">
        <div className="flex flex-col gap-1" style={{ marginBottom: "30px" }}>
          <span className="text-sm font-medium text-gray-500">Short Bio</span>
          <p className="text-gray-800 font-medium">
            {member.personal_info?.bio || "No bio available"}
          </p>
        </div>
      </div>
    </div>
  );
}
