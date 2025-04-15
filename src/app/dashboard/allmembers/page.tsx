"use client";

import { useState } from "react";
import { MembersTable, type Member } from "@/components/pages/allmembers/MembersTable";
import { TableFilter } from "@/components/pages/allmembers/TableFilter";
import { TablePagination } from "@/components/pages/allmembers/TablePagination";

// Sample data
const sampleMembers: Member[] = [
  {
    id: "UGR/5800/14",
    name: "Kiya Kebe",
    avatar: "/placeholder.svg?height=40&width=40",
    attendance: "Active",
    year: "4th",
    status: "OnCampus",
  },
  {
    id: "UGR/5870/14",
    name: "Mohammed Sadik",
    avatar: "/placeholder.svg?height=40&width=40",
    attendance: "Active",
    year: "5th",
    status: "OffCampus",
  },
  {
    id: "UGR/5850/14",
    name: "Hussein Beshir",
    avatar: "/placeholder.svg?height=40&width=40",
    attendance: "Needs Attention",
    year: "3rd",
    status: "Withdrawn",
  },
  {
    id: "UGR/5340/14",
    name: "Estifanos Tesfaye",
    avatar: "/placeholder.svg?height=40&width=40",
    attendance: "Inactive",
    year: "4th",
    status: "Withdrawn",
  },
  {
    id: "UGR/2840/14",
    name: "Mahelet Yared",
    avatar: "/placeholder.svg?height=40&width=40",
    attendance: "Needs Attention",
    year: "5th",
    status: "Withdrawn",
  },
  {
    id: "UGR/1800/14",
    name: "Kiya Kebe",
    avatar: "/placeholder.svg?height=40&width=40",
    attendance: "Active",
    year: "4th",
    status: "OnCampus",
  },
  {
    id: "UGR/1870/14",
    name: "Mohammed Sadik",
    avatar: "/placeholder.svg?height=40&width=40",
    attendance: "Active",
    year: "5th",
    status: "OffCampus",
  },
  {
    id: "UGR/1850/14",
    name: "Hussein Beshir",
    avatar: "/placeholder.svg?height=40&width=40",
    attendance: "Needs Attention",
    year: "3rd",
    status: "Withdrawn",
  },
  {
    id: "UGR/1340/14",
    name: "Estifanos Tesfaye",
    avatar: "/placeholder.svg?height=40&width=40",
    attendance: "Inactive",
    year: "4th",
    status: "Withdrawn",
  },
  {
    id: "UGR/1840/14",
    name: "Mahelet Yared",
    avatar: "/placeholder.svg?height=40&width=40",
    attendance: "Needs Attention",
    year: "5th",
    status: "Withdrawn",
  },
  
];

export default function ExampleUsage() {
  const [activeItem, setActiveItem] = useState("All Members");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // handlers
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    console.log("Searching for:", value);
  };

  const handleFilter = () => {
    console.log("Filter button clicked");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Page changed to:", page);
  };

  return (
    <div
      className="flex flex-col h-full w-auto gap-4 rounded-[8px] border-1 border-gray-300"
    >
      <div className="flex">
        {/* Main Content */}
        <div
          className="flex-1 gap-3 flex flex-col overflow-hidden p-2"
        >
          {/* Main Content Area */}
          <main className="flex-1 flex flex-col gap-6 overflow-auto">
            {/* Filter */}
            <TableFilter
              onSearch={handleSearch}
              onFilter={handleFilter}
              placeholder="Search members..."
            />
            <div>
              {/* Table */}
              <MembersTable members={sampleMembers} />

              {/* Pagination */}
              <TablePagination
                currentPage={currentPage}
                totalPages={5}
                totalItems={42}
                itemsPerPage={10}
                onPageChange={handlePageChange}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
