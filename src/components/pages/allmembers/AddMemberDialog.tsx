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

export function AddMemberDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [division, setDivision] = useState("");
  const [group, setGroup] = useState("");
  const [password, setPassword] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");

  const generateRandomPassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let result = "";
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(result);
  };

  const handleInvite = () => {
    // Handle the invite logic here
    console.log({
      email,
      division,
      group,
      password: password || generatedPassword,
    });

    // Reset form and close dialog
    setEmail("");
    setDivision("");
    setGroup("");
    setPassword("");
    setGeneratedPassword("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="flex rounded-md bg-[#003087] text-white h-12 w-32 items-center justify-center cursor-pointer hover:bg-[#002f87a2]"
        >
          <div className="flex gap-1 items-center justify-center">
            <MdAddCircleOutline size={50} />
            <div>Add Member</div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[350px] h-100 p-4 overflow-hidden"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add New Member
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-3">
          <div className="space-y-2">
            <Select value={division} onValueChange={setDivision}>
              <SelectTrigger
                className="flex w-80 h-11 p-1"
              >
                <SelectValue placeholder="Select Division" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cpd">Competitive Programming </SelectItem>
                <SelectItem value="wdd">Development </SelectItem>
                <SelectItem value="ds">Data Science </SelectItem>
                <SelectItem value="cs">Cyber Security </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Select value={group} onValueChange={setGroup}>
              <SelectTrigger
                className="flex w-80 h-11 p-1"
              >
                <SelectValue placeholder="Select Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="team-a">Team A</SelectItem>
                <SelectItem value="team-b">Team B</SelectItem>
                <SelectItem value="team-c">Team C</SelectItem>
                <SelectItem value="leadership">Leadership</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex w-80 h-11 p-1"
            />
          </div>

          <div className="flex space-x-1">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Random Password"
                value={generatedPassword}
                readOnly
                className="flex w-55 h-11 p-1"
              />
            </div>
            <Button
              onClick={generateRandomPassword}
              className="flex rounded-md text-white w-20 h-11 p-1 shrink-0 cursor-pointer bg-[#003087] hover:bg-[#002f87a2]"
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
              className="flex w-80 h-11 p-1"
            />
          </div>

          <div className="flex justify-center items-center gap-3">
            <div className="flex gap-3 items-center justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setOpen(false)}
                className="flex h-10 w-35 rounded-md items-center justify-center bg-[#34495E0D] cursor-pointer hover:bg-[#48637e0d]"
                aria-label="Cancel"
              >
                <h3 className="ml-1"> Cancel </h3>
              </Button>
            </div>

            <div className="flex gap-5 items-center justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={handleInvite}
                className="flex h-10 w-35 rounded-md items-center justify-center bg-[#003087] cursor-pointer hover:bg-[#002f87a2]"
                aria-label="Invite"
              >
                <h3 className="text-[#F8F8F8] ml-1">
                  {" "}
                  Invite{" "}
                </h3>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
