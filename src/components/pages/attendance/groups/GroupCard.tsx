"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSearchParams } from "next/navigation";

interface Member {
  id: string;
  name: string;
  speciality: string;
  imgUrl?: string;
}

interface Group {
  id: string;
  name: string;
  totalMembers: number;
  members: Member[];
}

interface GroupCardProps {
  division: Group;
  className?: string;
  linkText?: string; 
}

export default function GroupCard({ division, linkText = "View All" }: GroupCardProps) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  const toggleGroup = (memberId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [memberId]: !prev[memberId],
    }));
  };

  return (
    <Card className="border-1 border-gray-300 rounded-[8px] p-2 sm:p-3 dark:bg-gray-800 dark:border-gray-700 w-full sm:w-[49%] mb-2 sm:mb-1">
      <CardHeader className="flex flex-row items-center justify-between p-2 sm:p-0 sm:pb-2">
        <CardTitle className="text-sm sm:text-xl font-medium">{division.name}</CardTitle>
        <Link 
          href={`/dashboard/attendance/group/members?groupId=${division.id}&sessionId=${sessionId}`}
          passHref
        >
          <Button
            variant="link"
            className="text-xs sm:text-sm font-medium text-[#003087] cursor-pointer p-0 sm:p-1"
          >
            {linkText} 
          </Button>
        </Link>
      </CardHeader>
      <div className="text-xs sm:text-sm text-muted-foreground pl-2 sm:pl-0">
        {division.totalMembers} Members
      </div>
      <div className="flex justify-center border-b mt-1 sm:mt-1"></div>
      <CardContent className="p-0 sm:p-0">
        <div className="space-y-0 sm:space-y-1">
          {division.members.map((member) => (
            <Collapsible
              key={member.id}
              open={openGroups[member.id]}
              onOpenChange={() => toggleGroup(member.id)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex w-full justify-between p-1 sm:p-2 font-normal"
                >
                  <Link 
                    href={`/dashboard/allmembers/profile?id=${member.id}`}
                    passHref
                    className="flex justify-between w-full items-center"
                  >
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Avatar className="flex items-center h-6 w-6 sm:h-8 sm:w-8">
                        <AvatarImage src={member.imgUrl} className="rounded-full"/>
                        <AvatarFallback className="rounded-full text-xs">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <span className="text-xs sm:text-sm">{member.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {member.speciality}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 cursor-pointer" />
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