import { ProfileHeader } from "@/components/pages/allmembers/AllMembersHeader";
import { ProfileSidebar } from "@/components/pages/allmembers/AllMembersSidebar";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="flex flex-col w-full h-full gap-5 md:ml-2">
        <ProfileHeader />
        <div className="flex flex-col md:flex-row w-full">
          <div className="md:w-auto">
            <ProfileSidebar />
          </div>
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
  );
}