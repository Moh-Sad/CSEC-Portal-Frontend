'use client';

import SuperAdminCard from "@/components/pages/FAQs/roles/SuperAdminCard";
import PresidentCard from "@/components/pages/FAQs/roles/PresidentCard";
import DivisionHeadCard from "@/components/pages/FAQs/roles/DivisionHeadCard";
import MemberCard from "@/components/pages/FAQs/roles/MemberCard";
import MohammedCard from "@/components/pages/FAQs/contact/MohammedCard";
import MaheletCard from "@/components/pages/FAQs/contact/MaheletCard";
import HussienCard from "@/components/pages/FAQs/contact/HussienCard";
import { useRouter } from "next/navigation";

export default function FAQ() {
  const router = useRouter();
  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <>
      <div className="flex items-center justify-end p-4">
        <button
          className="mt-5 mr-5 h-10 w-20 rounded-[8px] bg-[#003087] text-white font-semibold flex items-center justify-center cursor-pointer hover:bg-[#003087]/80 transition-colors duration-300"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-center text-[#003087] mb-8">
          Roles
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SuperAdminCard />
          <PresidentCard />
          <DivisionHeadCard />
          <MemberCard />
        </div>

        <h1 className="text-4xl font-bold text-center text-[#003087] mb-8 mt-5">
          Contact Us
        </h1>
        <div className="flex justify-between">
          <MohammedCard />
          <MaheletCard />
          <HussienCard />
        </div>
      </div>
    </>
  );
}
