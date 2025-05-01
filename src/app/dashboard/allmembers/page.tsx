"use client";

import { useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import { MembersTable } from "@/components/pages/allmembers/MembersTable";
import { TableFilter } from "@/components/common/TableFilter";
import { TablePagination } from "@/components/common/TablePagination";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";

export default function MembersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [canAddMembers, setCanAddMembers] = useState(false);
  const [allMembers, setAllMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 6;

  useEffect(() => {
    const role = Cookies.get('role');
    setCanAddMembers(!!role && role !== 'member');
    fetchMembers();
  }, [currentPage, refreshKey]);

  const fetchMembers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = Cookies.get('accessToken');
      if (!token) {
        setError('Please login again to view members');
        setIsLoading(false);
        return;
      }

      const response = await api.get('/user', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        },
        withCredentials: false
      });

      if (Array.isArray(response.data)) {
        setAllMembers(response.data);
        setTotalItems(response.data.length);
      } else if (Array.isArray(response.data.data)) {
        setAllMembers(response.data.data);
        setTotalItems(response.data.total || response.data.data.length);
      } else {
        setError('Received unexpected data format from server');
      }
    } catch (error: any) {
      setError(error.message || "Failed to fetch members");
    } finally {
      setIsLoading(false);
    }
  };

  const getMemberDisplayName = (member: any) => {
    return member.personal_info?.first_name || member.personal_info?.last_name
      ? `${member.personal_info.first_name || ""} ${
          member.personal_info.last_name || ""
        }`.trim()
      : member.email.split("@")[0];
  };

  const filteredMembers = useMemo(() => {
    if (!searchQuery) return allMembers;
    const query = searchQuery.toLowerCase();
    return allMembers.filter(member => {
      const displayName = getMemberDisplayName(member).toLowerCase();
      return displayName.includes(query);
    });
  }, [allMembers, searchQuery]);

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMembers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMembers, currentPage, itemsPerPage]);

  const handleRetry = () => {
    setError(null);
    fetchMembers();
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleMemberAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleDeleteSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-red-500 text-center max-w-md">{error}</div>
        <Button
          onClick={handleRetry}
          className="bg-[#003087] hover:bg-[#002f87a2] text-white rounded-[10px] p-2"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-w-240 max-w-full mr-5 my-3 gap-4 rounded-[8px] border-1 border-gray-300">
      <div className="flex">
        <div className="flex-1 gap-3 flex flex-col p-2">
          <main className="flex-1 flex flex-col gap-6">
            <div>
              <TableFilter
                onSearch={handleSearch}
                onFilter={() => console.log("Filter clicked")}
                placeholder="Search members..."
                addMembersButton={canAddMembers}
              />
            </div>
            <div>
              <MembersTable 
                apiMembers={paginatedMembers} 
                onDeleteSuccess={handleDeleteSuccess} 
              />
              {allMembers.length > 0 && (
                <TablePagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredMembers.length / itemsPerPage)}
                  totalItems={filteredMembers.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}