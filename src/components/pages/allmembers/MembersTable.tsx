"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export interface Member {
  id: string;
  name: string;
  avatar?: string;
  attendance: "Active" | "Inactive" | "Needs Attention";
  year: string;
  status: "OnCampus" | "OffCampus" | "Withdrawn";
}

interface MembersTableProps {
  members: Member[];
  className?: string;
}

export function MembersTable({ members, className }: MembersTableProps) {
  const router = useRouter();
  return (
    <div className={cn("rounded-lg border overflow-hidden", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-500">Member Name</TableHead>
            <TableHead className="text-gray-500">Member ID</TableHead>
            <TableHead className="text-gray-500">Attendance</TableHead>
            <TableHead className="text-gray-500">Year</TableHead>
            <TableHead className="text-gray-500">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow
              key={member.id}
              className="cursor-pointer"
              onClick={() => {
                router.push(`/dashboard/allmembers/profile`);
              }}
            >
              <TableCell>
                <div className="flex items-center gap-3 p-1">
                  <Avatar>
                    <AvatarImage
                      src={
                        member.avatar || "/placeholder.svg?height=40&width=40"
                      }
                      alt={member.name}
                    />
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <span>{member.name}</span>
                </div>
              </TableCell>
              <TableCell>{member.id}</TableCell>
              <TableCell>
                <AttendanceBadge status={member.attendance} />
              </TableCell>
              <TableCell>{member.year}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    member.status === "OnCampus" ? "outline" : "secondary"
                  }
                  className={cn(
                    member.status === "OnCampus" &&
                      "text-green-500 bg-green-50",
                    member.status === "OffCampus" && "text-red-500 bg-red-50",
                    member.status === "Withdrawn" &&
                      "text-purple-500 bg-purple-100"
                  )}
                  style={{ padding: "5px" }}
                >
                  {member.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function AttendanceBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-normal",
        status === "Active" && "text-green-500 bg-green-50",
        status === "Inactive" && "text-red-500 bg-red-50",
        status === "Needs Attention" && "text-amber-500 bg-amber-50"
      )}
      style={{ padding: "5px" }}
    >
      {status}
    </Badge>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}
