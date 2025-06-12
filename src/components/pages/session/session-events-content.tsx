"use client"

import { useState, useEffect } from "react"
import { List, Table2 } from "lucide-react"
import { MdAddCircleOutline } from "react-icons/md";
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import EventList from "@/components/pages/session/eventlist"
import EventTable from "@/components/pages/session/EventTable"
import SessionList from "@/components/pages/session/session-list"
import SessionTable from "@/components/pages/session/sessiontable"
import AddEventForm from "@/components/pages/session/add-event-dialog"
import AddSessionForm from "@/components/pages/session/add-session-dialog"
import api from "@/lib/axios"
import Cookies from "js-cookie"

export default function SessionAndEvent() {
  const [view, setView] = useState<"list" | "table">("list")
  const [type, setType] = useState<"event" | "session">("event")
  const [showAddForm, setShowAddForm] = useState(false)
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0) 

  const fetchSessions = async () => {
    try {
      const token = Cookies.get('accessToken')
      if (!token) return

      const response = await api.get('/session', {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        },
        withCredentials: false
      })

      if (response.data) {
        setSessions(response.data)
      }
    } catch (err) {
      console.error("Failed to fetch sessions:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [refreshKey]) 

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1) 
  }

  const currentUserRole = Cookies.get("role");
  return (
    <div className="container mx-1 sm:mx-auto max-w-full p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
        <div className="flex space-x-2 w-full sm:w-auto">
          <Button
            variant={view === "list" ? "none" : "none"}
            className={`h-10 px-3 sm:px-4 rounded-[8px] ${view === "list" ? "bg-[#003081] text-white" : "cursor-pointer"} text-sm sm:text-base`}
            onClick={() => setView("list")}
          >
            <List className="h-4 w-4 mr-1 sm:mr-2" />
            List
          </Button>
          <Button
            variant={view === "table" ? "none" : "none"}
            className={`h-10 px-3 sm:px-4 rounded-[8px] ${view === "table" ? "bg-[#003081] text-white" : "cursor-pointer"} text-sm sm:text-base`}
            onClick={() => setView("table")}
          >
            <Table2 className="h-4 w-4 mr-1 sm:mr-2" />
            Table
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-2 w-full sm:w-auto">
          {currentUserRole !== "member" && (
            <Button className="bg-[#003081] text-white rounded-[8px] hover:bg-[#002f8775] cursor-pointer h-10 px-2 sm:px-3 text-sm sm:text-base" onClick={() => setShowAddForm(true)}>
              <MdAddCircleOutline className="h-4 w-4 mr-1 sm:mr-1" />
              <span className="whitespace-nowrap">Create {type === "event" ? "Event" : "Session"}</span>
            </Button>
          )}
          <Select
            value={type}
            onValueChange={(value) => {
              setType(value as "event" | "session")
              setShowAddForm(false)
            }}
          >
            <SelectTrigger className="w-full sm:w-[130px] h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="session">Session</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {showAddForm ? (
        type === "event" ? (
          <AddEventForm onCancel={() => setShowAddForm(false)} onSuccess={handleRefresh} />
        ) : (
          <AddSessionForm onCancel={() => setShowAddForm(false)} onSuccess={handleRefresh} />
        )
      ) : (
        <>
          {type === "event" ? (
            view === "list" ? (
              <EventList />
            ) : (
              <EventTable onDeleteSuccess={handleRefresh} />
            )
          ) : view === "list" ? (
            <SessionList sessions={sessions} />
          ) : (
            <SessionTable sessions={sessions} onDeleteSuccess={handleRefresh} />
          )}
        </>
      )}
    </div>
  )
}