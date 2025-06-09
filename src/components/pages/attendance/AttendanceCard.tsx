import { MdAddCircleOutline } from "react-icons/md";
import { useRouter } from "next/navigation";

interface AttendanceCardProps {
  sessionId: string;
  status: "Ended" | "Planned";
  title: string;
  description: string;
  date: string;
  groups: string[];
}

export default function AttendanceCard({
  sessionId,
  status,
  title,
  description,
  date,
  groups,
}: AttendanceCardProps) {
  const router = useRouter();
  
  const handleAttendanceClick = () => {
    router.push(`/dashboard/attendance/group/?sessionId=${sessionId}`);
  };

  // Determine the color based on the status
  const statusColor =
    status === "Ended"
      ? "bg-red-50 text-red-500"
      : "bg-yellow-50 text-yellow-500";

  return (
    <div className="rounded-lg border border-gray-300 p-4 sm:p-6 mb-4 w-full sm:w-[98%]">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:gap-5">
            <span
              className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${statusColor} mb-2 sm:mb-0 w-fit`}
            >
              {status}
            </span>
            <h3 className="font-medium">{title}</h3>
          </div>
          <p className="text-sm">{description}</p>
          <p className="text-xs text-gray-500 mt-1">{date}</p>
        </div>
        <button 
          className="flex items-center justify-center h-7 space-x-1 bg-[#003087] text-white text-xs px-3 py-3 rounded-[8px] cursor-pointer w-full sm:w-auto" 
          onClick={handleAttendanceClick}
        >
          <MdAddCircleOutline className="h-4 w-4" />
          <span className="text-sm">Attendance</span>
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {groups.map((group, index) => (
          <span
            key={index}
            className="px-2 py-1 border-2 border-gray-300 text-xs rounded-2xl"
          >
            {group}
          </span>
        ))}
      </div>
    </div>
  );
}