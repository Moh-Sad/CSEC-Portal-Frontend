"use client";

import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import amico from "@/components/icons/images/CalendarIcon.jpg";
import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import AddCalendarForm from "@/components/pages/dashboard/AddCalendar";

interface User {
  _id: string;
  role: string;
}

interface Division {
  _id: string;
  name: string;
  members: User[];
}

interface Session {
  _id: string;
  date: string;
  status: string;
}

interface Attendance {
  status: string;
  sessionDate: string;
}

interface HeadsUp {
  status: string;
  createdAt: string;
}

export default function UpcomingEvent() {
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalDivisions, setTotalDivisions] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [attendanceRate, setAttendanceRate] = useState(0);
  const [upcomingSessions, setUpcomingSessions] = useState(0);
  const [chartData, setChartData] = useState<
    { name: string; thisYear: number; lastYear: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showCalendarForm, setShowCalendarForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("accessToken");
        if (!token) return;

        // Fetch all data in parallel
        const [
          usersResponse,
          divisionsResponse,
          sessionsResponse,
          attendanceResponse,
          headsUpResponse,
        ] = await Promise.all([
          api.get("/user", {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
            withCredentials: false,
          }),
          api.get("/division", {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
            withCredentials: false,
          }),
          api.get("/session", {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
            withCredentials: false,
          }),
          api.get("/attendance/all", {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
            withCredentials: false,
          }),
          api.get("/headsUp", {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
            withCredentials: false,
          }),
        ]);

        // Process data
        const users = usersResponse.data;
        const divisions = divisionsResponse.data.data;
        const sessions = sessionsResponse.data;
        const attendanceRecords = attendanceResponse.data;
        const headsUpRecords = headsUpResponse.data;

        // Calculate metrics - Use total from API response instead of users.length
        const memberCount = users.total; // Changed from users.length
        const divisionCount = divisions.length;

        // Calculate attendance rate
        const presentCount = attendanceRecords.filter(
          (a: Attendance) => a.status === "present"
        ).length;
        const absentCount = attendanceRecords.filter(
          (a: Attendance) => a.status === "absent"
        ).length;
        const excusedCount = headsUpRecords.filter(
          (h: HeadsUp) => h.status === "approved"
        ).length;
        const totalRecords = presentCount + absentCount + excusedCount;
        const rate =
          totalRecords > 0
            ? Math.round((presentCount / totalRecords) * 100)
            : 0;

        // Count upcoming sessions
        const now = new Date();
        const upcoming = sessions.filter(
          (s: Session) => new Date(s.date) > now && s.status === "planned"
        ).length;

        // Count Total Sessions
        const allSessions = sessionsResponse.data;
        const totalSessionsCount = allSessions.length;
        setTotalSessions(totalSessionsCount);

        // Set states
        setTotalMembers(memberCount);
        setTotalDivisions(divisionCount);
        setAttendanceRate(rate);
        setUpcomingSessions(upcoming);

        // Generate dynamic chart data based on actual attendance
        const currentMonth = new Date().getMonth();
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        // Get attendance by month for this year
        const thisYearData = Array(12).fill(0);
        const lastYearData = Array(12).fill(0);

        attendanceRecords.forEach((record: Attendance) => {
          const date = new Date(record.sessionDate);
          const month = date.getMonth();
          const year = date.getFullYear();

          if (year === new Date().getFullYear()) {
            if (record.status === "present") {
              thisYearData[month]++;
            }
          } else if (year === new Date().getFullYear() - 1) {
            if (record.status === "present") {
              lastYearData[month]++;
            }
          }
        });

        // Calculate percentages for each month
        const chartData = months
          .slice(0, currentMonth + 1)
          .map((month, index) => {
            const thisYearPresent = thisYearData[index];
            const lastYearPresent = lastYearData[index];
            const thisYearTotal = attendanceRecords.filter((r: Attendance) => {
              const date = new Date(r.sessionDate);
              return (
                date.getMonth() === index &&
                date.getFullYear() === new Date().getFullYear()
              );
            }).length;
            const lastYearTotal = attendanceRecords.filter((r: Attendance) => {
              const date = new Date(r.sessionDate);
              return (
                date.getMonth() === index &&
                date.getFullYear() === new Date().getFullYear() - 1
              );
            }).length;

            return {
              name: month,
              thisYear:
                thisYearTotal > 0
                  ? Math.round((thisYearPresent / thisYearTotal) * 100)
                  : 0,
              lastYear:
                lastYearTotal > 0
                  ? Math.round((lastYearPresent / lastYearTotal) * 100)
                  : 0,
            };
          });

        setChartData(chartData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const route = useRouter();

  if (loading) {
    return (
      <Card className="overflow-hidden w-full">
        <CardHeader className="w-full p-4">
          <div className="bg-blue-400 p-5 relative w-auto h-60 rounded-2xl">
            <div className="animate-pulse h-full w-full"></div>
          </div>
        </CardHeader>
        <CardContent className="px-3 flex flex-col space-y-4">
          <div className="grid grid-cols-2 divide-x gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="p-6 border-1 border-gray-200 rounded-[8px] m-2"
              >
                <div className="animate-pulse h-24 w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden w-full">
          <CardHeader className="w-full p-4">
            <div className="bg-blue-400 p-5 relative w-auto h-60 rounded-2xl">
              <div
                className="flex justify-center absolute w-19 h-5 top-5 right-5 bg-[#ff5c5c] text-white text-xs font-medium px-2 py-0.5 rounded-full cursor-pointer"
                onClick={() => {
                  route.push("/dashboard/allmembers");
                }}
              >
                Members
              </div>
              <h2 className="text-xl font-bold mb-1">Upcoming Event</h2>
              <p className="text-base my-5 max-w-50">
                Cross-division knowledge-sharing
              </p>
              <div className="hidden flex-col gap-1">
                <div className="flex items-end gap-2 mt-11 ml-6 mb-2">
                  <Button
                    variant="default"
                    className="cursor-pointer bg-[#003087] w-28 h-12 hover:bg-[#002f87b7] text-white rounded-[10px]"
                    onClick={() => setShowCalendarForm(true)}
                  >
                    Add to calendar
                  </Button>
                </div>
              </div>

              <div className="hidden md:block absolute right-23 bottom-10">
                <Image
                  src={amico}
                  alt="Event illustration"
                  className="h[60] w-[120]"
                />
              </div>
            </div>
          </CardHeader>

          {showCalendarForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div>
                <AddCalendarForm
                  onCancel={() => setShowCalendarForm(false)}
                  onSuccess={() => {
                    setShowCalendarForm(false);
                  }}
                />
              </div>
            </div>
          )}

          <CardContent className="px-3 flex flex-col space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x gap-4">
              <div className="p-6 border-1 border-gray-200 rounded-[8px] m-2 dark:bg-gray-800">
                <div className="flex items-center flexflex-col gap-2 mb-1">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                    <CalendarIcon className="h-3 w-3 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-500">Total Members</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-semibold">{totalMembers}</span>
                  <Badge
                    variant="outline"
                    className="text-green-500 bg-green-50 border-green-100"
                  >
                    +4%
                  </Badge>
                </div>
                <hr />
                <div className="text-xs text-gray-400 mt-1">
                  Updated: {format(new Date(), "MMM dd, yyyy")}
                </div>
              </div>

              <div className="p-6 border-1 border-gray-200 rounded-[8px] m-2 dark:bg-gray-800">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                    <CalendarIcon className="h-3 w-3 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-500">Total Divisions</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-semibold">
                    {totalDivisions}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-green-500 bg-green-50 border-green-100"
                  >
                    +2%
                  </Badge>
                </div>
                <hr />
                <div className="text-xs text-gray-400 mt-1">
                  Updated: {format(new Date(), "MMM dd, yyyy")}
                </div>
              </div>
            </div>
          </CardContent>

          <CardContent className="px-3">
            <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x gap-4">
              <div className="p-6 border-1 border-gray-200 rounded-[8px] m-2 dark:bg-gray-800">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                    <CalendarIcon className="h-3 w-3 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-500">Attendance Rate</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-semibold">
                    {attendanceRate}%
                  </span>
                  <Badge
                    variant="outline"
                    className="text-red-500 bg-red-50 border-red-100"
                  >
                    -3%
                  </Badge>
                </div>
                <hr />
                <div className="text-xs text-gray-400 mt-1">
                  Updated: {format(new Date(), "MMM dd, yyyy")}
                </div>
              </div>

              <div className="p-6 border-1 border-gray-200 rounded-[8px] m-2 dark:bg-gray-800">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                    <CalendarIcon className="h-3 w-3 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-500">
                    Upcoming Sessions
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-semibold">
                    {upcomingSessions}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-green-500 bg-green-50 border-green-100"
                  >
                    +10%
                  </Badge>
                </div>
                <hr />
                <div className="text-xs text-gray-400 mt-1">
                  Updated: {format(new Date(), "MMM dd, yyyy")}
                </div>
              </div>
            </div>
          </CardContent>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h4 className="md:text-sm text-[10px] font-medium">
                  Attendance Overview
                </h4>
                <h3 className="md:text-sm text-[10px] font-medium">
                  Total member: {totalMembers}
                </h3>
                <h3 className="md:text-sm text-[10px] font-medium">
                  Total sessions: {totalSessions}
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span className="md:text-xs text-[10px]">This year</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                    <span className="md:text-xs text-[10px]">Last year</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[190px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      `${value}%`,
                      name === "thisYear" ? "This Year" : "Last Year",
                    ]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="thisYear"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="lastYear"
                    stroke="#d1d5db"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Card>
    </>
  );
}
