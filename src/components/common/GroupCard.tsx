"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Group data model
interface Group {
  id: number;
  name: string;
  totalMembers: number;
  members: Members[];
}

// Sample data
interface Members {
  id: number;
  name: string;
  speciality: string;
  imgUrl?: string;
}

interface GroupCardProps {
  division: Group;
  className?: string;
  linkText?: string; 
}

export default function GroupCard({ division, linkText = "View All" }: GroupCardProps) {
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>({});

  const toggleGroup = (groupId: number) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  return (
    <Card className="border-1 border-gray-300 rounded-[8px] p-3 dark:bg-gray-800 dark:border-gray-700 w-[49%] mb-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-medium">{division.name}</CardTitle>
        <Link href="/dashboard/alldivisions/groups/members">
          <Button
            variant="link"
            className="text-sm font-medium text-[#003087] cursor-pointer"
          >
            {linkText} 
          </Button>
        </Link>
      </CardHeader>
      <div className="text-sm text-muted-foreground">
        {division.totalMembers} Members
      </div>
      <div className="flex justify-center border-b mt-1"></div>
      <CardContent className="p-0">
        <div className="space-y-1">
          {division.members.map((group) => (
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
                    <div className="flex items-center gap-2">
                      <Avatar className="flex items-center">
                        <AvatarImage src={group.imgUrl} className="rounded-full"/>
                        <AvatarFallback className="rounded-full">CN</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <span>{group.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {group.speciality}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href="/dashboard/alldivisions/groups">
                    <ChevronRight className="h-4 w-4 cursor-pointer" />
                  </Link>
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
