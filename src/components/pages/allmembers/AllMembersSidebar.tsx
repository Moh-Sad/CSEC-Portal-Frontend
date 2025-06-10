'use client'

import { Button } from "@/components/ui/button";
import { User, Clock, BarChart, LinkIcon } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function ProfileSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  const getRouteWithId = (basePath: string) => {
    return id ? `${basePath}?id=${id}` : basePath;
  };

  return (
    <div className="flex flex-col items-center gap-2 w-55 border-2 border-gray-300 rounded-[8px] mr-5 mt-5">
      <Button
        onClick={() => router.push(getRouteWithId("/dashboard/allmembers/profile"))}
        className={cn(
          "h-10 w-full justify-start rounded-t-[8px]",
          pathname === "/dashboard/allmembers/profile" ? "bg-[#003081] text-white" : "bg-none"
        )}
        style={{ padding: "15px", paddingLeft: "20px" }}
      >
        <User className="mr-2 h-4 w-4 font-semibold" />
        Profile
      </Button>
      <Button
        onClick={() => router.push(getRouteWithId("/dashboard/allmembers/attendance"))}
        className={cn(
          "h-10 w-full justify-start rounded-[8px]",
          pathname === "/dashboard/allmembers/attendance" ? "bg-[#003081] text-white" : "bg-none"
        )}
        style={{ padding: "15px", paddingLeft: "20px" }}
      >
        <Clock className="mr-2 h-4 w-4" />
        Attendance
      </Button>
      <Button
        onClick={() => router.push(getRouteWithId("/dashboard/allmembers/progress"))}
        className={cn(
          "h-10 w-full justify-start rounded-[8px]",
          pathname === "/dashboard/allmembers/progress" ? "bg-[#003081] text-white" : "bg-none"
        )}
        style={{ padding: "15px", paddingLeft: "20px" }}
      >
        <BarChart className="mr-2 h-4 w-4" />
        Progress
      </Button>
      <Button
        onClick={() => router.push(getRouteWithId("/dashboard/allmembers/headsup"))}
        className={cn(
          "h-10 w-full justify-start rounded-b-[8px]",
          pathname === "/dashboard/allmembers/headsup" ? "bg-[#003081] text-white" : "bg-none"
        )}
        style={{ padding: "15px", paddingLeft: "20px" }}
      >
        <LinkIcon className="mr-2 h-4 w-4" />
        Heads up!
      </Button>
    </div>
  );
}