import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import api from "@/lib/axios"
import { formatDistanceToNow, parseISO } from "date-fns"

export default function EventList() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = Cookies.get('accessToken')
        if (!token) return

        const response = await api.get('/event', {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          },
          withCredentials: false
        })

        if (response.data) {
          setEvents(response.data)
        }
      } catch (err) {
        console.error("Failed to fetch events:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[75vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003087]"></div>
      </div>
    );
  }

  const formatEventDateTime = (dateString: string, timeString: string) => {
    try {
      const isoDate = new Date(`${dateString}T${timeString}`)
      if (!isNaN(isoDate.getTime())) return isoDate
      return parseISO(dateString)
    } catch {
      return new Date()
    }
  }

  return (
    <div className="space-y-4">
      {events.map((event) => {
        const eventDate = formatEventDateTime(event.date, event.time)
        const timeLeft = isNaN(eventDate.getTime()) 
          ? "Invalid date" 
          : formatDistanceToNow(eventDate, { addSuffix: true })
        
        return (
          <Card key={event._id} className="border-t-0 border-r-0 border-b border-l-0 rounded-none shadow-none">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row justify-between items-start py-4 gap-2 sm:gap-0">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        event.status === "ended" 
                          ? "bg-red-500" 
                          : event.status === "planned" 
                            ? "bg-yellow-500" 
                            : "bg-blue-500"
                      }`}
                    ></div>
                    <h3 className="text-base sm:text-lg font-medium">{event.title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">{event.description}</p>
                  <div className="mt-2">
                    <Badge variant="outline" className="rounded-full text-xs">
                      {event.visibility === "public" ? "Public" : "Members"}
                    </Badge>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs sm:text-sm">{timeLeft}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Date: {isNaN(eventDate.getTime()) ? "Invalid date" : eventDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}