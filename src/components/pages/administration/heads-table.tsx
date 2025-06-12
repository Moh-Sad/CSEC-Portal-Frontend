"use client";

import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface UserDetails {
  _id: string;
  email: string;
  personal_info?: {
    first_name?: string;
    last_name?: string;
    profile_picture?: string;
  };
}

interface Member {
  _id: string;
  user: {
    _id: string;
  };
  division: {
    _id: string;
    name: string;
  };
  role: string;
  userDetails?: UserDetails;
}

export default function HeadsTable() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      const match = document.cookie.match(/accessToken=([^;]+)/);
      return match?.[1] || null;
    }
    return null;
  };

  const fetchUserDetails = async (userId: string) => {
    const token = getAuthToken();
    if (!token) return null;

    try {
      const response = await api.get(`/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });
      return response.data?.user || null;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };

  const fetchHeads = async () => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.get("/head", {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });

      if (response.data?.data) {
        const validMembers = response.data.data.filter(
          (member: Member) => member
        );

        const membersWithDetails = await Promise.all(
          validMembers.map(async (member: Member) => {
            const userDetails = await fetchUserDetails(member.user._id);
            return { ...member, userDetails };
          })
        );

        setMembers(membersWithDetails);
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error: any) {
      console.error("API Error:", error);
      if (error.response?.status === 403) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to view this resource",
          variant: "destructive",
          id: "",
        });
        router.push("/dashboard");
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to fetch data",
          variant: "destructive",
          id: "",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHeads();
  }, []);

  const getAvatarFallback = (userDetails?: UserDetails) => {
    if (!userDetails) {
      return (
        <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white font-medium">
          ?
        </div>
      );
    }

    if (userDetails.personal_info?.profile_picture) return null;

    const letter = userDetails.personal_info?.first_name
      ? userDetails.personal_info.first_name.charAt(0).toUpperCase()
      : userDetails.email
      ? userDetails.email.charAt(0).toUpperCase()
      : "?";

    return (
      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
        {letter}
      </div>
    );
  };

  const getUserDisplayName = (userDetails?: UserDetails) => {
    if (!userDetails) return "Unknown User";
    
    if (userDetails.personal_info?.first_name || userDetails.personal_info?.last_name) {
      return `${userDetails.personal_info.first_name || ''} ${userDetails.personal_info.last_name || ''}`.trim();
    }
    
    return userDetails.email || "Unknown User";
  };

  const handleDeleteClick = (member: Member) => {
    setMemberToDelete(member);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!memberToDelete) return;

    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await api.delete(
        `/head/${memberToDelete.user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );

      setMembers(members.filter((m) => m._id !== memberToDelete._id));

      toast({
        title: "Success",
        description: response.data?.message || "Head removed successfully",
        id: "",
      });
    } catch (error: any) {
      console.error("Error removing head:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to remove head",
        variant: "destructive",
        id: "",
      });
    } finally {
      setShowDeleteConfirm(false);
      setMemberToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto min-w-120">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 text-sm">
              <th className="pb-2 font-normal w-auto md:w-120 overflow-x-hidden">Member Name</th>
              <th className="pb-2 font-normal w-auto md:w-120 overflow-x-hidden">Division</th>
              <th className="pb-2 font-normal w-auto md:w-120 overflow-x-hidden">Role</th>
              <th className="pb-2 font-normal">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm md:text-lg">
            {members.length > 0 ? (
              members.map((member) => (
                <tr key={member._id} className="border-t border-gray-100">
                  <td className="py-3">
                    <div className="flex items-center gap-3 w-auto">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        {member.userDetails?.personal_info?.profile_picture ? (
                          <Image
                            src={member.userDetails.personal_info.profile_picture}
                            alt={getUserDisplayName(member.userDetails)}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          getAvatarFallback(member.userDetails)
                        )}
                      </div>
                      <span>{getUserDisplayName(member.userDetails)}</span>
                    </div>
                  </td>
                  <td className="py-3">{member.division.name}</td>
                  <td className="py-3">
                    {member.role === "division_head" ? "Head" : member.role}
                  </td>
                  <td className="py-3">
                    <button
                      className="ml-2 text-gray-500 cursor-pointer hover:text-red-600"
                      onClick={() => handleDeleteClick(member)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t border-gray-100">
                <td colSpan={4} className="py-8 text-center text-gray-500">
                  No members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && memberToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-4 mx-3">
            <h2 className="text-xl font-semibold">Confirm Removal</h2>
            <p>
              Are you sure you want to remove{" "}
              {getUserDisplayName(memberToDelete.userDetails)} as head of{" "}
              {memberToDelete.division.name}?
            </p>
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="h-10 px-6 rounded-[8px] border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="h-10 px-6 rounded-[8px] bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}