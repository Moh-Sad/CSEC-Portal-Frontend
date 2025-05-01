"use client";

import { useState, useEffect } from "react";
import { MembersTable } from "@/components/pages/allmembers/MembersTable";
import { TableFilter } from "@/components/common/TableFilter";
import { TablePagination } from "@/components/common/TablePagination";
import api from "@/lib/axios";
import Cookies from "js-cookie";

type Member = {
  _id: string;
  email: string;
  name: string;
  memberId: string;
  attendance: string;
  year: string;
  status: string;
  avatar?: string;
};

export default function MembersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = Cookies.get('accessToken');
        if (!token) {
          setError('Please login to view members');
          return;
        }

        const response = await api.get('/user', {
          headers: { 
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          },
          params: { page: currentPage, limit: itemsPerPage },
          withCredentials: false
        });

        if (response.data?.data) {
          const formattedMembers = response.data.data.map((user: any) => ({
            _id: user._id,
            email: user.email,
            name: user.personal_info?.full_name || user.email.split('@')[0],
            memberId: user._id.slice(-6).toUpperCase(),
            attendance: "Active", // Default value
            year: "2023", // Default value
            status: "OnCampus", // Default value
            avatar: "/placeholder.svg?height=40&width=40"
          }));
          setMembers(formattedMembers);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch members");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [currentPage]);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
        <button 
          onClick={() => window.location.reload()}
          className="bg-[#003087] hover:bg-[#002f87a2] text-white rounded-[10px] p-2"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-w-240 max-w-full mr-5 my-3 gap-4 rounded-[8px] border-1 border-gray-300">
      <div className="flex">
        <div className="flex-1 gap-3 flex flex-col p-2">
          <main className="flex-1 flex flex-col gap-6">
            <TableFilter
              onSearch={handleSearch}
              onFilter={() => console.log("Filter clicked")}
              placeholder="Search members..."
              addMembersButton={true}
              importButton={true}
            />
            <div>
              <MembersTable members={paginatedMembers} />
              {filteredMembers.length > 0 && (
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
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