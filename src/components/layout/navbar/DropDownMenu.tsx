"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import DownArrow from "@/components/icons/images/DownArrow.png";
import Img from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DropDownMenu() {
  const router = useRouter();
  const [fullName, setFullName] = useState("Loading...");
  const [role, setRole] = useState("User");
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [avatarFallback, setAvatarFallback] = useState("");

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        const fname = user?.personal_info?.first_name || "Guest";
        const lname = user?.personal_info?.last_name || "";
        const roleFromUser = user?.personal_info?.specialization || "NaN";
        const profilePic = user?.personal_info?.profile_picture;

        setFullName(`${fname} ${lname}`);
        setRole(roleFromUser.charAt(0).toUpperCase() + roleFromUser.slice(1));
        
        if (profilePic) {
          setAvatarSrc(profilePic);
        } else {
          const firstInitial = fname.charAt(0).toUpperCase();
          const lastInitial = lname.charAt(0).toUpperCase();
          setAvatarFallback(`${firstInitial}${lastInitial}`);
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
      }
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken"); 
    localStorage.removeItem("user"); 
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex w-fit h-12 border border-gray-300 rounded-[8px] dark:bg-gray-800 cursor-pointer">
          <div className="flex w-full px-2 gap-2 items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={avatarSrc || undefined} />
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>

              <div className="hidden md:flex flex-col items-start justify-center">
                <h1 className="font-bold text-sm">{fullName}</h1>
                <h3 className="text-gray-600 text-xs">{role}</h3>
              </div>
            </div>

            <div className="hidden md:block">
              <Img src={DownArrow} alt="down arrow" width={20} height={20} />
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto mr-2">
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup>
          <DropdownMenuRadioItem value="top">
            <div className="flex gap-2 justify-center" onClick={() => router.push("/dashboard/profile")}>
              <FaRegUser />
              <div>My Profile</div>
            </div>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom">
            <div className="flex gap-2" onClick={handleLogout}>
              <ImExit color="red" />
              <div>Logout</div>
            </div>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
