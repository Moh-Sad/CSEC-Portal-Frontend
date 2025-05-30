import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { format, formatDistanceToNow } from "date-fns"

export default function SessionList({ sessions }: { sessions: any[] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ended":
        return "bg-red-500"
      case "planned":
        return "bg-yellow-500"
      default:
        return "bg-blue-500"
    }
  }

  const getTimeLeft = (date: string, status: string) => {
    const sessionDate = new Date(date)
    if (status === "ended") {
      return `${formatDistanceToNow(sessionDate)} ago`
    }
    return `${formatDistanceToNow(sessionDate)} left`
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <Card key={session._id} className="border-t-0 border-r-0 border-b border-l-0 rounded-none shadow-none">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row justify-between items-start py-4 gap-2 sm:gap-0">
              <div className="space-y-1">
                <div className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(session.status)}`}
                  ></div>
                  <h3 className="text-base sm:text-lg font-medium">{session.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-500">{session.description || "No description"}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {session.groups.map((group: string, index: number) => (
                    <Badge key={index} variant="outline" className="rounded-full text-xs">
                      Group {index + 1}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs sm:text-sm">{getTimeLeft(session.date, session.status)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Time: {session.startTime} - {session.endTime}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}