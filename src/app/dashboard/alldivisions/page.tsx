"use client"
import DivisionsOverview from "@/components/pages/alldivisions/DivisionsOverview"
import DivisionsHeader from "@/components/pages/alldivisions/DivisionsHeader"
import { useState } from "react"

export default function DivisionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleSearch = (value: string) => {
    setSearchQuery(value)
  }

  const handleDivisionAdded = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="flex flex-col max-w-full mr-2 md:mr-5 my-3 py-2 md:py-4 gap-4 rounded-[8px] border-1 border-gray-300">
      <div className="flex">
        <div className="gap-3 flex flex-col p-1 md:p-2 w-full">
          <DivisionsHeader
            onSearch={handleSearch}
            placeholder="Search divisions..."
            onDivisionAdded={handleDivisionAdded}
          />
          <DivisionsOverview searchQuery={searchQuery} key={refreshTrigger} />
        </div>
      </div>
    </div>
  )
}
