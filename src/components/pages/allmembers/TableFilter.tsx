"use client";

import { FiFilter } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LuSearch } from "react-icons/lu";
import { AddMemberDialog } from "./AddMemberDialog";

interface TableFilterProps {
  onSearch?: (value: string) => void;
  onFilter?: () => void;
  placeholder?: string;
  className?: string;
}

export function TableFilter({
  onSearch,
  onFilter,
  placeholder = "Search...",
  className,
}: TableFilterProps) {
  return (
    <div
      className={cn("flex justify-between items-center", className)}
    >
      <div className="relative flex justify-center gap-1 p-2 border-1 border-gray-200 rounded-[8px] h-12 items-center focus:outline-blue-600 focus:border-blue-600">
        <LuSearch size={23} />
        <div>
          <Input
            type="text"
            placeholder="Search"
            className="outline-none border-0 shadow-none focus:outline-0 focus:border-0 focus:shadow-none"
          />
        </div>
      </div>
      <div className="flex gap-3">
        <div>
          <AddMemberDialog />
        </div>

        <div
          onClick={onFilter}
          className="flex justify-center border-1 border-gray-200 rounded-[8px] h-12 w-23 items-center cursor-pointer hover:bg-accent/80 transition duration-200 ease-in-out"
        >
          <FiFilter size={30} className="p-1 opacity-50" />
          <div className="pr-1">
            <h2 className="flex items-center justify-center font-[500] text-sm ">
              Filter
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
