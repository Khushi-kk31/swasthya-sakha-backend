import React, { useState, useEffect } from "react";
import { getOfflineQueue, syncOfflineAssessments } from "../utils/offlineSync";
import { useDispatch } from "react-redux";
import { setToast } from "../store/uiSlice";

export default function OfflineBadge() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queueCount, setQueueCount] = useState(getOfflineQueue().length);
  const [isSyncing, setIsSyncing] = useState(false);
  const dispatch = useDispatch();

  const handleSync = async () => {
    if (!navigator.onLine || isSyncing) return;
    const initialQueue = getOfflineQueue();
    if (initialQueue.length === 0) return;

    setIsSyncing(true);
    try {
      const res = await syncOfflineAssessments();
      if (res.synced > 0) {
        dispatch(
          setToast({
            type: "success",
            message: `Synced ${res.synced} offline records to Central Server!`,
          })
        );
        // Dashboard state refresh karne ke liye page reload ya event
        window.location.reload();
      }
    } catch (err) {
      console.error("Auto-sync error:", err);
    } finally {
      setIsSyncing(false);
      setQueueCount(getOfflineQueue().length);
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      handleSync(); // Browser online aate hi Auto-Sync trigger
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    const updateQueue = () => {
      setQueueCount(getOfflineQueue().length);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("offline-queue-updated", updateQueue);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("offline-queue-updated", updateQueue);
    };
  }, []);

  if (isSyncing) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-300">
        🔄 Syncing Local Data...
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300">
        📶 Offline Mode ({queueCount} Saved)
      </div>
    );
  }

  return (
    <button
      onClick={queueCount > 0 ? handleSync : undefined}
      disabled={isSyncing}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
        queueCount > 0
          ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 cursor-pointer"
          : "bg-emerald-50/60 text-emerald-700 border-emerald-200/80 cursor-default"
      }`}
    >
      <span>🟢</span>
      {queueCount > 0 ? `Sync (${queueCount} Pending)` : "Online-ready"}
    </button>
  );
}