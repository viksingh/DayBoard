"use client";

import { useState, useEffect } from "react";
import { Cloud, CloudOff, Loader2 } from "lucide-react";
import { onSyncStatus, SyncStatus, isFirestoreConfigured } from "@/lib/firestore-sync";

export default function SyncIndicator() {
  const [status, setStatus] = useState<SyncStatus>("connecting");
  const [error, setError] = useState<string>();
  const [showTooltip, setShowTooltip] = useState(false);

  const firestoreEnabled = isFirestoreConfigured();

  useEffect(() => {
    if (!firestoreEnabled) {
      setStatus("offline");
      return;
    }
    return onSyncStatus((s, err) => {
      setStatus(s);
      setError(err);
    });
  }, [firestoreEnabled]);

  if (!firestoreEnabled) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-stone-400" title="Local storage only">
        <CloudOff className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Local</span>
      </div>
    );
  }

  const config: Record<SyncStatus, { color: string; label: string; icon: React.ReactNode }> = {
    connecting: {
      color: "text-blue-500",
      label: "Connecting...",
      icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
    },
    connected: {
      color: "text-emerald-500",
      label: "Synced",
      icon: <Cloud className="w-3.5 h-3.5" />,
    },
    error: {
      color: "text-red-500",
      label: error || "Sync error",
      icon: <CloudOff className="w-3.5 h-3.5" />,
    },
    offline: {
      color: "text-stone-400",
      label: "Offline",
      icon: <CloudOff className="w-3.5 h-3.5" />,
    },
  };

  const c = config[status];

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className={`flex items-center gap-1.5 text-xs ${c.color} cursor-default`}>
        {c.icon}
        <span className="hidden sm:inline">{status === "connected" ? "Synced" : status === "error" ? "Error" : "..."}</span>
      </div>
      {showTooltip && (
        <div className="absolute right-0 top-6 z-50 bg-stone-800 text-white text-xs rounded-lg px-3 py-1.5 whitespace-nowrap shadow-lg">
          {c.label}
        </div>
      )}
    </div>
  );
}
