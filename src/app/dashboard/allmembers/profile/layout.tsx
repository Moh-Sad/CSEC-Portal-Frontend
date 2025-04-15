import { ProfileHeader } from "@/components/pages/allmembers/profiles/ProfileHeader";
import { ProfileSidebar } from "@/components/pages/allmembers/profiles/ProfileSidebar";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col w-full h-full gap-3">
        <ProfileHeader />
        <div className="flex">
          <div>
            <ProfileSidebar />
          </div>
          <div>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
