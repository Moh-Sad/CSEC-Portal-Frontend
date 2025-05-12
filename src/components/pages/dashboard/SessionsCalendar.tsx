"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";

interface Session {
  _id: string;
  title: string;
  division: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface Division {
  _id: string;
  name: string;
}

export default function SessionCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [sessions, setSessions] = useState<Session[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("accessToken");
        if (!token) return;

        const [sessionsResponse, divisionsResponse] = await Promise.all([
          api.get("/session", {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          }),
          api.get("/division", {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          }),
        ]);

        setSessions(sessionsResponse.data);
        setDivisions(divisionsResponse.data.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDivisionName = (divisionId: string) =>
    divisions.find((d) => d._id === divisionId)?.name || divisionId;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const sessionDates = new Set(
    sessions.map((session) => format(parseISO(session.date), "yyyy-MM-dd"))
  );

  const groupedSessions = sessions.reduce((acc, session) => {
    const sessionDate = parseISO(session.date);
    if (!isSameMonth(sessionDate, currentMonth)) return acc;

    const dateKey = format(sessionDate, "EEEE, dd MMMM yyyy");
    acc[dateKey] = acc[dateKey] || [];
    acc[dateKey].push({
      time: session.startTime,
      division: session.division,
      title: session.title,
    });

    return acc;
  }, {} as Record<string, Array<{ time: string; division: string; title: string }>>);

  const startDay = monthStart.getDay();
  const weeksInMonth = Math.ceil((startDay + monthDays.length) / 7);
  const datesGrid = Array.from({ length: weeksInMonth }, (_, weekIndex) =>
    Array.from({ length: 7 }, (_, dayIndex) => {
      const dayOffset = weekIndex * 7 + dayIndex - startDay;
      return dayOffset >= 0 && dayOffset < monthDays.length
        ? monthDays[dayOffset]
        : null;
    })
  );

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="space-y-4 border border-gray-300 rounded-xl p-5 mt-3 w-full max-w-100 h-fit mr-3 dark:bg-gray-800">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <h3 className="text-lg font-semibold">Session</h3>
          <CalendarIcon className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant="none"
                size="icon"
                className="h-7 w-7 bg-[#003087] rounded-[8px]"
                onClick={handlePrevMonth}
              >
                <ChevronLeft className="h-4 w-4 text-white" />
              </Button>
              <div className="font-semibold text-xl">
                {format(currentMonth, "MMMM, yyyy")}
              </div>
              <Button
                variant="none"
                size="icon"
                className="h-7 w-7 bg-[#003087] rounded-[8px]"
                onClick={handleNextMonth}
              >
                <ChevronRight className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>

          <div className="mb-4">
            <div className="grid grid-cols-7 text-center text-xs mb-1">
              {days.map((day, i) => (
                <div key={i} className="py-1">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-sm">
              {datesGrid.flat().map((date, i) => (
                <div
                  key={i}
                  className={cn(
                    "aspect-square flex items-center justify-center rounded-full",
                    date && isSameDay(date, new Date()) && "bg-[#003087] text-white",
                    !date && "invisible",
                    date &&
                      sessionDates.has(format(date, "yyyy-MM-dd")) &&
                      !isSameDay(date, new Date()) &&
                      "bg-[#002f876c]",
                    date &&
                      !sessionDates.has(format(date, "yyyy-MM-dd")) &&
                      !isSameDay(date, new Date()) &&
                      "hover:bg-muted"
                  )}
                >
                  {date && format(date, "d")}
                </div>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="space-y-3">
                    {[...Array(2)].map((_, j) => (
                      <div key={j} className="flex gap-3">
                        <div className="h-4 bg-gray-200 rounded w-10"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedSessions).map(([day, events]) => (
                <div key={day}>
                  <div className="text-sm font-medium mb-2">{day}</div>
                  <div className="space-y-3">
                    {events.map((event, eventIdx) => (
                      <div key={eventIdx} className="flex gap-3">
                        <div className="text-sm font-medium w-10">{event.time}</div>
                        <div className="flex-1">
                          <div className="text-xs text-muted-foreground">
                            {getDivisionName(event.division)}
                          </div>
                          <div className="text-sm">{event.title}</div>
                          <hr />
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {Object.keys(groupedSessions).length === 0 && (
                <div className="text-center text-sm text-gray-500 py-4">
                  No sessions scheduled for this month
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
