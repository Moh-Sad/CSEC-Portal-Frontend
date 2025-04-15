import { Button } from "@/components/ui/button"
import { User, Clock, BarChart, LinkIcon } from "lucide-react"

export function ProfileSidebar() {
  return (
    <div className="flex flex-col gap-2 w-50 border-1 border-gray-300 rounded-[8px]" style={{ margin: "22px" }}>
      <Button className="h-10 w-full justify-start rounded-t-[8px] bg-[#003081] text-white" style={{padding: "15px", paddingLeft: "20px"}}>
        <User className="mr-2 h-4 w-4 font-semibold" />
        Profile
      </Button>
      <Button  className="h-10  w-full justify-start bg-origin-content border-none shadow-none" style={{padding: "15px", paddingLeft: "20px"}}>
        <Clock className="mr-2 h-4 w-4" />
        Attendance
      </Button>
      <Button  className="h-10  w-full justify-start" style={{padding: "15px", paddingLeft: "20px"}}>
        <BarChart className="mr-2 h-4 w-4" />
        Progress
      </Button>
      <Button  className="h-10 w-full justify-start" style={{padding: "15px", paddingLeft: "20px"}}>
        <LinkIcon className="mr-2 h-4 w-4" />
        Head's up!
      </Button>
    </div>
  )
}