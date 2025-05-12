"use client";

import Events from "@/components/pages/dashboard/UpcomingEvents";
import Calendar from "@/components/pages/dashboard/SessionsCalendar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Calendar as CalendarIcon } from "lucide-react";

export default function Home() {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="relative m-2">
      {/* Mobile toggle button (top right) */}
      <div className="flex justify-end md:hidden">
        <Button
          onClick={() => setShowCalendar(true)}
          className="bg-[#003087] text-white"
          size="sm"
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          Sessions
        </Button>
      </div>

      {/* Main layout for desktop */}
      <div className="hidden md:flex md:m-2">
        <div className="flex gap-4 w-full">
          <Events />
          <Calendar />
        </div>
      </div>

      {/* Mobile calendar overlay */}
      {showCalendar && (
        <div className="fixed inset-0 bg-white z-50 p-4 overflow-y-auto md:hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Sessions</h2>
            <Button
              variant="ghost"
              onClick={() => setShowCalendar(false)}
              size="icon"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <Calendar />
        </div>
      )}

      {/* Mobile events (only show when calendar is not shown) */}
      {!showCalendar && (
        <div className="mt-4 md:hidden">
          <Events />
        </div>
      )}
    </div>
  );
}
