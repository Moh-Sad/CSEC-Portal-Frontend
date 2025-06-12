"use client";

import api from "@/lib/axios";
import { useEffect, useState } from "react";

interface HeadsUpItem {
  status: string;
  type?: string;
  reason?: string;
  createdAt: string;
}

export default function HeadsUpContent() {
  const [headsUpData, setHeadsUpData] = useState<HeadsUpItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to show toast notifications
  const showToast = (message: string | null, isError = false) => {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${
      isError ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  // Function to fetch headsUp data
  const fetchHeadsUpData = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const memberId = urlParams.get("id");
      
      if (!memberId) {
        showToast('No user ID found in URL', true);
        return [];
      }

      const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
      if (!token) {
        showToast('Authentication required', true);
        return [];
      }

      const response = await api.get(`headsUp/user/${memberId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        },
      });

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = response.data;
      // Filter to only show approved heads-up notifications
      return data.filter((item: HeadsUpItem) => item.status === "approved");
    } catch (error) {
      console.error('Error fetching headsUp data:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchHeadsUpData();
      setHeadsUpData(data);
      setLoading(false);
    };
    
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="mt-6 space-y-4 w-full px-4 md:mr-12">
        <div className="p-4 border-l-4 border-l-blue-900 bg-white rounded-md shadow-sm">
          <div className="flex items-start gap-2">
            <svg className="h-5 w-5 text-blue-900 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-medium text-sm md:text-base">Loading heads-up notifications...</h3>
              <p className="text-sm text-gray-600 mt-1">
                Please wait while we fetch your notifications.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (headsUpData.length === 0) {
    return (
      <div className="mt-6 space-y-4 w-full px-4">
        <div className="p-4 shadow-sm">
          <div className="flex items-start gap-2">
            <div>
              <h3 className="font-medium text-base md:text-lg">No Heads-Up Notifications</h3>
              <p className="text-base text-gray-600 mt-1">
                User doesn't have any approved heads-up notifications at this time.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4 w-full px-4 md:mr-12">
      {headsUpData.map((item) => (
        <div key={item.createdAt} className="p-4 border-l-4 border-l-blue-900 bg-white rounded-md shadow-lg">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 md:h-7 md:w-7 text-blue-900 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h3 className="font-medium text-lg md:text-xl">
                {item.type 
                  ? `${item.type.charAt(0).toUpperCase() + item.type.slice(1)}`
                  : 'Heads-Up Notification'}
              </h3>
              <p className="text-base md:text-lg text-gray-600 mt-1">
                {item.reason || 'No reason provided'}
              </p>
              <p className="text-xs md:text-sm text-gray-500 mt-2">
                {new Date(item.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}