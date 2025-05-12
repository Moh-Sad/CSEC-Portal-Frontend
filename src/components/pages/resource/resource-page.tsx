"use client"

import { useState, useEffect } from "react"
import Cookies from "js-cookie"
import { Button } from "@/components/ui/button"
import { Plus, ChevronDown, ChevronUp, FileText, ExternalLink } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import api from "@/lib/axios"
import AddResourceModal from "./add-resource-model"

export interface Resource {
  _id: string
  name: string
  link: string
  division: string
  divisionID?: string
}

interface Division {
  _id: string
  name: string
  description?: string
}

const currentUserRole = Cookies.get("role");

export default function ResourcePage() {
  const [showAddResourceModal, setShowAddResourceModal] = useState(false)
  const [currentDivision, setCurrentDivision] = useState<string>("")
  const [expandedStates, setExpandedStates] = useState<Record<string, boolean>>({})
  const { toast } = useToast()
  const [token, setToken] = useState<string | null>(null)
  const [divisions, setDivisions] = useState<Division[]>([])
  const [resources, setResources] = useState<Record<string, Resource[]>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const match = document.cookie.match(/accessToken=([^;]+)/)
    setToken(match?.[1] || null)
  }, [])

  const fetchDivisions = async () => {
    if (!token) return
  
    try {
      const response = await api.get('/division', {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      })

      const divisionsData = response.data.data.map((div: any) => ({
        _id: div._id,
        name: div.name,
        description: `Useful resources and progress sheet for the ${div.name} division.`
      }))

      setDivisions(divisionsData)
      
      const initialExpandedStates: Record<string, boolean> = {}
      divisionsData.forEach((div: Division) => {
        initialExpandedStates[div._id] = div._id === divisionsData[0]?._id
      })
      setExpandedStates(initialExpandedStates)
      setCurrentDivision(divisionsData[0]?._id || "")
    } catch (error) {
      console.error("Error fetching divisions:", error)
      toast({
        title: "Error",
        description: "Failed to fetch divisions",
        variant: "destructive",
        id: ""
      })
    }
  }

  const fetchResources = async () => {
    if (!token || divisions.length === 0) return
  
    setIsLoading(true)
    try {
      const response = await api.get(`/resource`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      })

      const newResources: Record<string, Resource[]> = {}
      divisions.forEach(div => {
        newResources[div._id] = []
      })

      response.data.forEach((resource: any) => {
        if (!resource.division) {
          console.warn("Resource missing division:", resource)
          return
        }

        const divisionId = resource.division._id
        if (newResources[divisionId]) {
          newResources[divisionId].push({
            _id: resource._id,
            name: resource.name,
            link: resource.link,
            division: divisionId,
            divisionID: divisionId,
          })
        }
      })
  
      setResources(newResources)
    } catch (error) {
      console.error("Error fetching resources:", error)
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
    if (token) {
      fetchDivisions()
    }
  }, [token])

  useEffect(() => {
    if (divisions.length > 0) {
      fetchResources()
    }
  }, [divisions])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[75vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003087]"></div>
      </div>
    )
  }

  const toggleExpanded = (divisionId: string) => {
    setExpandedStates(prev => ({
      ...prev,
      [divisionId]: !prev[divisionId],
    }))
  }

  const handleAddSuccess = async (newResource: Omit<Resource, "_id">) => {
    if (!token) return

    const divisionId = newResource.division
    const tempId = `temp-${Date.now()}`
    const optimisticResource: Resource = {
      _id: tempId,
      name: newResource.name,
      link: newResource.link,
      division: divisionId,
      divisionID: divisionId,
    }

    setResources(prev => ({
      ...prev,
      [divisionId]: [...(prev[divisionId] || []), optimisticResource],
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
        [divisionId]: (prev[divisionId] || []).map(res =>
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
        [divisionId]: (prev[divisionId] || []).filter(res => res._id !== tempId),
      }))

      toast({
        title: "Error",
        description: "Failed to add resource",
        variant: "destructive",
        id: ""
      })
    }
  }

  const renderDivisionSection = (division: Division, showAddButton = false) => {
    const divisionResources = resources[division._id] || []
    const isExpanded = expandedStates[division._id] || false

    return (
      <>
        <div className="flex justify-end gap-2">
          {currentUserRole !== "member" && showAddButton && (
            <Button
              variant="none"
              size="sm"
              className="mb-4 p-1 h-10 bg-[#003087] text-white rounded-[8px] hover:bg-[#003087]/50"
              onClick={() => {
                setCurrentDivision(division._id)
                setShowAddResourceModal(true)
              }}
            >
              <Plus /> Add Resource
            </Button>
          )}
        </div>
        <div className="rounded-md overflow-hidden border border-gray-200 mb-4">
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-medium">{division.name}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {division.description || `Useful resources for the ${division.name} division`}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100">
            <div
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100"
              onClick={() => toggleExpanded(division._id)}
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
                    No resources found
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
      </>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-full mx-auto">
        <div className="space-y-4">
          {divisions.length > 0 ? (
            <>
              {renderDivisionSection(divisions[0], true)}
              {divisions.slice(1).map((division) => (
                <div key={division._id}>
                  {renderDivisionSection(division)}
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-8">
              No divisions found
            </div>
          )}
        </div>
      </div>

      {divisions.length > 0 && (
        <AddResourceModal
          open={showAddResourceModal}
          onClose={() => setShowAddResourceModal(false)}
          onAddSuccess={handleAddSuccess}
          division={currentDivision}
          divisions={divisions.map(div => ({
            id: div._id,
            name: div.name,
          }))}
        />
      )}
    </div>
  )
}