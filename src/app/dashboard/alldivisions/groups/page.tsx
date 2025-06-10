"use client"
import GroupOverview from "@/components/pages/alldivisions/groups/GroupOverview"
import { GroupsHeader } from "@/components/pages/alldivisions/groups/GroupsHeader"
import { useState } from "react"

export default function TableUsage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const handleSearch = (value: string) => {
    console.log("Searching for:", value)
  }

  const handleGroupAdded = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="flex flex-col max-w-full mr-2 sm:mr-5 my-2 sm:my-3 p-2 sm:p-4 gap-2 sm:gap-4 rounded-[8px] border-1 border-gray-300">
      <div className="flex">
        <div className="gap-2 sm:gap-3 flex flex-col w-full">
          <main className="flex flex-col gap-2 sm:gap-4 w-full">
            <GroupsHeader onGroupAdded={handleGroupAdded} />
            <GroupOverview key={refreshKey} />
          </main>
        </div>
      </div>
    </div>
  )
}
