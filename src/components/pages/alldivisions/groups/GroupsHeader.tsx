"use client";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";
import { LuSearch } from "react-icons/lu";
import { AddGroupDialog } from "@/components/pages/alldivisions/groups/AddGroupDialog";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useSearchParams } from "next/navigation";

interface TableFilterProps {
  onSearch?: (value: string) => void;
  onFilter?: () => void;
  placeholder?: string;
  className?: string;
  onGroupAdded?: () => void;
}

export function GroupsHeader({ className, onGroupAdded }: TableFilterProps) {
  const [isInSameDivision, setIsInSameDivision] = useState(false);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const divisionId = searchParams.get("divisionId");
  const currentUserRole = Cookies.get("role");

  useEffect(() => {
    const checkUserInDivision = async () => {
      if (!divisionId) {
        setLoading(false);
        return;
      }

      try {
        const token = Cookies.get('accessToken');
        const userString = localStorage.getItem("user");
        
        if (!token || !userString) {
          setLoading(false);
          return;
        }

        const user = JSON.parse(userString);
        const userId = user._id;

        // Fetch groups in this division
        const response = await api.get(`/group/${divisionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          }
        });

        // Check if user is in any group in this division
        const isMember = response.data.some((group: any) => 
          group.members.includes(userId)
        );

        setIsInSameDivision(isMember);
      } catch (error) {
        console.error("Error checking user division:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserInDivision();
  }, [divisionId]);

  if (loading) return null;

  return (
    <div className={cn("flex justify-end items-center p-5", className)}>
      <div className="hidden justify-center gap-1 p-2 border-1 border-gray-300 rounded-[8px] h-12 items-center focus:outline-blue-600 focus:border-blue-600">
        <LuSearch size={23} />
        <div>
          <Input
            type="text"
            placeholder="Search"
            className="outline-none border-0 shadow-none focus:outline-0 focus:border-0 focus:shadow-none"
          />
        </div>
      </div>
      {currentUserRole !== "member" && isInSameDivision && (
        <div className="flex gap-3">
          <div>
            <AddGroupDialog onGroupAdded={onGroupAdded} />
          </div>
        </div>
      )}
    </div>
  );
}