"use client";

import { useState, useEffect } from "react";
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
import api from "@/lib/axios";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";

interface HeadsUpDialogProps {
  memberId?: string;
  sessionId?: string;
}

export function HeadsupDialog({ memberId, sessionId }: HeadsUpDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
  const searchParams = useSearchParams();
  
  // Static list of heads-up types
  const headsUpTypes = [
    { id: "emergency", name: "Emergency" },
    { id: "medical case", name: "Medical Case" },
    { id: "family issue", name: "Family Issue" }
  ];

  // Get IDs from props or URL params
  const finalMemberId = memberId || searchParams.get("memberId");
  const finalSessionId = sessionId || searchParams.get("sessionId");

  // Custom toast function
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleSubmit = async () => {
    if (!selectedType || !reason.trim()) {
      setError("Please select a type and provide a reason");
      return;
    }

    if (!finalMemberId || !finalSessionId) {
      setError("Missing required information");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = Cookies.get("accessToken");
      if (!token) throw new Error("No authentication token found");

      await api.post('/headsUp', {
        profile: finalMemberId,
        session: finalSessionId,
        type: selectedType,
        reason: reason
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        },
        withCredentials: false
      });

      // Show success toast
      showToast("Heads-up submitted successfully!", 'success');

      // Reset form and close dialog on success
      setSelectedType("");
      setReason("");
      setTimeout(() => setOpen(false), 300);
    } catch (err) {
      console.error("Failed to submit heads-up:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to submit heads-up";
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <div className={`
          fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg
          ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white
          animate-fade-in-out max-w-[90vw] text-sm sm:text-base
        `}>
          {toast.message}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            className="flex rounded-md bg-[#003087] text-white h-8 w-22 items-center justify-center cursor-pointer hover:bg-[#002f87a2]"
          >
            <div className="flex gap-1 items-center justify-center">
              <div>Heads Up</div>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] max-w-[95vw] p-4 overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Heads Up</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-3">
            <div className="space-y-2">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="flex w-full h-11 px-3 py-6 border-1 border-gray-300 rounded-[8px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {headsUpTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <textarea
                placeholder="Enter a reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="flex w-full min-h-[120px] px-3 py-2 border-1 border-gray-300 rounded-[8px] placeholder-gray-500"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setOpen(false);
                  setSelectedType("");
                  setReason("");
                  setError("");
                }}
                className="flex h-10 w-full sm:w-35 rounded-md items-center justify-center bg-[#34495E0D] cursor-pointer hover:bg-[#48637e0d]"
                aria-label="Cancel"
                disabled={loading}
              >
                <h3 className="ml-1">Cancel</h3>
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={handleSubmit}
                className="flex h-10 w-full sm:w-35 rounded-md items-center justify-center bg-[#003087] cursor-pointer hover:bg-[#002f87a2]"
                aria-label="Add"
                disabled={loading}
              >
                <h3 className="text-[#F8F8F8] ml-1">
                  {loading ? "Submitting..." : "Add"}
                </h3>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* CSS for the toast animation */}
      <style jsx>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-20px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
        .animate-fade-in-out {
          animation: fadeInOut 3s ease-in-out forwards;
        }
      `}</style>
    </>
  );
}