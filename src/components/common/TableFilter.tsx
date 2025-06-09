"use client";

import { useState } from "react";
import { FiFilter } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LuSearch } from "react-icons/lu";
import { AddMemberDialog } from "./AddMemberDialog";
import { Button } from "../ui/button";
import { LuImport } from "react-icons/lu";
import { ChangeEvent } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface TableFilterProps {
  onSearch?: (value: string) => void;
  onFilter?: (filters: {
    divisions: string[];
    years: string[];
    statuses: string[];
  }) => void;
  onSave?: () => void;
  placeholder?: string;
  className?: string;
  importButton?: boolean;
  addMembersButton?: boolean;
  saveButton?: boolean;
  saveButtonDisabled?: boolean;
  saveButtonText?: string;
  filterButton?: boolean;
  onMemberAdded?: () => void;
  divisions?: string[];
}

export function TableFilter({
  onSearch,
  onFilter,
  onSave,
  className,
  importButton = false,
  addMembersButton = false,
  saveButton = false,
  saveButtonDisabled = false,
  filterButton = true,
  saveButtonText = "Save",
  placeholder = "Search",
  onMemberAdded,
  divisions = [],

}: TableFilterProps) {
  const [searchValue, setSearchValue] = useState("");
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const years = ["1st", "2nd", "3rd", "4th", "5th"];
  const statuses = ["Active", "Inactive", "Needs Attention"];

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleFilterApply = () => {
    if (onFilter) {
      onFilter({
        divisions: selectedDivisions,
        years: selectedYears,
        statuses: selectedStatuses,
      });
    }
  };

  const handleFilterReset = () => {
    setSelectedDivisions([]);
    setSelectedYears([]);
    setSelectedStatuses([]);
    if (onFilter) {
      onFilter({
        divisions: [],
        years: [],
        statuses: [],
      });
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
            variant="none"
            className="flex rounded-md bg-[#003087] text-white h-12 w-25 items-center justify-center cursor-pointer hover:bg-[#002f87a2]"
            onClick={onSave}
            disabled={saveButtonDisabled}
          >
            <div className="flex gap-1 items-center justify-center">
              <div className="text-lg">{saveButtonText}</div>
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
        {addMembersButton && onMemberAdded && (
          <AddMemberDialog onMemberAdded={onMemberAdded} />
        )}
        {filterButton && (
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex justify-center border-1 border-gray-300 rounded-[8px] h-12 w-23 items-center cursor-pointer hover:bg-accent/80 transition duration-200 ease-in-out">
              <FiFilter size={30} className="p-1 opacity-50" />
              <div className="pr-1">
                <h2 className="flex items-center justify-center font-[500] text-sm">
                  Filter
                </h2>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-fit mr-5">
            <div className="grid gap-2">
              <div className="space-y-1">
                <h4 className="font-medium leading-none">Filters</h4>
              </div>
              <div className="grid gap-1">
                <div>
                  <Label>Division</Label>
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    {divisions.map((division, index) => (
                      <div
                        key={`${division}-${index}`}
                        className="flex items-center space-x-1"
                      >
                        <Checkbox
                          id={`division-${division}-${index}`}
                          checked={selectedDivisions.includes(division)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedDivisions([
                                ...selectedDivisions,
                                division,
                              ]);
                            } else {
                              setSelectedDivisions(
                                selectedDivisions.filter((d) => d !== division)
                              );
                            }
                          }}
                          className="h-4 w-4"
                        />
                        <label
                          htmlFor={`division-${division}-${index}`}
                          className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {division}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Year</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {" "}
                    {years.map((year) => (
                      <div key={year} className="flex items-center space-x-1">
                        {" "}
                        <Checkbox
                          id={`year-${year}`}
                          checked={selectedYears.includes(year)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedYears([...selectedYears, year]);
                            } else {
                              setSelectedYears(
                                selectedYears.filter((y) => y !== year)
                              );
                            }
                          }}
                          className="h-4 w-4"
                        />
                        <label
                          htmlFor={`year-${year}`}
                          className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {year}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {" "}
                    {statuses.map((status) => (
                      <div key={status} className="flex items-center space-x-1">
                        {" "}
                        <Checkbox
                          id={`status-${status}`}
                          checked={selectedStatuses.includes(status)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedStatuses([
                                ...selectedStatuses,
                                status,
                              ]);
                            } else {
                              setSelectedStatuses(
                                selectedStatuses.filter((s) => s !== status)
                              );
                            }
                          }}
                          className="h-4 w-4"
                        />
                        <label
                          htmlFor={`status-${status}`}
                          className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {status}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-2">
                {" "}
                <Button
                  variant="outline"
                  className="p-2"
                  size="sm"
                  onClick={handleFilterReset}
                >
                  Reset
                </Button>
                <Button
                  size="sm"
                  className="bg-[#003087] text-white p-2"
                  onClick={handleFilterApply}
                >
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>)}
      </div>
    </div>
  );
}
