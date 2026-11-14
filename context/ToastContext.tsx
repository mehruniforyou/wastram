"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type?: "success" | "info" | "warning";
  duration?: number;
  image?: string;
  price?: string;
}

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (
    title: string,
    message?: string,
    type?: "success" | "info" | "warning",
    duration?: number,
    image?: string,
    price?: string
  ) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (
      title: string,
      message?: string,
      type: "success" | "info" | "warning" = "success",
      duration = 3500,
      image?: string,
      price?: string
    ) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newToast: ToastMessage = { id, title, message, type, duration, image, price };

      setToasts((prev) => [...prev.slice(-2), newToast]); // Keep max 3 toasts

      setTimeout(() => {
        dismissToast(id);
      }, duration);
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
