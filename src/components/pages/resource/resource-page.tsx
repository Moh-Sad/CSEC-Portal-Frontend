"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, ChevronDown, ChevronUp, FileText, Edit } from "lucide-react"
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
  isLocal?: boolean
}

const DIVISION_MAP: Record<DivisionType, { id: string; name: string; description: string }> = {
  cpd: {
    id: "680a9a2b9e86262d7c618bd1",
    name: "CPD",
    description: "Useful resources and progress sheet for the CPD division."
  },
  dev: {
    id: "680a9a2c9e86262d7c618bd4",
    name: "DEV",
    description: "Useful resources and progress sheet for the Dev division."
  },
  cyber: {
    id: "680a9a2d9e86262d7c618bd7", 
    name: "CYBER",
    description: "Useful resources and progress sheet for the Cyber division."
  },
  data_science: {
    id: "680a9a2e9e86262d7c618bda",
    name: "DATA SCIENCE",
    description: "Useful resources and progress sheet for the Data Science division."
  }
}

export default function ResourcePage() {
  const [showAddResourceModal, setShowAddResourceModal] = useState(false)
  const [currentDivision, setCurrentDivision] = useState<DivisionType>("cpd")
  const [expandedStates, setExpandedStates] = useState({
    cpd: true,
    dev: false,
    cyber: false,
    data_science: false
  })
  const { toast } = useToast()

  const [resources, setResources] = useState<Record<DivisionType, Resource[]>>({
    cpd: [],
    dev: [],
    cyber: [],
    data_science: []
  })
  const [isLoading, setIsLoading] = useState(false)

  const fetchResources = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/resource')
      const allResources = response.data.map((resource: any) => ({
        _id: resource._id,
        name: resource.name,
        link: resource.link,
        division: Object.keys(DIVISION_MAP).find(
          key => DIVISION_MAP[key as DivisionType].id === resource.division._id
        ) as DivisionType,
        divisionID: resource.division._id
      }))
      
      setResources({
        cpd: allResources.filter((r: { division: string }) => r.division === 'cpd'),
        dev: allResources.filter((r: { division: string }) => r.division === 'dev'),
        cyber: allResources.filter((r: { division: string }) => r.division === 'cyber'),
        data_science: allResources.filter((r: { division: string }) => r.division === 'data_science')
      })
    } catch (error) {
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
  }, [])

  const toggleExpanded = (division: DivisionType) => {
    setExpandedStates(prev => ({
      ...prev,
      [division]: !prev[division]
    }))
  }

  const handleAddSuccess = async (newResource: Omit<Resource, '_id'>) => {
    const division = newResource.division
    const divisionId = DIVISION_MAP[division].id
    
    try {
      const response = await api.post('/resource', {
        name: newResource.name,
        link: newResource.link,
        division: divisionId
      })

      const createdResource: Resource = {
        ...newResource,
        _id: response.data._id,
        divisionID: divisionId
      }

      setResources(prev => ({
        ...prev,
        [division]: [...prev[division], createdResource]
      }))
      
      toast({
        title: "Success",
        description: "Resource added successfully",
        id: ""
      })
      
      setShowAddResourceModal(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add resource",
        variant: "destructive",
        id: ""
      })
    }
  }

  const renderDivisionSection = (division: DivisionType, showAddButton: boolean = false) => {
    const divisionData = DIVISION_MAP[division]
    const divisionResources = resources[division]
    const isExpanded = expandedStates[division]

    return (
      <div key={division} className="rounded-md shadow-sm overflow-hidden border border-gray-200">
        <div className="p-4 bg-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-medium text-gray-900">{divisionData.name}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {divisionData.description}
              </p>
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

        <div className="border-t border-gray-100 bg-gray-50">
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
            <div className="border-t border-gray-200 bg-white">
              {divisionResources.length === 0 && !isLoading ? (
                <div className="p-4 text-sm text-gray-500">No resources found</div>
              ) : (
                divisionResources.map((resource) => (
                  <div key={resource._id} className="flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
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
                      <Edit className="w-4 h-4" />
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
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-4xl mx-auto">
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
          name: value.name
        }))}
      />
    </div>
  )
}