import { api } from "../api";

const QUEUE_KEY = "ss_offline_assessments";

// 1. Get queued items
export function getOfflineQueue() {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
  } catch {
    return [];
  }
}

// 2. Save assessment locally when offline
export function saveOfflineAssessment(data) {
  const current = getOfflineQueue();
  const newItem = {
    ...data,
    id: `local-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  current.push(newItem);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(current));
  
  // Custom event trigger karein taaki UI counter instantly update ho
  window.dispatchEvent(new Event("offline-queue-updated"));
  return newItem;
}

// 3. Auto-sync queue to Central Server (MongoDB / Render)
export async function syncOfflineAssessments(onProgress) {
  const queue = getOfflineQueue();
  if (queue.length === 0) return { count: 0 };

  let successCount = 0;
  const remaining = [];

  for (const item of queue) {
    try {
      // Direct Central Server API par POST
      await api("/triage/submit", {
        method: "POST",
        body: JSON.stringify(item),
      });
      successCount++;
      if (onProgress) onProgress(successCount, queue.length);
    } catch (err) {
      console.error("Failed to sync item:", item, err);
      remaining.push(item); // Agar failed hua toh queue mein hi rakhega
    }
  }

  // Sync complete hone par storage update karein
  localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
  window.dispatchEvent(new Event("offline-queue-updated"));

  return { synced: successCount, remaining: remaining.length };
}