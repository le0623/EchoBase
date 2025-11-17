"use client";

import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";

interface Tag {
  id: string;
  name: string;
}

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [error, setError] = useState("");

  // Fetch tags when modal opens
  useEffect(() => {
    if (open) {
      fetchTags();
    }
  }, [open]);

  const fetchTags = async () => {
    try {
      setIsLoadingTags(true);
      const response = await fetch("/api/tags");
      if (response.ok) {
        const data = await response.json();
        setTags(data.tags || []);
      }
    } catch (err) {
      console.error("Failed to fetch tags:", err);
    } finally {
      setIsLoadingTags(false);
    }
  };

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

    // Validate: must have admin role OR at least one tag
    if (!isAdmin && selectedTagIds.length === 0) {
      setError("Please select at least one tag or assign Admin role");
      setIsLoading(false);
      return;
    }

    try {
      // Create invitation
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          role: isAdmin ? "ADMIN" : undefined,
          tagIds: selectedTagIds,
        }),
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
      setIsAdmin(false);
      setSelectedTagIds([]);
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
      setIsAdmin(false);
      setSelectedTagIds([]);
      setError("");
      onOpenChange(false);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
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
            <Label>System Role (Optional)</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="admin"
                checked={isAdmin}
                onCheckedChange={(checked) => setIsAdmin(checked === true)}
                disabled={isLoading}
              />
              <Label
                htmlFor="admin"
                className="text-sm font-normal cursor-pointer"
              >
                Admin - Full system access (manages users, settings, etc.)
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Admin role is for system administration. For document access, assign tags below.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Access Tags (Custom Roles)</Label>
            {isLoadingTags ? (
              <p className="text-sm text-muted-foreground">Loading tags...</p>
            ) : tags.length === 0 ? (
              <div className="p-4 border border-dashed rounded-md">
                <p className="text-sm text-muted-foreground">
                  No tags available. Create tags in the Role and Permission section first.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag.id}`}
                      checked={selectedTagIds.includes(tag.id)}
                      onCheckedChange={() => toggleTag(tag.id)}
                      disabled={isLoading}
                    />
                    <Label
                      htmlFor={`tag-${tag.id}`}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      {tag.name}
                    </Label>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Select one or more tags to grant access to documents with matching tags. Users can access documents that share at least one tag with them.
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
