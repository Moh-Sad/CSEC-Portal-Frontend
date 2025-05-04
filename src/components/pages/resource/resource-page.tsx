"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, ChevronDown, ChevronUp, FileText, ExternalLink } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import api from "@/lib/axios"
import AddResourceModal from "./add-resource-model"

export type DivisionType = "cpd" | "dev" | "cyber" | "data_science"

export interface Resource {
  _id: string
  name: string
  link: string
  division: DivisionType
  divisionID?: string
}

const DIVISION_MAP: Record<DivisionType, { id: string; name: string; description: string }> = {
  cpd: {
    id: "680a9a2b9e86262d7c618bd1",
    name: "CPD",
    description: "Useful resources and progress sheet for the CPD division.",
  },
  dev: {
    id: "680a9a2c9e86262d7c618bd4",
    name: "DEV",
    description: "Useful resources and progress sheet for the Dev division.",
  },
  cyber: {
    id: "680a9a2d9e86262d7c618bd7",
    name: "CYBER",
    description: "Useful resources and progress sheet for the Cyber division.",
  },
  data_science: {
    id: "680a9a2e9e86262d7c618bda",
    name: "DATA SCIENCE",
    description: "Useful resources and progress sheet for the Data Science division.",
  },
}

export default function ResourcePage() {
  const [showAddResourceModal, setShowAddResourceModal] = useState(false)
  const [currentDivision, setCurrentDivision] = useState<DivisionType>("cpd")
  const [expandedStates, setExpandedStates] = useState({
    cpd: true,
    dev: false,
    cyber: false,
    data_science: false,
  })
  const { toast } = useToast()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const match = document.cookie.match(/accessToken=([^;]+)/)
    setToken(match?.[1] || null)
  }, [])

  const [resources, setResources] = useState<Record<DivisionType, Resource[]>>({
    cpd: [],
    dev: [],
    cyber: [],
    data_science: [],
  })
  const [isLoading, setIsLoading] = useState(false)

  const fetchResources = async () => {
    if (!token) return
  
    setIsLoading(true)
    try {
      const response = await api.get(`/resource`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      })

      // Create a reverse mapping of division IDs to DivisionType
      const divisionIdToType: Record<string, DivisionType> = {};
      Object.entries(DIVISION_MAP).forEach(([type, data]) => {
        divisionIdToType[data.id] = type as DivisionType;
      });

      const allResources: Resource[] = response.data.map((resource: any) => {
        const divisionType = divisionIdToType[resource.division._id];
        
        if (!divisionType) {
          console.warn(`Unknown division ID: ${resource.division._id}`);
          return null;
        }

        return {
          _id: resource._id,
          name: resource.name,
          link: resource.link,
          division: divisionType,
          divisionID: resource.division._id,
        }
      }).filter(Boolean) as Resource[]; // Filter out any null values

      // Initialize the resources object with empty arrays for each division
      const newResources = {
        cpd: [],
        dev: [],
        cyber: [],
        data_science: [],
      } as Record<DivisionType, Resource[]>
  
      // Populate the resources
      allResources.forEach(resource => {
        newResources[resource.division].push(resource)
      })
  
      setResources(newResources)
    } catch (error) {
      console.error("Error fetching resources:", error);
      toast({
        title: "Error",
        description: "Failed to fetch resources",
        variant: "destructive",
        id: ""
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchResources()
  }, [token])

  const toggleExpanded = (division: DivisionType) => {
    setExpandedStates((prev) => ({
      ...prev,
      [division]: !prev[division],
    }))
  }

  const handleAddSuccess = async (newResource: Omit<Resource, "_id">) => {
    if (!token) return

    const division = newResource.division
    const divisionId = DIVISION_MAP[division].id

    const tempId = `temp-${Date.now()}`
    const optimisticResource: Resource = {
      _id: tempId,
      name: newResource.name,
      link: newResource.link,
      division: division,
      divisionID: divisionId,
    }

    setResources(prev => ({
      ...prev,
      [division]: [...prev[division], optimisticResource],
    }))

    try {
      const response = await api.post("/resource", {
        name: newResource.name,
        link: newResource.link,
        division: divisionId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      })

      setResources(prev => ({
        ...prev,
        [division]: prev[division].map(res =>
          res._id === tempId
            ? { ...res, _id: response.data._id }
            : res
        ),
      }))

      toast({
        title: "Success",
        description: "Resource added successfully",
        id: ""
      })

      setShowAddResourceModal(false)
    } catch (error) {
      setResources(prev => ({
        ...prev,
        [division]: prev[division].filter(res => res._id !== tempId),
      }))

      toast({
        title: "Error",
        description: "Failed to add resource",
        variant: "destructive",
        id: ""
      })
    }
  }

  const renderDivisionSection = (division: DivisionType, showAddButton = false) => {
    const divisionData = DIVISION_MAP[division]
    const divisionResources = resources[division]
    const isExpanded = expandedStates[division]

    return (
      <div key={division} className="rounded-md overflow-hidden border border-gray-200 mb-4">
        <div className="p-4 ">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-medium ">{divisionData.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{divisionData.description}</p>
            </div>
            {showAddButton && (
              <Button
                className="h-10 px-6 rounded-[8px] bg-[#003081] hover:bg-[#002a6e] text-white flex items-center gap-1.5"
                onClick={() => {
                  setCurrentDivision(division)
                  setShowAddResourceModal(true)
                }}
              >
                <Plus className="w-4 h-4" />
                Add Resource
              </Button>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 ">
          <div
            className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100"
            onClick={() => toggleExpanded(division)}
          >
            <h3 className="font-medium text-sm">Resources ({divisionResources.length})</h3>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>

          {isExpanded && (
            <div className="border-t border-gray-200">
              {divisionResources.length === 0 ? (
                <div className="p-4 text-sm text-gray-500">
                  {isLoading ? "Loading..." : "No resources found"}
                </div>
              ) : (
                divisionResources.map((resource) => (
                  <div
                    key={resource._id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{resource.name}</span>
                    </div>
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-full mx-auto">
        <div className="space-y-4">
          {renderDivisionSection("cpd", true)}
          {renderDivisionSection("dev")}
          {renderDivisionSection("cyber")}
          {renderDivisionSection("data_science")}
        </div>
      </div>

      <AddResourceModal
        open={showAddResourceModal}
        onClose={() => setShowAddResourceModal(false)}
        onAddSuccess={handleAddSuccess}
        division={currentDivision}
        divisions={Object.entries(DIVISION_MAP).map(([key, value]) => ({
          id: key as DivisionType,
          name: value.name,
        }))}
      />
    </div>
  )
}