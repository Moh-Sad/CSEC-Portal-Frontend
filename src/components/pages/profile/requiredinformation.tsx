"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import Image from "next/image";

interface RequiredInformationProps {
  formData: {
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    birth_date: string;
    gender: string;
    graduation_year: string;
    department: string;
    github_handle: string;
    specialization: string 
    telegram_handle: string;
    role: string;
    profile_picture: File | null;
    profile_picture_url: string;
    photo: File | null;
  };
  handleChange: (field: string, value: string | File | null) => void;
  onNext: () => void;
  onCancel: () => void;
  isUpdating?: boolean;
}

export default function RequiredInformation({
  formData,
  handleChange,
  onNext,
  onCancel,
  isUpdating = false,
}: RequiredInformationProps) {
  const [date, setDate] = useState<Date | undefined>(
    formData.birth_date ? new Date(formData.birth_date) : undefined
  );
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    formData.profile_picture_url || null
  );

  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      handleChange("birth_date", format(date, "yyyy-MM-dd"));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleChange("profile_picture", file);

      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    handleChange("profile_picture", null);
    handleChange("profile_picture_url", "");
    setPhotoPreview(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-2">
          <div className="flex flex-col items-start mb-6">
            <div className="relative w-24 h-24 mb-2">
              {photoPreview ? (
                <>
                  <Image
                    src={photoPreview}
                    alt="Profile photo"
                    fill
                    className="rounded-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                  <UserIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            <Label
              htmlFor="profile_picture"
              className="cursor-pointer text-sm text-primary"
            >
              Upload Photo
            </Label>
            <Input
              id="profile_picture"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="first_name" className="text-gray-500 text-sm">
              First Name
            </Label>
            <Input
              id="first_name"
              value={formData.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
              placeholder=""
              required
              className="border border-gray-300 rounded-[8px] h-10"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="phone_number" className="text-gray-500 text-sm">
              Mobile Number
            </Label>
            <Input
              id="phone_number"
              value={formData.phone_number}
              onChange={(e) => handleChange("phone_number", e.target.value)}
              placeholder=""
              required
              className="border border-gray-300 rounded-[8px] h-10"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="birth_date" className="text-gray-500 text-sm">
              Date of Birth
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal border border-gray-300 rounded-[8px] h-10"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1">
            <Label htmlFor="graduation_year" className="text-gray-500 text-sm">
              Expected Graduation Year
            </Label>
            <Input
              id="graduation_year"
              value={formData.graduation_year}
              onChange={(e) => handleChange("graduation_year", e.target.value)}
              placeholder=""
              className="border border-gray-300 rounded-[8px] h-10"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="department" className="text-gray-500 text-sm">
              Department
            </Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => handleChange("department", e.target.value)}
              placeholder=""
              className="border border-gray-300 rounded-[8px] h-10"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col justify-end space-y-6">
          <div className="space-y-1">
            <Label htmlFor="last_name" className="text-gray-500 text-sm">
              Last Name
            </Label>
            <Input
              id="last_name"
              value={formData.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
              placeholder=""
              required
              className="border border-gray-300 rounded-[8px] h-10"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-gray-500 text-sm">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder=""
              required
              className="border border-gray-300 rounded-[8px] h-10"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="gender" className="text-gray-500 text-sm">
              Gender
            </Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleChange("gender", value)}
            >
              <SelectTrigger className="border border-gray-300 rounded-[8px] h-10">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">
                  Prefer not to say
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="specialization" className="text-gray-500 text-sm">
              Specialization
            </Label>
            <Input
              id="specialization"
              value={formData.specialization}
              onChange={(e) => handleChange("specialization", e.target.value)}
              placeholder="e.g. Frontend Developer"
              className="border border-gray-300 rounded-[8px] h-10"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="github_handle" className="text-gray-500 text-sm">
              GitHub
            </Label>
            <Input
              id="github_handle"
              value={formData.github_handle}
              onChange={(e) => handleChange("github_handle", e.target.value)}
              placeholder=""
              className="border border-gray-300 rounded-[8px] h-10"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="telegram_handle" className="text-gray-500 text-sm">
              Telegram Handle
            </Label>
            <Input
              id="telegram_handle"
              value={formData.telegram_handle}
              onChange={(e) => handleChange("telegram_handle", e.target.value)}
              placeholder=""
              className="border border-gray-300 rounded-[8px] h-10"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="rounded-[8px] h-10 px-6 bg-white border border-gray-300 hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={onNext}
          className="rounded-[8px] h-10 px-6 bg-[#003081] hover:bg-[#003081]/90 text-white"
        >
          {isUpdating ? "Update" : "Next"}
        </Button>
      </div>
    </div>
  );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
