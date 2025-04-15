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
      <div className="flex-1">
        <Tabs
          defaultValue="required"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-180 py-2"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="required" className="flex items-start gap-2">
              <FileText className="h-5 w-5 my-2"/>
              <span className="p-1">Required Information</span>
            </TabsTrigger>
            <TabsTrigger value="optional" className="flex items-start gap-2">
              <User className="h-5 w-5 my-2"/>
              <span className="p-1">Optional Information</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-start gap-2">
              <BookOpen className="h-5 w-5 my-2"/>
              <span className="p-1">Resources</span>
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
      </div>
  );
}
