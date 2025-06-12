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
    <div className="flex flex-row md:flex-col items-center justify-between gap-1 w-auto md:w-55 border-2 border-gray-300 rounded-[8px] md:mr-5 mt-5 overflow-x-auto mx-1 md:mx-0">
      <Button
        onClick={() => router.push(getRouteWithId("/dashboard/allmembers/profile"))}
        className={cn(
          "h-10 min-w-fit w-20 md:w-full justify-center md:justify-start rounded-l-[8px] md:rounded-t-[8px] md:rounded-b-none cursor-pointer",
          pathname === "/dashboard/allmembers/profile" ? "bg-[#003081] text-white" : "bg-none"
        )}
        style={{ padding: "15px" }}
      >
        <User className="mr-2 h-4 w-4 font-semibold" />
        <span className="hidden md:block whitespace-nowrap">Profile</span>
      </Button>
      
      <Button
        onClick={() => router.push(getRouteWithId("/dashboard/allmembers/attendance"))}
        className={cn(
          "h-10 min-w-fit w-20 md:w-full justify-center md:justify-start rounded-none cursor-pointer",
          pathname === "/dashboard/allmembers/attendance" ? "bg-[#003081] text-white" : "bg-none"
        )}
        style={{ padding: "15px" }}
      >
        <Clock className="mr-2 h-4 w-4" />
        <span className="hidden md:block whitespace-nowrap">Attendance</span>
      </Button>
      
      <Button
        onClick={() => router.push(getRouteWithId("/dashboard/allmembers/progress"))}
        className={cn(
          "h-10 min-w-fit w-20 md:w-full justify-center md:justify-start rounded-none cursor-pointer",
          pathname === "/dashboard/allmembers/progress" ? "bg-[#003081] text-white" : "bg-none"
        )}
        style={{ padding: "15px" }}
      >
        <BarChart className="mr-2 h-4 w-4" />
        <span className="hidden md:block whitespace-nowrap">Progress</span>
      </Button>
      
      <Button
        onClick={() => router.push(getRouteWithId("/dashboard/allmembers/headsup"))}
        className={cn(
          "h-10 min-w-fit w-20 md:w-full justify-center md:justify-start rounded-r-[8px] md:rounded-b-[8px] md:rounded-t-none cursor-pointer",
          pathname === "/dashboard/allmembers/headsup" ? "bg-[#003081] text-white" : "bg-none"
        )}
        style={{ padding: "15px" }}
      >
        <LinkIcon className="mr-2 h-4 w-4" />
        <span className="hidden md:block whitespace-nowrap">Heads up!</span>
      </Button>
    </div>
  );
}