"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import Link from "next/link";

interface Member {
  _id: string;
  email: string;
}

interface Division {
  _id: string;
  name: string;
  members: Member[];
  year_of_establishment: number;
}

interface DivisionCardProps {
  division: Division;
  className?: string;
}

export default function DivisionCard({ division }: DivisionCardProps) {
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>({});

  // Create 4 groups with distributed members
  const totalGroups = 4;
  const membersPerGroup = Math.floor(division.members.length / totalGroups);
  const remainder = division.members.length % totalGroups;

  const groups = Array.from({ length: totalGroups }, (_, i) => ({
    id: i + 1,
    name: `Group ${i + 1}`,
    members: i < remainder ? membersPerGroup + 1 : membersPerGroup
  }));

  const toggleGroup = (groupId: number) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  return (
    <Card className="border-1 border-gray-300 rounded-[8px] p-3 dark:bg-gray-800 dark:border-gray-700 w-124 ml-1 mb-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-medium">{division.name}</CardTitle>
        <div className="flex gap-2">
          <Link href="/dashboard/alldivisions/groups">
            <Button
              variant="link"
              className="text-sm font-medium text-[#003087] cursor-pointer"
            >
              View All
            </Button>
          </Link>
          
        </div>
      </CardHeader>
      <div className="text-sm text-muted-foreground">
        {division.members.length} Members
      </div>
      <div className="flex justify-center border-b w-118 mt-1"></div>
      <CardContent className="p-0">
        <div className="space-y-1">
          {groups.map((group) => (
            <Collapsible
              key={group.id}
              open={openGroups[group.id]}
              onOpenChange={() => toggleGroup(group.id)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex w-full justify-between p-2 font-normal"
                >
                  <div className="flex flex-col items-start">
                    <span>{group.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {group.members} Members
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 cursor-pointer" />
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}