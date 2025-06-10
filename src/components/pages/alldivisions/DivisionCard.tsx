"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"

interface Group {
  id: string
  name: string
  members: number
}

interface Division {
  id: string
  name: string
  totalMembers: number
  groups: Group[]
}

interface DivisionCardProps {
  division: Division
  className?: string
}

export default function DivisionCard({ division }: DivisionCardProps) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }))
  }

  return (
    <Card className="border-1 border-gray-300 rounded-[8px] p-2 md:p-3 dark:bg-gray-800 dark:border-gray-700 max-w-auto ml-1 mb-1 w-full">
      <CardHeader className="flex flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <CardTitle className="text-lg md:text-xl font-medium break-words">{division.name}</CardTitle>
        <Link href={`/dashboard/alldivisions/groups?divisionId=${division.id}`}>
          <Button variant="link" className="text-sm font-medium text-[#003087] cursor-pointer p-0 h-auto">
            View All
          </Button>
        </Link>
      </CardHeader>
      <div className="text-sm text-muted-foreground">{division.totalMembers} Groups</div>
      <div className="flex justify-center border-b w-full mt-1 mx-6"></div>
      <CardContent className="p-0">
        <div className="space-y-1">
          {division.groups.map((group) => (
            <Collapsible key={group.id} open={openGroups[group.id]} onOpenChange={() => toggleGroup(group.id)}>
              <CollapsibleTrigger asChild>
                <Link href={`/dashboard/alldivisions/groups/members?groupId=${group.id}&divisionId=${division.id}`}>
                  <Button
                    variant="ghost"
                    className="flex w-full justify-between p-2 font-normal cursor-pointer text-left"
                  >
                    <div className="flex flex-col items-start min-w-0 flex-1">
                      <span className="break-words">{group.name}</span>
                      <span className="text-xs text-muted-foreground">{group.members} Members</span>
                    </div>

                    <ChevronRight className="h-4 w-4 flex-shrink-0 ml-2" />
                  </Button>
                </Link>
              </CollapsibleTrigger>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
