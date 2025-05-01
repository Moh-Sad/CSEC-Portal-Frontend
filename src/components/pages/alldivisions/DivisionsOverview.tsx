"use client";

import { useState, useEffect } from "react";
import DivisionCard from "./DivisionCard";
import api from "@/lib/axios";
import Cookies from "js-cookie";

export default function DivisionsOverview() {
  const [searchQuery, setSearchQuery] = useState("");
  const [divisions, setDivisions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const token = Cookies.get('accessToken');
        if (!token) throw new Error('Please login to view divisions');

        const response = await api.get('/division', {
          headers: { 
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          },
          withCredentials: false
        });

        if (response.data?.data) {
          setDivisions(response.data.data);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch divisions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDivisions();
  }, []);

  const filteredDivisions = divisions.filter(division =>
    division.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading divisions...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Search divisions..."
          className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="absolute left-3 top-2.5">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        {filteredDivisions.map((division) => (
          <DivisionCard 
            key={division._id} 
            division={division} 
            className="flex-1 min-w-[calc(50%-1.5rem)]" 
          />
        ))}
      </div>
    </div>
  );
}