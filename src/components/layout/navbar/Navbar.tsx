"use client";

import Image from "next/image";
import ShakeHand from "@/components/icons/images/ShakeHand.png";
import { Input } from "@/components/ui/input";
import { LuSearch } from "react-icons/lu";
import { GoBell } from "react-icons/go";
import DropDownMenu from "./DropDownMenu";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaAngleRight } from "react-icons/fa6";
import api from "@/lib/axios";
import Cookies from "js-cookie";

interface NavbarProps {
  time?: string;
}

export default function Navbar({ time }: NavbarProps) {
  const [fname, setFname] = useState("Guest");
  const [memberDisplayName, setMemberDisplayName] = useState<string | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        const firstName = user?.personal_info?.first_name || "Guest";
        setFname(firstName);
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
      }
    }
  }, []);

  useEffect(() => {
    if (pathname.startsWith("/dashboard/allmembers/profile")) {
      const userId = searchParams.get("id");
      if (userId) {
        const loadUserProfile = async () => {
          try {
            const token = Cookies.get("accessToken");
            if (!token) return;

            const response = await api.get(`user/${userId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "ngrok-skip-browser-warning": "true",
              },
              withCredentials: false,
            });

            const userData = response.data?.user;
            if (userData?.personal_info) {
              const firstName = userData.personal_info.first_name || "";
              const lastName = userData.personal_info.last_name || "";
              const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
              if (fullName) setMemberDisplayName(fullName);
            }
          } catch (error) {
            console.log("Failed to fetch user data:", error);
          }
        };

        loadUserProfile();
      }
    }
  }, [pathname, searchParams]);

  const getTimeOfDay = () => {
    if (time) return time;
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  const handleBreadcrumbClick = (path: string, isRoot: boolean = false) => {
    // Preserve all existing query parameters
    const queryString = searchParams.toString();
    const queryPrefix = queryString ? `?${queryString}` : '';

    if (isRoot) {
      // Navigate to the root path of the current section with preserved query params
      const rootPath = path.split('/').slice(0, 3).join('/');
      router.push(`${rootPath}${queryPrefix}`);
    } else {
      // For non-root breadcrumbs, go back to the parent path with preserved query params
      const parentPath = path.split('/').slice(0, -1).join('/') || '/';
      router.push(`${parentPath}${queryPrefix}`);
    }
  };

  const renderBreadcrumbs = (
    baseTitle: string,
    baseSubtitle: string,
    subPath: string
  ) => {
    const pathSegments = subPath.split("/").filter(Boolean);

    if (pathSegments.length === 0) {
      return (
        <>
          <h1 className="text-lg font-semibold">{baseTitle}</h1>
          <h3 
            className="text-sm text-gray-600 hover:text-gray-800 hover:cursor-pointer" 
            onClick={() => handleBreadcrumbClick(pathname, true)}
          >
            {baseSubtitle}
          </h3>
        </>
      );
    }

    return (
      <>
        <h1 className="text-lg font-semibold">{baseTitle}</h1>
        <div className="flex gap-2 items-center">
          <h3 
            className="text-sm text-gray-600 hover:text-gray-800 hover:cursor-pointer" 
            onClick={() => handleBreadcrumbClick(pathname, true)}
          >
            {baseSubtitle}
          </h3>
          {pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            return (
              <div key={index} className="flex items-center gap-2">
                <FaAngleRight color="gray" size={13} className="mt-1" />
                <h3 
                  className={`text-sm text-gray-600 capitalize ${!isLast ? 'hover:text-gray-800 hover:cursor-pointer' : ''}`}
                  onClick={!isLast ? () => handleBreadcrumbClick(pathname) : undefined}
                >
                  {segment.replace(/-/g, " ")}
                </h3>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const getGreeting = () => {
    if (pathname.startsWith("/dashboard/allmembers")) {
      const subPath = pathname
        .replace("/dashboard/allmembers", "")
        .replace(/^\//, "");
      if (subPath === "profile" && memberDisplayName) {
        return (
          <>
            <h1 className="text-lg font-semibold">All Members</h1>
            <div className="flex gap-2">
              <h3 
                className="text-sm text-gray-600 hover:text-gray-800 hover:cursor-pointer"
                onClick={() => router.push(`/dashboard/allmembers?${searchParams.toString()}`)}
              >
                All Members Information
              </h3>
              <FaAngleRight color="gray" size={13} className="mt-1" />
              <h3 className="text-sm text-gray-600">{memberDisplayName}</h3>
            </div>
          </>
        );
      }
      return renderBreadcrumbs(
        "All Members",
        "All Members Information",
        subPath
      );
    } else if (pathname.startsWith("/dashboard/alldivisions")) {
      const subPath = pathname
        .replace("/dashboard/alldivisions", "")
        .replace(/^\//, "");
      return renderBreadcrumbs(
        "All Divisions",
        "All Divisions Information",
        subPath
      );
    } else if (pathname.startsWith("/dashboard/attendance")) {
      const subPath = pathname
        .replace("/dashboard/attendance", "")
        .replace(/^\//, "");
      return renderBreadcrumbs("Attendance", "All Attendance", subPath);
    } else if (pathname.startsWith("/dashboard/session-and-event")) {
      const subPath = pathname
        .replace("/dashboard/session-and-event", "")
        .replace(/^\//, "");
      return renderBreadcrumbs("Sessions & Events", "All Sessions", "Sessions and Events");
    } else if (pathname.startsWith("/dashboard/resources")) {
      const subPath = pathname
        .replace("/dashboard/resources", "")
        .replace(/^\//, "");
      return renderBreadcrumbs("Resources", "All Resources", subPath);
    } else if (pathname.startsWith("/dashboard/profile")) {
      const subPath = pathname
        .replace("/dashboard/profile", "")
        .replace(/^\//, "");
      return renderBreadcrumbs("Profile", "Your Profile", subPath);
    } else if (pathname.startsWith("/dashboard/administration")) {
      const subPath = pathname
        .replace("/dashboard/administration", "")
        .replace(/^\//, "");
      return renderBreadcrumbs("Administration", "Administration", subPath);
    } else if (pathname.startsWith("/dashboard/settings")) {
      const subPath = pathname
        .replace("/dashboard/settings", "")
        .replace(/^\//, "");
      return renderBreadcrumbs("Settings", "All Settings", subPath);
    } else {
      return (
        <>
          <div className="flex gap-1">
            <h1 className="text-lg font-semibold">Hello {fname}</h1>
            <Image
              src={ShakeHand}
              alt="Handshake icon"
              width={25}
              height={25}
            />
          </div>
          <h3 className="text-sm text-gray-600">Good {getTimeOfDay()}</h3>
        </>
      );
    }
  };

  return (
    <div className="flex md:flex-row h-auto md:h-20 w-full mr-3 justify-between items-start md:items-center p-2 gap-2">
      <div className="pl-1 w-full md:w-auto">
        <div className="flex flex-col md:flex-row gap-2 md:gap-3">
          <div>{getGreeting()}</div>
        </div>
      </div>
  
      <div className="flex gap-3 w-full md:w-auto justify-end md:justify-center items-center">
        <DropDownMenu />
      </div>
    </div>
  );
}