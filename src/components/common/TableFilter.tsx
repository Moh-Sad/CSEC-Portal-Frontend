"use client";

import { FiFilter } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LuSearch } from "react-icons/lu";
import { AddMemberDialog } from "./AddMemberDialog";
import { Button } from "../ui/button";
import { LuImport } from "react-icons/lu";
import { ChangeEvent, useState } from "react";

interface TableFilterProps {
  onSearch?: (value: string) => void;
  onFilter?: () => void;
  placeholder?: string;
  className?: string;
  importButton?: boolean;
  addMembersButton?: boolean;
  saveButton?: boolean;
}

export function TableFilter({ 
  onSearch, 
  onFilter, 
  className, 
  importButton = false, 
  addMembersButton = false, 
  saveButton = false,
  placeholder = "Search"
}: TableFilterProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className={cn("flex justify-between items-center", className)}>
      <div className="flex justify-center gap-1 p-2 border-1 border-gray-300 rounded-[8px] h-12 items-center focus:outline-blue-600 focus:border-blue-600">
        <LuSearch size={23} />
        <div>
          <Input
            type="text"
            placeholder={placeholder}
            className="outline-none border-0 shadow-none focus:outline-0 focus:border-0 focus:shadow-none"
            onChange={handleSearchChange}
            value={searchValue}
          />
        </div>
      </div>
      <div className="flex gap-3">
      {saveButton && (
          <Button
            variant="default"
            className="flex rounded-md bg-[#003087] text-white h-12 w-25 items-center justify-center cursor-pointer hover:bg-[#002f87a2]"
          >
            <div className="flex gap-1 items-center justify-center">
              <div className="text-lg">Save</div>
            </div>
          </Button>
        )}
        {importButton && (
          <Button
            variant="default"
            className="flex rounded-md bg-[#003087] text-white h-12 w-25 items-center justify-center cursor-pointer hover:bg-[#002f87a2]"
          >
            <div className="flex gap-1 items-center justify-center">
              <LuImport size={50} />
              <div>Import</div>
            </div>
          </Button>
        )}
        {addMembersButton && (
        <div>
          <AddMemberDialog onMemberAdded={() => { console.log("Member added"); }} />
        </div>
        )}
        <div
          onClick={onFilter}
          className="flex justify-center border-1 border-gray-300 rounded-[8px] h-12 w-23 items-center cursor-pointer hover:bg-accent/80 transition duration-200 ease-in-out"
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