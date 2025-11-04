"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InviteUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInviteSuccess?: () => void;
}

export default function InviteUserModal({
  open,
  onOpenChange,
  onInviteSuccess,
}: InviteUserModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ADMIN" | "EDITOR" | "VIEWER">("EDITOR");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInvite = async () => {
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Create invitation
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, role }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send invitation");
      }

      const result = await response.json();

      // Send invitation email
      const emailResponse = await fetch("/api/users/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ invitationId: result.invitation.id }),
      });

      if (!emailResponse.ok) {
        const emailData = await emailResponse.json();
        throw new Error(emailData.error || "Failed to send invitation email");
      }

      // Success - reset form and close modal
      setEmail("");
      setRole("EDITOR");
      setError("");
      onOpenChange(false);

      // Call success callback to refresh user list
      if (onInviteSuccess) {
        onInviteSuccess();
      }

      alert("Invitation sent successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to send invitation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setEmail("");
      setRole("EDITOR");
      setError("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>
            Send an invitation to a new user to join your organization.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              value={role}
              onChange={(e) =>
                setRole(e.target.value as "ADMIN" | "EDITOR" | "VIEWER")
              }
              disabled={isLoading}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="ADMIN">Admin - Full access</option>
              <option value="EDITOR">Editor - Can create and edit content</option>
              <option value="VIEWER">Viewer - Read-only access</option>
            </select>
            <p className="text-xs text-muted-foreground">
              {role === "ADMIN" &&
                "Full access to all features and settings"}
              {role === "EDITOR" &&
                "Can create, edit, and manage documents and content"}
              {role === "VIEWER" &&
                "Can view documents and content but cannot make changes"}
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleInvite} disabled={isLoading || !email.trim()}>
            {isLoading ? "Sending..." : "Send Invitation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
