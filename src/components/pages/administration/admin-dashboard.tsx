"use client"

import { useState } from "react"
import HeadsTable from "./heads-table"
import RolesTable from "./roles-table"
import RulesTable from "./rules-table"
import MembersPage from "./memebers"
import AddHeadModal from "./add-head-model"
import AddRoleModal from "./add-role-model"
import { Button } from "@/components/ui/button"
import { Filter, Crown, Settings, BookText, ArrowLeft } from "lucide-react"

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState<"dashboard" | "members">("dashboard")
  const [activeTab, setActiveTab] = useState<"heads" | "rules" | "roles">("heads")
  const [showAddHeadModal, setShowAddHeadModal] = useState(false)
  const [showAddRoleModal, setShowAddRoleModal] = useState(false)

  const handleMembersClick = () => setActiveView("members")
  const handleBackToRules = () => {
    setActiveView("dashboard")
    setActiveTab("rules")
  }

  return (
    <div className="min-h-screen p-4">
      {activeView === "dashboard" ? (
        <div className="max-w-full mx-auto rounded-lg shadow-sm overflow-hidden">
          <div className="flex justify-between items-center border-b">
            <div className="flex gap-2 p-2">
              <button
                onClick={() => setActiveTab("heads")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  activeTab === "heads" ? "bg-[#003081] text-white" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <Crown className="w-5 h-5" />
                <span>Heads</span>
              </button>

              <button
                onClick={() => setActiveTab("rules")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  activeTab === "rules" ? "bg-[#003081] text-white" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <BookText className="w-5 h-5" />
                <span>Rules</span>
              </button>

              <button
                onClick={() => setActiveTab("roles")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  activeTab === "roles" ? "bg-[#003081] text-white" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Roles</span>
              </button>
            </div>
            
            <div className="flex gap-2 pr-4">
              {activeTab === "heads" && (
                <Button
                  className="bg-[#003081] hover:bg-[#003081]/90 text-white rounded-lg px-4 py-2 text-sm flex items-center gap-2"
                  onClick={() => setShowAddHeadModal(true)}
                >
                  <span className="text-lg">+</span>
                  Add Head
                </Button>
              )}
              {activeTab === "roles" && (
                <Button
                  className="bg-[#003081] hover:bg-[#003081]/90 text-white rounded-lg px-4 py-2 text-sm flex items-center gap-2"
                  onClick={() => setShowAddRoleModal(true)}
                >
                  <span className="text-lg">+</span>
                  Add Role
                </Button>
              )}
              <Button
                variant="outline"
                className="border border-gray-300 text-gray-700 rounded-lg px-4 py-2 text-sm flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>
          </div>

          <div className="p-4">
            {activeTab === "heads" && <HeadsTable />}
            {activeTab === "roles" && <RolesTable />}
            {activeTab === "rules" && <RulesTable />}
          </div>
        </div>
      ) : (
        <div className="max-w-full mx-auto">
          <Button
            variant="ghost"
            className="mb-4 flex items-center gap-2"
            onClick={handleBackToRules}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Rules
          </Button>
         
          <MembersPage />
          
          
        </div>
      )}

      {showAddHeadModal && <AddHeadModal onClose={() => setShowAddHeadModal(false)} />}
      {showAddRoleModal && <AddRoleModal onClose={() => setShowAddRoleModal(false)} />}
    </div>
  )
}