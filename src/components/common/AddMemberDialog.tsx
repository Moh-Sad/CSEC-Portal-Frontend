"use client";

import { MdAddCircleOutline } from "react-icons/md";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";
import Cookies from "js-cookie";

const divisions = [
  { id: "680a9a2b9e86262d7c618bd1", name: "Competitive Programming" },
  { id: "680a9a2c9e86262d7c618bd4", name: "Development" },
  { id: "680a9a2d9e86262d7c618bd7", name: "Data Science" },
  { id: "680a9a2e9e86262d7c618bda", name: "Cyber Security" },
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

interface AddMemberDialogProps {
  onMemberAdded: () => void;
}

export function AddMemberDialog({ onMemberAdded }: AddMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [divisionId, setDivision] = useState("");
  const [groupId, setGroup] = useState("");
  const [password, setPassword] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, title: '', message: '', type: 'success' });

  const showToast = (title: string, message: string, type: 'success' | 'error') => {
    setToast({ show: true, title, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let result = "";
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(result);
  };

  const handleInvite = async () => {
    const finalPassword = password || generatedPassword;

    if (!email || !divisionId || !groupId || !finalPassword) {
      showToast("Missing Fields", "Please fill all fields or generate a password.", 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = Cookies.get('accessToken');
      if (!token) {
        throw new Error('Unauthorized: No token found.');
      }

      await api.post('/user/register', {
        email,
        divisionId,
        groupId,
        password: finalPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      showToast("Member Invited", "Successfully invited the member!", 'success');
      setTimeout(() => {
        onMemberAdded(); // Trigger the refresh callback after a delay
      }, 3000); 
      
      // Reset form
      setEmail("");
      setDivision("");
      setGroup("");
      setPassword("");
      setGeneratedPassword("");
      setOpen(false);
    } catch (error: any) {
      let errorMessage = "Something went wrong. Try again.";
      
      if (error.response) {
        if (error.response.status === 403) {
          errorMessage = "Forbidden: You don't have permission to perform this action.";
        } else if (error.response.status === 401) {
          errorMessage = "Unauthorized: Please login again.";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      showToast("Invite Failed", errorMessage, 'error');
      console.log("Invite Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableGroups: { id: string; name: string }[] = divisionId ? allGroups[divisionId] || [] : [];

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            className="flex rounded-md bg-[#003087] text-white h-12 w-32 items-center justify-center cursor-pointer hover:bg-[#002f87a2]"
          >
            <div className="flex gap-1 items-center justify-center">
              <MdAddCircleOutline size={20} />
              <div>Add Member</div>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-auto h-auto p-4 overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Add New Member
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-3">
            <div className="space-y-2">
              <Select value={divisionId} onValueChange={(value) => {
                setDivision(value);
                setGroup("");
              }}>
                <SelectTrigger className="flex w-70 h-11 px-3 py-6 border-1 border-gray-300 rounded-[8px]">
                  <SelectValue placeholder="Select Division" />
                </SelectTrigger>
                <SelectContent>
                  {divisions.map((div) => (
                    <SelectItem key={div.id} value={div.id}>
                      {div.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Select value={groupId} onValueChange={setGroup} disabled={!divisionId}>
                <SelectTrigger className="flex w-70 h-11 px-3 py-6 border-1 border-gray-300 rounded-[8px]">
                  <SelectValue placeholder="Select Group" />
                </SelectTrigger>
                <SelectContent>
                  {availableGroups.map((grp) => (
                    <SelectItem key={grp.id} value={grp.id}>
                      {grp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex w-70 h-11 px-3 py-6 border-1 border-gray-300 rounded-[8px]"
              />
            </div>

            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="Random Password"
                value={generatedPassword}
                readOnly
                className="flex w-47 h-11 px-3 py-6 border-1 border-gray-300 rounded-[8px]"
              />

              <Button
                onClick={generateRandomPassword}
                className="flex rounded-md text-white w-20 h-11 px-3 py-6 shrink-0 cursor-pointer bg-[#003087] hover:bg-[#002f87a2a]"
              >
                Generate
              </Button>
            </div>

            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter Generated Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex w-70 h-11 px-3 py-6 border-1 border-gray-300 rounded-[8px]"
              />
            </div>

            <div className="flex justify-center items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setOpen(false)}
                className="flex h-10 w-35 rounded-md items-center justify-center bg-[#34495E0D] cursor-pointer hover:bg-[#48637e0d]"
                aria-label="Cancel"
                disabled={isSubmitting}
              >
                <h3 className="ml-1"> Cancel </h3>
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={handleInvite}
                className="flex h-10 w-35 rounded-md items-center justify-center bg-[#003087] cursor-pointer hover:bg-[#002f87a2]"
                aria-label="Invite"
                disabled={isSubmitting}
              >
                <h3 className="text-[#F8F8F8] ml-1">
                  {isSubmitting ? "Adding..." : "Invite"}
                </h3>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {toast.show && (
        <div className={`fixed top-4 right-4 z-100 p-4 rounded-md shadow-lg ${
          toast.type === 'success' ? 'bg-green-400' : 'bg-red-400'
        } text-white max-w-md`}>
          <div className="font-bold">{toast.title}</div>
          <div>{toast.message}</div>
        </div>
      )}
    </>
  );
}