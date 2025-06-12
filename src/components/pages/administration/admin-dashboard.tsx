"use client";

import { useState } from "react";
import HeadsTable from "./heads-table";
import RolesTable from "./roles-table";
import RulesTable from "./rules-table";
import AddHeadModal from "../administration/add-head-model";
import { Button } from "@/components/ui/button";
import {
  Filter,
  Crown,
  Settings,
  BookText,
  ArrowLeft,
  Menu,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState<"dashboard" | "members">(
    "dashboard"
  );
  const [activeTab, setActiveTab] = useState<"heads" | "rules" | "roles">(
    "heads"
  );
  const [showAddHeadModal, setShowAddHeadModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleBackToRules = () => {
    setActiveView("dashboard");
    setActiveTab("rules");
  };

  const handleHeadAdded = () => {
    setRefreshKey((prev) => prev + 1);
    setShowAddHeadModal(false);
  };

  return (
    <div className="min-h-screen p-2 md:p-4">
      {activeView === "dashboard" ? (
        <div className="max-w-full mx-auto rounded-lg shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b">
            {/* Desktop tabs */}
            <div className="hidden md:flex gap-2 p-2">
              <button
                onClick={() => setActiveTab("heads")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  activeTab === "heads"
                    ? "bg-[#003081] text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <Crown className="w-5 h-5" />
                <span>Heads</span>
              </button>

              <button
                onClick={() => setActiveTab("rules")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  activeTab === "rules"
                    ? "bg-[#003081] text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <BookText className="w-5 h-5" />
                <span>Rules</span>
              </button>

              <button
                onClick={() => setActiveTab("roles")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  activeTab === "roles"
                    ? "bg-[#003081] text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Roles</span>
              </button>
            </div>

            <div className="flex gap-2 p-2 w-full md:w-auto justify-between">
              {/* Mobile menu button */}
              <div className="md:hidden w-fit p-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="none"
                      className="w-full justify-start gap-2 cursor-pointer"
                    >
                      <Menu className="w-8 h-8" />
                      {activeTab === "heads" && "Heads"}
                      {activeTab === "rules" && "Rules"}
                      {activeTab === "roles" && "Roles"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-fit">
                    <DropdownMenuItem onClick={() => setActiveTab("heads")}>
                      <Crown className="w-8 h-8 mr-2" />
                      <span>Heads</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("rules")}>
                      <BookText className="w-4 h-4 mr-2" />
                      <span>Rules</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("roles")}>
                      <Settings className="w-4 h-4 mr-2" />
                      <span>Roles</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {activeTab === "heads" && (
                <Button
                  className="bg-[#003087] hover:bg-[#003081]/50 text-white rounded-[10px] px-2 py-1 cursor-pointer md:px-4 md:py-2 text-sm flex items-center gap-1 md:gap-2"
                  onClick={() => setShowAddHeadModal(true)}
                >
                  <span className="text-sm md:text-lg">+</span>
                  <span className="sm:inline">Add Head</span>
                </Button>
              )}
            </div>
          </div>

          <div className="p-2 md:p-4 overflow-x-auto">
            {activeTab === "heads" && <HeadsTable key={refreshKey} />}
            {activeTab === "roles" && <RolesTable />}
            {activeTab === "rules" && <RulesTable />}
          </div>
        </div>
      ) : (
        <div className="max-w-full mx-auto">
          <Button
            variant="ghost"
            className="mb-2 md:mb-4 flex items-center gap-2"
            onClick={handleBackToRules}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Rules</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>
      )}

      {showAddHeadModal && (
        <AddHeadModal
          onClose={() => setShowAddHeadModal(false)}
          onHeadAdded={handleHeadAdded}
        />
      )}
    </div>
  );
}
