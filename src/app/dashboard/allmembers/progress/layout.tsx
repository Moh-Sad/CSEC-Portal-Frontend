import { ProfileHeader } from "@/components/pages/allmembers/AllMembersHeader";
import { ProfileSidebar } from "@/components/pages/allmembers/AllMembersSidebar";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="flex flex-col w-full h-full gap-3">
        <ProfileHeader />
        <div className="flex w-full">
          <div>
            <ProfileSidebar />
          </div>
          <div>
            {children}
          </div>
        </div>
      </div>
  );
}