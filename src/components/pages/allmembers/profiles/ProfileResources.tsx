import { LuExternalLink } from "react-icons/lu";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Cookies from "js-cookie";

interface Resource {
  _id: string;
  name: string;
  link: string;
  uploaded_by: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  division?: {
    _id: string;
    name: string;
  };
}

export function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const token = Cookies.get('accessToken');
        if (!token) {
          setError("Authentication required");
          return;
        }

        const urlParams = new URLSearchParams(window.location.search);    
        const userId = urlParams.get('id');
        
        if (!userId) {
          setError("User ID not found");
          return;
        }

        const response = await api.get(`/resource/user/${userId}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          },
          withCredentials: false
        }).catch(error => {
          // Handle specific error statuses without logging to console
          if (error.response) {
            switch (error.response.status) {
              case 404:
                setError("Resources not found for this user");
                break;
              case 500:
                setError("Server error - please try again later");
                break;
              default:
                setError("Failed to fetch resources");
            }
          } else {
            setError("Network error - please check your connection");
          }
          return { data: null }; // Return empty data to prevent further errors
        });

        if (!response?.data) {
          // Error already set by the catch block
          return;
        }

        setResources(response.data);
      } catch (error: any) {
        // Fallback error handling
        if (!error.response) {
          setError("Network error - please check your connection");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003087]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col my-8">
        <div className="flex space-y-2">
          <span className="w-86 text-sm font-medium text-gray-500">
            Resource Name
          </span>
          <span className="text-sm font-medium text-gray-500">Link</span>
        </div>
        <div className="flex justify-center items-center h-32 text-gray-500">
          {error}
        </div>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="flex flex-col my-8">
        <div className="flex space-y-2">
          <span className="w-86 text-sm font-medium text-gray-500">
            Resource Name
          </span>
          <span className="text-sm font-medium text-gray-500">Link</span>
        </div>
        <div className="flex justify-center items-center h-32 text-gray-500">
          No resources available
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col my-8">
      <div className="flex space-y-2">
        <span className="w-115 text-sm font-medium text-gray-500">
          Resource Name
        </span>
        <span className="text-sm font-medium text-gray-500">Link</span>
      </div>
      <div className="flex flex-col gap-8">
        {resources.map((resource) => (
          <div key={resource._id} className="flex gap-20">
            <span className="font-medium w-95">{resource.name}</span>
            <span className="font-medium w-100 overflow-x-hidden">
              {resource.link}
            </span>
            <a href={resource.link} target="_blank" rel="noopener noreferrer" className="hover:text-[#003087] hover:transform hover:scale-110 transition-transform duration-200">
              <LuExternalLink />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}