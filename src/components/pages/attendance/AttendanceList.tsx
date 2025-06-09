"use client";

import AttendanceCard from "@/components/pages/attendance/AttendanceCard";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import { format, parseISO } from "date-fns";

// Division and group mappings
const divisions = [
  { id: "680a9a2b9e86262d7c618bd1", name: "CP Division" },
  { id: "680a9a2c9e86262d7c618bd4", name: "Dev Division" },
  { id: "680a9a2d9e86262d7c618bd7", name: "Data Science Division" },
  { id: "680a9a2e9e86262d7c618bda", name: "Cyber Security Division" },
];

const allGroups: Record<string, { id: string; name: string }[]> = {
  "680a9a2b9e86262d7c618bd1": [
    { id: "680a9a2f9e86262d7c618bde", name: "Group 1" },
    { id: "680a9a2f9e86262d7c618be1", name: "Group 2" },
    { id: "680a9a309e86262d7c618be4", name: "Group 3" },
    { id: "680a9a309e86262d7c618be7", name: "Group 4" },
  ],
  "680a9a2c9e86262d7c618bd4": [
    { id: "680a9a319e86262d7c618beb", name: "Group 1" },
    { id: "680a9a329e86262d7c618bee", name: "Group 2" },
    { id: "680a9a339e86262d7c618bf1", name: "Group 3" },
    { id: "680a9a339e86262d7c618bf4", name: "Group 4" },
  ],
  "680a9a2d9e86262d7c618bd7": [
    { id: "680a9a359e86262d7c618bf8", name: "Group 1" },
    { id: "680a9a369e86262d7c618bfb", name: "Group 2" },
    { id: "680a9a369e86262d7c618bfe", name: "Group 3" },
    { id: "680a9a379e86262d7c618c01", name: "Group 4" },
  ],
  "680a9a2e9e86262d7c618bda": [
    { id: "680a9a379e86262d7c618c05", name: "Group 1" },
    { id: "680a9a389e86262d7c618c08", name: "Group 2" },
    { id: "680a9a399e86262d7c618c0b", name: "Group 3" },
    { id: "680a9a3a9e86262d7c618c0e", name: "Group 4" },
  ],
};

interface Session {
  _id: string;
  title: string;
  division: string; // division ID
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  groups: string[]; // group IDs
}

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default function AttendanceList() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = Cookies.get('accessToken');
        if (!token) return;

        const response = await api.get("/session", {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          },
          withCredentials: false
        });

        setSessions(response.data);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Get division name by ID
  const getDivisionName = (divisionId: string) => {
    const division = divisions.find(d => d.id === divisionId);
    return division ? division.name : divisionId;
  };

  // Get group names by division ID and group IDs
  const getGroupNames = (divisionId: string, groupIds: string[]) => {
    const groups = allGroups[divisionId] || [];
    return groupIds.map(groupId => {
      const group = groups.find(g => g.id === groupId);
      return group ? group.name : groupId;
    });
  };

  const formatSessionDate = (dateString: string) => {
    return format(parseISO(dateString), 'EEEE, dd MMMM yyyy');
  };

  if (loading) {
    return (
      <div className="w-full pl-2 overflow-y-scroll scrollbar-custom">
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse p-4 border rounded-lg">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-16"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pl-2">
      <div className="space-y-2 h-[calc(100vh-200px)] sm:h-110 overflow-y-scroll scrollbar-custom">
        {sessions.map((session) => (
          <AttendanceCard
            key={session._id}
            sessionId={session._id}
            status={capitalizeFirstLetter(session.status) as "Ended" | "Planned"}
            title={getDivisionName(session.division)}
            description={session.title}
            date={formatSessionDate(session.date)}
            groups={getGroupNames(session.division, session.groups || [])}
          />
        ))}
        {sessions.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No sessions found
          </div>
        )}
      </div>
    </div>
  );
}