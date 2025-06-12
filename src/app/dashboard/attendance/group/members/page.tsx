"use client";

import { useState, useEffect, useMemo } from "react";
import AttendanceTable from "@/components/pages/attendance/AttendanceTable";
import { TableFilter } from "@/components/common/TableFilter";
import { TablePagination } from "@/components/common/TablePagination";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import Cookies from "js-cookie";

export default function TableUsage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [saving, setSaving] = useState(false);
  const [pendingAttendance, setPendingAttendance] = useState<
    Record<string, "present" | "absent">
  >({});
  const [allMembers, setAllMembers] = useState<any[]>([]);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });
  const [sessionDate, setSessionDate] = useState<string>("");
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  // Fetch session date when sessionId changes
  useEffect(() => {
    const fetchSessionDate = async () => {
      if (!sessionId) return;

      try {
        const token = Cookies.get("accessToken");
        if (!token) return;

        const response = await api.get(`/session/${sessionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
          withCredentials: false,
        });

        setSessionDate(response.data.date);
      } catch (err) {
        console.error("Failed to fetch session date:", err);
      }
    };

    fetchSessionDate();
  }, [sessionId]);

  // Fetch all members data (unchanged from original)
  useEffect(() => {
    const fetchMembers = async () => {
      if (!sessionId) return;

      try {
        const token = Cookies.get("accessToken");
        if (!token) return;

        const response = await api.get(`/session/${sessionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
          withCredentials: false,
        });

        if (response.data?.members) {
          setAllMembers(response.data.members);
        }
      } catch (err) {
        console.error("Failed to fetch members:", err);
      }
    };

    fetchMembers();
  }, [sessionId]);

  // Filter members based on search term (frontend-only)
  const filteredMembers = useMemo(() => {
    if (!searchTerm.trim()) return allMembers;
    
    return allMembers.filter(member => {
      const fullName = `${member.personal_info?.first_name || ''} ${member.personal_info?.last_name || ''}`.toLowerCase();
      const email = member.email.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase()) || 
             email.includes(searchTerm.toLowerCase());
    });
  }, [allMembers, searchTerm]);

  // Paginate members (frontend-only)
  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMembers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMembers, currentPage, itemsPerPage]);

  // Show toast message
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000
    );
  };

  // Save all attendance changes (unchanged from original)
  const saveAllAttendance = async () => {
    if (!sessionId || Object.keys(pendingAttendance).length === 0) {
      showToast("No attendance changes to save", "error");
      return;
    }

    try {
      setSaving(true);
      const token = Cookies.get("accessToken");
      if (!token) throw new Error("No authentication token");

      const attendanceRecords = Object.entries(pendingAttendance).map(
        ([profile, status]) => ({
          profile,
          session: sessionId,
          status,
          sessionDate: sessionDate,
        })
      );

      let successCount = 0;
      for (const record of attendanceRecords) {
        try {
          await api.post("/attendance/mark", record, {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
            withCredentials: false,
          });
          successCount++;
        } catch (err) {
          console.error(`Failed to save attendance for ${record.profile}:`, err);
        }
      }

      if (successCount === attendanceRecords.length) {
        showToast("All attendance records saved successfully!", "success");
      } else {
        showToast(
          `Saved ${successCount} of ${attendanceRecords.length} records`,
          "error"
        );
      }

      setPendingAttendance({});
    } catch (err) {
      console.error("Failed to save attendance:", err);
      showToast("Failed to save attendance", "error");
    } finally {
      setSaving(false);
    }
  };

  // handlers
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFilter = () => {
    console.log("Filter button clicked");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleAttendanceChange = (
    id: string,
    status: "present" | "absent" | null
  ) => {
    setPendingAttendance((prev) => {
      if (status === null) {
        const newStatus = { ...prev };
        delete newStatus[id];
        return newStatus;
      }
      return { ...prev, [id]: status };
    });
  };

  return (
    <div className="flex flex-col h-auto max-w-full sm:mr-4 mx-2 my-3  gap-4 rounded-[8px] border-1 border-gray-300">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`
          fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg
          ${toast.type === "success" ? "bg-green-500" : "bg-red-500"} text-white
          animate-fade-in-out
        `}
        >
          {toast.message}
        </div>
      )}

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 gap-3 flex flex-col p-2 m-3 h-full">
          {/* Main Content Area */}
          <main className="flex-1 flex flex-col gap-6">
            {/* Table Filter with Save Button */}
            <TableFilter
              placeholder="Search members..."
              saveButton={true}
              onSave={saveAllAttendance}
              saveButtonDisabled={
                saving || Object.keys(pendingAttendance).length === 0
              }
              saveButtonText={saving ? "Saving..." : "Save"}
              onSearch={handleSearch}
              onFilter={handleFilter}
            />
            <div>
              {/* Attendance Table */}
              <div className="flex flex-col min-h-100 md:min-h-150">
                <div className="h-full hidden sm:flex sm:justify-between gap-4 border-b py-1 text-sm font-medium justify-end text-gray-500">
                  <div>Member Name</div>
                  <div className="flex justify-center pl-8">Attendance</div>
                  <div className="flex justify-end pr-15">Excused</div>
                </div>
                <AttendanceTable
                  onAttendanceChange={handleAttendanceChange}
                  pendingAttendance={pendingAttendance}
                />
              </div>

              {/* Pagination */}
              <TablePagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredMembers.length / itemsPerPage)}
                totalItems={filteredMembers.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            </div>
          </main>
        </div>
      </div>

      {/* Toast Animation CSS */}
      <style jsx>{`
        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          10% {
            opacity: 1;
            transform: translateY(0);
          }
          90% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-20px);
          }
        }
        .animate-fade-in-out {
          animation: fadeInOut 3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}