"use client";

import { Card, CardContent } from "@/components/ui/card";
import CircularProgress from "@/components/pages/allmembers/progress/CircularProgress";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Cookies from "js-cookie";

interface AttendanceProgressProps {
  id: string;
}

interface AttendanceData {
  total: number;
  data: {
    status: "present" | "absent";
  }[];
}

interface HeadsUpData {
  _id: string;
  profile: string;
  session: string;
  reason: string;
  status: "pending" | "approved";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function AttendanceProgress({ id }: AttendanceProgressProps) {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    leftMetric: 0,
    rightMetric: 0,
    Headsup: 0,
    Absent: 0,
    Present: 0,
  });
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('accessToken');
        if (!token) return;

        const urlParams = new URLSearchParams(window.location.search);
        const memberId = urlParams.get("id") || id;

        if (!memberId) return;

        // Fetch attendance data
        const attendanceResponse = await api.get(`attendance/${memberId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
          withCredentials: false,
        });

        // Fetch headsUp data
        const headsUpResponse = await api.get(`headsUp/user/${memberId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
          withCredentials: false,
        });

        const attendanceData: AttendanceData = attendanceResponse.data;
        const headsUpData: HeadsUpData[] = headsUpResponse.data;

        // Count approved headsUp requests
        const approvedHeadsUpCount = headsUpData.filter(
          item => item.status === "approved"
        ).length;

        // Calculate counts for each status
        const counts = {
          Headsup: approvedHeadsUpCount,
          Absent: attendanceData.data.filter(item => item.status === "absent").length,
          Present: attendanceData.data.filter(item => item.status === "present").length,
        };

        // Calculate overall progress percentage
        const totalSessions = attendanceData.total;
        const attendedSessions = counts.Present + (counts.Headsup * 0.5);
        const progress = totalSessions > 0 
          ? Math.round((attendedSessions / (totalSessions + counts.Headsup)) * 100) 
          : 0;

        const weeklyChange = 5; 
        const monthlyChange = 10; 

        setMetrics({
          leftMetric: weeklyChange,
          rightMetric: monthlyChange,
          ...counts
        });
        setOverallProgress(progress);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="w-auto my-5 mr-15">
        <div className="flex flex-col w-80 items-center border-2 border-gray-300 rounded-md my-3 p-3">
          <h3 className="flex justify-center text-lg font-semibold">
            Loading attendance data...
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full my-5 mr-15">
      <div className="flex flex-col w-100 items-center border-2 border-gray-300 rounded-md my-3 p-3">
        <h3 className="flex justify-center text-lg font-semibold">
          Overall Attendance Progress
        </h3>

        <div className="">
          <Card className="col-span-1 md:col-span-3">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="relative h-48 w-48">
                <CircularProgress
                  value={overallProgress}
                  size={192}
                  strokeWidth={16}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold">{overallProgress}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center items-end gap-15">
          <Card>
            <CardContent className="flex flex-col gap-2 p-2 items-center justify-end">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">
                  {metrics.leftMetric}%
                </span>
              </div>
              <h2 className="text-gray-500">Last week</h2>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-2 p-2 items-center justify-end">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">
                  {metrics.rightMetric}%
                </span>
              </div>
              <h2 className="text-gray-500">Last month</h2>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex border-2 border-gray-300 rounded-md w-full text">
        <Card className="w-1/3">
          <CardContent className="p-6">
            <div className="flex items-center gap-8">
              <CircularProgress
                value={0}
                size={40}
                strokeWidth={4}
                color="#E2EAF2"
                progressColor="#003087"
              />
              <div className="flex flex-col">
                <span className="flex justify-center text-3xl font-medium">
                  {metrics.Headsup}
                </span>
                <p className="mt-2 text-lg text-gray-500">Heads up</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="border-1 border-gray-300 h-auto"></div>

        <Card className="w-1/3">
          <CardContent className="flex p-6">
            <div className="flex items-center gap-8">
              <CircularProgress
                value={3}
                size={40}
                strokeWidth={4}
                color="#E2EAF2"
                progressColor="#E2EAF2"
              />
              <div className="flex flex-col">
                <span className="flex justify-center text-3xl font-medium">
                  {metrics.Absent}
                </span>
                <p className="mt-2 text-lg text-gray-500">Absent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="border-1 border-gray-300 h-auto"></div>

        <Card className="w-1/3">
          <CardContent className="p-6">
            <div className="flex items-center gap-8">
              <CircularProgress
                value={75}
                size={40}
                strokeWidth={4}
                color="#E2EAF2"
                progressColor="#E2EAF2"
              />
              <div className="flex flex-col">
                <span className="flex justify-center text-3xl font-medium">
                  {metrics.Present}
                </span>
                <p className="mt-2 text-lg text-gray-500">Present</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}