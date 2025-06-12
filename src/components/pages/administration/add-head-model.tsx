"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface User {
  _id: string;
  email: string;
  personal_info?: {
    first_name?: string;
    last_name?: string;
  };
}

interface Division {
  _id: string;
  name: string;
}

interface DivisionResponse {
  _id: string;
  name: string;
  members: User[];
}

interface AddHeadModalProps {
  onClose: () => void;
  onHeadAdded: () => void;
}

export default function AddHeadModal({
  onClose,
  onHeadAdded,
}: AddHeadModalProps) {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [divisionUsers, setDivisionUsers] = useState<User[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDivisions, setLoadingDivisions] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const match = document.cookie.match(/accessToken=([^;]+)/);
    setToken(match?.[1] || "");
  }, []);

  useEffect(() => {
    const fetchDivisions = async () => {
      if (!token) return;

      setLoadingDivisions(true);
      try {
        const response = await api.get<{ data: Division[] }>("/division", {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        });
        setDivisions(response.data.data);
      } catch (error) {
        console.error("Error fetching divisions:", error);
      } finally {
        setLoadingDivisions(false);
      }
    };

    fetchDivisions();
  }, [token]);

  const fetchDivisionMembers = async (divisionId: string) => {
    if (!token || !divisionId) return;

    setIsLoading(true);
    try {
      const response = await api.get<DivisionResponse>(
        `/division/${divisionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (response.data?.members) {
        setDivisionUsers(response.data.members);
      } else {
        setDivisionUsers([]);
      }
    } catch (error: any) {
      console.error("Error fetching division:", error);
      let errorMessage = "Failed to fetch division data";

      if (error.code === "ECONNABORTED") {
        errorMessage = "Request timed out. Please try again.";
      } else if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }
      setDivisionUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDivision) {
      fetchDivisionMembers(selectedDivision);
      setSelectedUser("");
    } else {
      setDivisionUsers([]);
    }
  }, [selectedDivision]);

  const getUserDisplayName = (user: User) => {
    if (user.personal_info?.first_name || user.personal_info?.last_name) {
      return `${user.personal_info.first_name || ""} ${
        user.personal_info.last_name || ""
      }`.trim();
    }
    return user.email;
  };

  const handleAssign = async () => {
    if (!selectedUser || !selectedDivision || !selectedRole) {
      return;
    }

    try {
      const response = await api.post(
        "/head",
        {
          userId: selectedUser,
          divisionId: selectedDivision,
          role: selectedRole === "head" ? "division_head" : "vice_president",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );

      onHeadAdded();
      onClose();
    } catch (error: any) {
      console.error("Error assigning head:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-6 mx-3">
        <h2 className="text-xl font-semibold">Add New Head</h2>

        <div className="space-y-4">
          <div>
            <Select onValueChange={setSelectedRole} value={selectedRole}>
              <SelectTrigger className="w-full text-gray-400">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="head">Head</SelectItem>
                <SelectItem value="vice-president">Vice President</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select
              onValueChange={setSelectedDivision}
              value={selectedDivision}
              disabled={loadingDivisions}
            >
              <SelectTrigger className="w-full text-gray-400">
                <SelectValue
                  placeholder={
                    loadingDivisions
                      ? "Loading divisions..."
                      : "Select Division"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {divisions.map((division) => (
                  <SelectItem key={division._id} value={division._id}>
                    {division.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select
              onValueChange={setSelectedUser}
              value={selectedUser}
              disabled={!selectedDivision || isLoading}
            >
              <SelectTrigger className="w-full text-gray-400">
                <SelectValue
                  placeholder={
                    isLoading
                      ? "Loading members..."
                      : selectedDivision
                      ? "Select member"
                      : "Select division first"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {divisionUsers.length > 0 ? (
                  divisionUsers.map((user) => (
                    <SelectItem key={user._id} value={user._id}>
                      {getUserDisplayName(user)}
                    </SelectItem>
                  ))
                ) : (
                  <div className="text-sm text-gray-500 p-2">
                    {selectedDivision && !isLoading
                      ? "No members found in this division"
                      : ""}
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-10 px-6 rounded-[8px] border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </Button>

          <Button
            onClick={handleAssign}
            className="h-10 px-6 rounded-[8px] bg-[#003081] hover:bg-[#002a6e] text-white cursor-pointer"
            disabled={
              !selectedUser || !selectedDivision || !selectedRole || isLoading
            }
          >
            {isLoading ? "Assigning..." : "Assign"}
          </Button>
        </div>
      </div>
    </div>
  );
}
