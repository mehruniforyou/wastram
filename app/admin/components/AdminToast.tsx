"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from "lucide-react";

export type AdminNotificationType = "success" | "error" | "warning" | "info";

export interface AdminNotificationOptions {
  type: AdminNotificationType;
  title: string;
  message: string;
  details?: any;
  duration?: number;
}

export interface AdminNotificationItem extends AdminNotificationOptions {
  id: string;
  timestamp: number;
}

const NOTIFICATION_EVENT = "ixos_admin_notification";

/**
 * Trigger an in-page UI notification in IXOS Admin Console.
 * Available across all pages, modals, drawers, and tabs.
 */
export function notifyAdmin(
  typeOrOptions: AdminNotificationType | AdminNotificationOptions,
  title?: string,
  message?: string,
  details?: any,
  duration?: number
) {
  let item: AdminNotificationOptions;

  if (typeof typeOrOptions === "object") {
    item = typeOrOptions;
  } else {
    item = {
      type: typeOrOptions,
      title: title || (typeOrOptions === "success" ? "Erfolg" : "Hinweis"),
      message: message || "",
      details,
      duration,
    };
  }

  // Format details nicely if it's an Error or object
  let formattedDetails: string | undefined = undefined;
  if (item.details) {
    if (item.details instanceof Error) {
      formattedDetails = `${item.details.name}: ${item.details.message}${
        item.details.stack ? `\n\nStack:\n${item.details.stack}` : ""
      }`;
    } else if (typeof item.details === "object") {
      try {
        formattedDetails = JSON.stringify(item.details, null, 2);
      } catch {
        formattedDetails = String(item.details);
      }
    } else {
      formattedDetails = String(item.details);
    }
  }

  const payload: AdminNotificationItem = {
    ...item,
    id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: Date.now(),
    details: formattedDetails,
  };

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(NOTIFICATION_EVENT, { detail: payload }));
  }

  return payload.id;
}

notifyAdmin.success = (titleOrMsg: string, message?: string) =>
  notifyAdmin("success", message ? titleOrMsg : "Erfolg", message || titleOrMsg);
notifyAdmin.error = (titleOrMsg: string, message?: string) =>
  notifyAdmin("error", message ? titleOrMsg : "Fehler", message || titleOrMsg);
notifyAdmin.warning = (titleOrMsg: string, message?: string) =>
  notifyAdmin("warning", message ? titleOrMsg : "Hinweis", message || titleOrMsg);
notifyAdmin.info = (titleOrMsg: string, message?: string) =>
  notifyAdmin("info", message ? titleOrMsg : "Info", message || titleOrMsg);

// Make globally accessible on window for maximum resiliency
if (typeof window !== "undefined") {
  (window as any).notifyAdmin = notifyAdmin;
}

function ToastCard({
  item,
  onDismiss,
}: {
  item: AdminNotificationItem;
  onDismiss: (id: string) => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const duration =
      item.duration ??
      (item.type === "success"
        ? 4500
        : item.type === "info"
        ? 5000
        : item.type === "warning"
        ? 8500
        : 14000); // Errors stay 14s or until closed

    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(item.id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [item, onDismiss]);

  const handleCopyDetails = async () => {
    if (!item.details) return;
    try {
      await navigator.clipboard.writeText(
        `[IXOS ADMIN DIAGNOSTIC]\nTitle: ${item.title}\nMessage: ${item.message}\nType: ${item.type}\nDetails:\n${item.details}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
    }
  };

  const config = {
    success: {
      border: "border-l-4 border-l-emerald-500 border-neutral-200 shadow-emerald-500/10",
      badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
      badgeText: "Erfolg",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
    },
    error: {
      border: "border-l-4 border-l-rose-500 border-neutral-200 shadow-rose-500/10",
      badge: "bg-rose-100 text-rose-800 border-rose-200",
      badgeText: "Fehler",
      icon: <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />,
    },
    warning: {
      border: "border-l-4 border-l-amber-500 border-neutral-200 shadow-amber-500/10",
      badge: "bg-amber-100 text-amber-800 border-amber-200",
      badgeText: "Warnung",
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
    },
    info: {
      border: "border-l-4 border-l-blue-500 border-neutral-200 shadow-blue-500/10",
      badge: "bg-blue-100 text-blue-800 border-blue-200",
      badgeText: "Info",
      icon: <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />,
    },
  }[item.type];

  return (
    <div
      className={`pointer-events-auto bg-white border rounded-xl shadow-xl p-4 transition-all duration-300 w-full animate-in slide-in-from-bottom-3 fade-in ${config.border}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {config.icon}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className={`text-[9px] font-bold font-sans uppercase tracking-widest px-2 py-0.5 rounded border ${config.badge}`}
            >
              {config.badgeText}
            </span>
            <span className="text-[10px] text-neutral-400 font-medium">gerade eben</span>
          </div>

          <h4 className="text-xs font-bold font-sans text-neutral-900 leading-snug break-words">
            {item.title}
          </h4>

          {item.message && (
            <p className="text-[11px] text-neutral-600 leading-relaxed mt-1 break-words">
              {item.message}
            </p>
          )}

          {item.details && (
            <div className="mt-2.5 pt-2 border-t border-neutral-100">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setShowDetails(!showDetails)}
                  className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-neutral-600 hover:text-black cursor-pointer transition-colors"
                >
                  {showDetails ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5" /> Details ausblenden
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3.5 h-3.5" /> Diagnose-Details anzeigen
                    </>
                  )}
                </button>

                {showDetails && (
                  <button
                    type="button"
                    onClick={handleCopyDetails}
                    className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-neutral-600 hover:text-black cursor-pointer transition-colors"
                    title="Fehlerdetails in Zwischenablage kopieren"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" /> Kopiert!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Kopieren
                      </>
                    )}
                  </button>
                )}
              </div>

              {showDetails && (
                <pre className="mt-2 p-2.5 bg-neutral-950 text-neutral-200 rounded-lg text-[10px] font-mono leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap break-all select-all border border-neutral-800 shadow-inner">
                  {item.details}
                </pre>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onDismiss(item.id)}
          className="text-neutral-400 hover:text-neutral-700 p-1 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer shrink-0"
          title="Schließen"
          aria-label="Schließen"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/**
 * Container rendering all active admin notifications.
 * Mount this once at the top level of AdminClientPage.
 */
export function AdminToastContainer() {
  const [notifications, setNotifications] = useState<AdminNotificationItem[]>([]);

  const handleDismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  useEffect(() => {
    const handleEvent = (e: Event) => {
      const customEvent = e as CustomEvent<AdminNotificationItem>;
      if (customEvent.detail) {
        setNotifications((prev) => {
          // Keep max 5 notifications at a time to prevent flooding
          const updated = [customEvent.detail, ...prev.filter((n) => n.id !== customEvent.detail.id)];
          return updated.slice(0, 5);
        });
      }
    };

    window.addEventListener(NOTIFICATION_EVENT, handleEvent);
    return () => {
      window.removeEventListener(NOTIFICATION_EVENT, handleEvent);
    };
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-[999999] flex flex-col gap-3 w-[calc(100vw-3rem)] max-w-md pointer-events-none"
      aria-live="polite"
    >
      {notifications.map((item) => (
        <ToastCard key={item.id} item={item} onDismiss={handleDismiss} />
      ))}
    </div>
  );
}
