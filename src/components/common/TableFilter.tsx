"use client"

import { useState } from "react"
import { FiFilter } from "react-icons/fi"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { LuSearch } from "react-icons/lu"
import { AddMemberDialog } from "./AddMemberDialog"
import { Button } from "../ui/button"
import { LuImport } from "react-icons/lu"
import type { ChangeEvent } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface TableFilterProps {
  onSearch?: (value: string) => void
  onFilter?: (filters: {
    divisions: string[]
    years: string[]
    statuses: string[]
  }) => void
  onSave?: () => void
  placeholder?: string
  className?: string
  importButton?: boolean
  addMembersButton?: boolean
  saveButton?: boolean
  saveButtonDisabled?: boolean
  saveButtonText?: string
  filterButton?: boolean
  onMemberAdded?: () => void
  divisions?: string[]
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
  const [searchValue, setSearchValue] = useState("")
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([])
  const [selectedYears, setSelectedYears] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])

  const years = ["1st", "2nd", "3rd", "4th", "5th"]
  const statuses = ["Active", "Inactive", "Needs Attention"]

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleFilterApply = () => {
    if (onFilter) {
      onFilter({
        divisions: selectedDivisions,
        years: selectedYears,
        statuses: selectedStatuses,
      })
    }
  }

  const handleFilterReset = () => {
    setSelectedDivisions([])
    setSelectedYears([])
    setSelectedStatuses([])
    if (onFilter) {
      onFilter({
        divisions: [],
        years: [],
        statuses: [],
      })
    }
  }

  return (
    <div className={cn("flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3", className)}>
      <div className="flex justify-center gap-1 p-2 border border-gray-300 rounded-[8px] h-12 items-center focus-within:outline-blue-600 focus-within:border-blue-600 w-full sm:w-auto sm:min-w-[250px] lg:min-w-[300px]">
        <LuSearch size={20} className="flex-shrink-0" />
        <div className="flex-1">
          <Input
            type="text"
            placeholder={placeholder}
            className="outline-none border-0 shadow-none focus:outline-0 focus:border-0 focus:shadow-none text-sm"
            onChange={handleSearchChange}
            value={searchValue}
          />
        </div>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3">
        {saveButton && (
          <Button
            variant="none"
            className="flex rounded-md bg-[#003087] text-white h-12 px-4 items-center justify-center cursor-pointer hover:bg-[#002f87a2] flex-1 sm:flex-none sm:min-w-[100px]"
            onClick={onSave}
            disabled={saveButtonDisabled}
          >
            <div className="flex gap-1 items-center justify-center">
              <div className="text-sm lg:text-base">{saveButtonText}</div>
            </div>
          </Button>
        )}

        {importButton && (
          <Button
            variant="default"
            className="flex rounded-md bg-[#003087] text-white h-12 px-4 items-center justify-center cursor-pointer hover:bg-[#002f87a2] flex-1 sm:flex-none sm:min-w-[100px]"
          >
            <div className="flex gap-1 items-center justify-center">
              <LuImport size={18} />
              <div className="text-sm lg:text-base">Import</div>
            </div>
          </Button>
        )}

        {addMembersButton && onMemberAdded && (
          <div className="flex-1 sm:flex-none">
            <AddMemberDialog onMemberAdded={onMemberAdded} />
          </div>
        )}

        {filterButton && (
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex justify-center border border-gray-300 rounded-[8px] h-12 px-3 items-center cursor-pointer hover:bg-accent/80 transition duration-200 ease-in-out flex-1 sm:flex-none sm:min-w-[80px]">
                <FiFilter size={20} className="opacity-50 flex-shrink-0" />
                <div className="ml-1">
                  <h2 className="flex items-center justify-center font-[500] text-sm">Filter</h2>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-fit mr-2 sm:mr-5" align="end">
              <div className="grid gap-2">
                <div className="space-y-1">
                  <h4 className="font-medium leading-none">Filters</h4>
                </div>
                <div className="grid gap-3">
                  <div>
                    <Label className="text-sm font-medium">Division</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
                      {divisions.map((division, index) => (
                        <div key={`${division}-${index}`} className="flex items-center space-x-2">
                          <Checkbox
                            id={`division-${division}-${index}`}
                            checked={selectedDivisions.includes(division)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedDivisions([...selectedDivisions, division])
                              } else {
                                setSelectedDivisions(selectedDivisions.filter((d) => d !== division))
                              }
                            }}
                            className="h-4 w-4"
                          />
                          <label
                            htmlFor={`division-${division}-${index}`}
                            className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {division}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Year</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {years.map((year) => (
                        <div key={year} className="flex items-center space-x-2">
                          <Checkbox
                            id={`year-${year}`}
                            checked={selectedYears.includes(year)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedYears([...selectedYears, year])
                              } else {
                                setSelectedYears(selectedYears.filter((y) => y !== year))
                              }
                            }}
                            className="h-4 w-4"
                          />
                          <label
                            htmlFor={`year-${year}`}
                            className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {year}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {statuses.map((status) => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox
                            id={`status-${status}`}
                            checked={selectedStatuses.includes(status)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedStatuses([...selectedStatuses, status])
                              } else {
                                setSelectedStatuses(selectedStatuses.filter((s) => s !== status))
                              }
                            }}
                            className="h-4 w-4"
                          />
                          <label
                            htmlFor={`status-${status}`}
                            className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer whitespace-nowrap"
                          >
                            {status}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between mt-4 gap-2">
                  <Button variant="outline" className="p-2 text-sm" size="sm" onClick={handleFilterReset}>
                    Reset
                  </Button>
                  <Button size="sm" className="bg-[#003087] text-white p-2 text-sm" onClick={handleFilterApply}>
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  )
}
