"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Invitation {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  expiresAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

interface PendingInvitesTabProps {
  onInvitationUpdate?: () => void;
}

export default function PendingInvitesTab({ onInvitationUpdate }: PendingInvitesTabProps) {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingInvitationId, setProcessingInvitationId] = useState<string | null>(null);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await fetch("/api/users/invitations?status=PENDING");
      if (response.ok) {
        const data = await response.json();
        setInvitations(data.invitations || []);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to load invitations");
      }
    } catch (err) {
      setError("An error occurred while loading invitations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async (invitationId: string) => {
    setProcessingInvitationId(invitationId);
    try {
      const response = await fetch("/api/users/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ invitationId }),
      });

      if (response.ok) {
        alert("Invitation sent successfully!");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to resend invitation");
      }
    } catch (err) {
      alert("An error occurred while resending invitation");
    } finally {
      setProcessingInvitationId(null);
    }
  };

  const handleCancel = async (invitationId: string, email: string) => {
    if (!confirm(`Are you sure you want to cancel the invitation for ${email}?`)) {
      return;
    }

    setProcessingInvitationId(invitationId);
    try {
      // Update invitation status to REVOKED
      const response = await fetch(`/api/users/invitations/${invitationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "REVOKED" }),
      });

      if (response.ok) {
        alert("Invitation cancelled successfully!");
        fetchInvitations(); // Refresh the list
        if (onInvitationUpdate) {
          onInvitationUpdate(); // Notify parent to refresh stats
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to cancel invitation");
      }
    } catch (err) {
      alert("An error occurred while cancelling invitation");
    } finally {
      setProcessingInvitationId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return formatDate(dateString);
  };

  const getRoleBadge = (role: string) => {
    return (
      <span className="px-3 py-0.5 text-xs font-semibold rounded-full border border-gray-200 bg-gray-50">
        {role}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        {error}
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No pending invitations
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {invitations.length} {invitations.length === 1 ? "invitation" : "invitations"} pending
        </p>
      </div>

      {/* Invite List */}
      <ul className="space-y-3">
        {invitations.map((invite) => (
          <li
            key={invite.id}
            className="flex justify-between items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="size-12 rounded-full overflow-hidden flex justify-center items-center bg-gray-200">
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg font-bold">
                  {invite.email[0].toUpperCase()}
                </div>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-semibold text-sm truncate">{invite.email}</span>
                <div className="flex items-center gap-2 mt-1">
                  {getRoleBadge(invite.role)}
                  <span className="text-xs font-medium text-gray-500">
                    Invited {formatRelativeTime(invite.createdAt)}
                  </span>
                </div>
                <span className="text-xs text-gray-400 mt-1">
                  Expires {formatDate(invite.expiresAt)}
                </span>
              </div>
            </div>

            <div className="inline-flex gap-2">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleResend(invite.id)}
                disabled={processingInvitationId === invite.id}
              >
                {processingInvitationId === invite.id ? "Sending..." : "Resend"}
              </button>
              <button
                type="button"
                className="btn btn-secondary-light btn-sm"
                onClick={() => handleCancel(invite.id, invite.email)}
                disabled={processingInvitationId === invite.id || processingInvitationId !== null}
              >
                {processingInvitationId === invite.id ? "Cancelling..." : "Cancel"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
