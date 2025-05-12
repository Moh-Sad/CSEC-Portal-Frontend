"use client";
import { Input } from "@/components/ui/input";
import { LuSearch } from "react-icons/lu";
import { AddDivisionDialog } from "@/components/pages/alldivisions/AddDivisionDialog";
import Cookies from "js-cookie";

interface DivisionHeaderProps {
  onSearch: (value: string) => void;
  placeholder: string;
  onDivisionAdded: () => void;
}

export default function DivisionHeader({
  onSearch,
  placeholder,
  onDivisionAdded,
}: DivisionHeaderProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };
  const currentUserRole = Cookies.get("role");

  return (
    <div className="flex items-center justify-end mx-4">
      <div className="hidden justify-center gap-1 border-1 border-gray-300 rounded-[8px] h-12 items-center focus:outline-blue-600 focus:border-blue-600">
        <LuSearch size={45} className="p-3" />
        <Input
          type="text"
          placeholder={placeholder}
          className="outline-none border-0 shadow-none focus:outline-0 focus:border-0 focus:shadow-none"
          onChange={handleSearchChange}
        />
      </div>
      {currentUserRole === "president" && (
        <AddDivisionDialog onDivisionAdded={onDivisionAdded} />
      )}
    </div>
  );
}
