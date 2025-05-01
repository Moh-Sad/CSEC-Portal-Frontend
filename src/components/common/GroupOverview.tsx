"use client";

import { useState, useEffect } from "react";
import GroupCardComponents from "@/components/common/GroupCard";
import { useParams } from "next/navigation";

interface ApiGroup {
  _id: string;
  name: string;
  division: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Group {
  id: number;
  name: string;
  totalMembers: number;
  members: Members[];
}

interface Members {
  id: number;
  name: string;
  speciality: string;
  imgUrl?: string;
}

export default function GroupOverview({ 
  linkText = "View All" 
}: { 
  linkText?: string 
}) {
  const [searchQuery] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const divisionId = params.divisionId as string;

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/group/${divisionId}`);
        if (!response.ok) throw new Error('Failed to fetch groups');
        const data: ApiGroup[] = await response.json();

        // Transform API data to match your existing UI structure
        const transformedGroups = data.map((group, index) => ({
          id: index + 1, // Using index as ID to match your static data
          name: group.name,
          totalMembers: group.members.length,
          members: group.members.map((_, memberIndex) => ({
            id: memberIndex + 1,
            name: `Member ${memberIndex + 1}`,
            speciality: ["Front-End", "Full-Stack", "UI/UX Designer", "Back-End"][memberIndex % 4],
            imgUrl: "https://github.com/shadcn.png"
          }))
        }));

        setGroups(transformedGroups);
      } catch (error) {
        console.error("Error fetching groups:", error);
        // Fallback to your static data if API fails
        setGroups([
          {
            id: 1,
            name: "Group 1",
            totalMembers: 10,
            members: [
              {
                id: 1,
                name: "Mohammed Sadik",
                speciality: "Front-End",
                imgUrl: "https://avatars.githubusercontent.com/u/176960856?v=4",
              },
              {
                id: 2,
                name: "Kiya Kebe",
                speciality: "Full-Stack",
                imgUrl: "https://media.licdn.com/dms/image/v2/D4E03AQFkoyf763lEgA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1718289469344?e=2147483647&v=beta&t=qoAMCeIxXD_kTzeUZApL6qb3mFzfjmGtB6ObIeJ_5-U",
              },
              {
                id: 3,
                name: "Mahelet Yared",
                speciality: "UI/UX Designer",
                imgUrl: "https://github.com/shadcn.png",
              },
              {
                id: 4,
                name: "Hussen Beshier",
                speciality: "Back-End",
                imgUrl: "https://github.com/shadcn.png",
              },
            ]
          },
          {
            id: 2,
            name: "Group 2",
            totalMembers: 15,
            members: [
              {
                id: 1,
                name: "John Smith",
                speciality: "Back-End",
                imgUrl: "https://github.com/shadcn.png",
              },
              {
                id: 2,
                name: "Estifanos Tadese",
                speciality: "UI/UX Designer",
                imgUrl: "https://github.com/shadcn.png",
              },
              {
                id: 3,
                name: "Kaleb Yonatan",
                speciality: "Full-Stack",
                imgUrl: "https://github.com/shadcn.png",
              },
              {
                id: 4,
                name: "Abdullah Abdulrehman",
                speciality: "Front-End",
                imgUrl: "https://github.com/shadcn.png",
              },
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [divisionId]);

  const filteredDivisions = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-wrap gap-4 w-full">
        {filteredDivisions.map((group) => (
          <GroupCardComponents
            key={group.id}
            division={group}
            className="flex-1 min-w-[calc(50%-1.5rem)]"
            linkText={linkText}
          />
        ))}
      </div>
    </div>
  );
}