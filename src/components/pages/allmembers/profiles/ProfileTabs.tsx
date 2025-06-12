"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequiredInformation } from "@/components/pages/allmembers/profiles/RequiredInformation";
import { OptionalInformation } from "@/components/pages/allmembers/profiles/OptionalInformation";
import { Resources } from "@/components/pages/allmembers/profiles/ProfileResources";
import { FileText, User, BookOpen } from "lucide-react";

export function ProfileTabs() {
  const [activeTab, setActiveTab] = useState("required");

  return (
        <Tabs
          defaultValue="required"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full py-2"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="required" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 w-full p-1 md:p-2">
              <FileText className="h-4 w-4 md:h-5 md:w-5"/>
              <span className="text-xs md:text-base">Required</span>
            </TabsTrigger>
            <TabsTrigger value="optional" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 w-full p-1 md:p-2">
              <User className="h-4 w-4 md:h-5 md:w-5"/>
              <span className="text-xs md:text-base">Optional</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 w-full p-1 md:p-2">
              <BookOpen className="h-4 w-4 md:h-5 md:w-5"/>
              <span className="text-xs md:text-base">Resources</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="required">
            <RequiredInformation />
          </TabsContent>
          <TabsContent value="optional">
            <OptionalInformation />
          </TabsContent>
          <TabsContent value="resources">
            <Resources />
          </TabsContent>
        </Tabs>
  );
}