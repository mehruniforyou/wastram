"use client";

import React, { useEffect } from "react";
import { X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidthClass?: string;
  containerId?: string;
  backLabel?: string;
}

export default function AdminDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  children,
  footer,
  maxWidthClass = "max-w-5xl",
  containerId,
  backLabel = "Zurück zur Overview",
}: AdminDrawerProps) {
  // Lock body scroll and register Escape key listener
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Extract clean max-width token for desktop centered layout
  const tokens = maxWidthClass.split(" ");
  const widthToken = tokens.find(t => t.startsWith("max-w-") || t.startsWith("md:max-w-") || t.startsWith("lg:max-w-")) || "max-w-5xl";
  const cleanWidth = widthToken.replace(/^(md:|lg:|xl:)/, "");

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* MOBILE LAYOUT (< md): 85% Full-Screen Bottom Sheet           */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="md:hidden">
        {/* Backdrop for Mobile */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Bottom Sheet */}
        <div
          id={containerId ? `${containerId}-mobile` : undefined}
          className="fixed inset-x-0 bottom-0 h-[85vh] max-h-[85vh] rounded-t-3xl bg-card text-card-foreground border-t border-border shadow-2xl flex flex-col overflow-hidden animate-admin-drawer z-50"
          role="dialog"
          aria-modal="true"
        >
          {/* Mobile Drag Handle Indicator */}
          <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto my-2.5 shrink-0" />

          {/* Mobile Header */}
          <div className="px-5 py-3.5 bg-card flex items-center justify-between gap-3 border-b border-border shrink-0">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider truncate">
                  {title}
                </h2>
                {badge}
              </div>
              {subtitle && (
                <p className="text-[11px] text-muted-foreground font-medium mt-0.5 truncate">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Mobile Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-5 py-5 bg-card text-card-foreground space-y-5">
            {children}
          </div>

          {/* Mobile Footer */}
          {footer && (
            <div className="px-5 py-3 bg-card border-t border-border flex items-center justify-end gap-2 shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* DESKTOP LAYOUT (>= md): DEDICATED FULL-PAGE VIEW              */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div
        id={containerId}
        className="hidden md:flex fixed inset-0 z-50 bg-background text-foreground flex-col overflow-y-auto animate-fade-in"
        role="dialog"
        aria-modal="true"
      >
        {/* Dedicated Desktop Page Header Bar */}
        <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-6 sm:px-10 py-4 shrink-0 shadow-2xs">
          <div className={`mx-auto w-full ${cleanWidth} flex items-center justify-between gap-6`}>
            {/* Left: Back Button + Title + Badge */}
            <div className="flex items-center gap-4 min-w-0">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="gap-2 h-9 text-xs font-semibold cursor-pointer shrink-0"
                title="Zurück"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{backLabel}</span>
              </Button>

              <div className="h-6 w-px bg-border shrink-0" />

              <div className="min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-base lg:text-lg font-bold text-foreground tracking-tight truncate">
                    {title}
                  </h1>
                  {badge}
                </div>
                {subtitle && (
                  <p className="text-xs text-muted-foreground font-medium truncate mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Right: Quick close & ESC indicator */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted text-xs font-medium transition-colors cursor-pointer"
                title="Close (Esc)"
              >
                <span className="text-[10px] font-mono border border-border rounded px-1.5 py-0.5 text-muted-foreground">ESC</span>
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Dedicated Desktop Page Body Container */}
        <main className="flex-1">
          <div className={`mx-auto w-full ${cleanWidth} px-6 sm:px-10 py-8`}>
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-10 shadow-xs text-card-foreground">
              {children}
            </div>
          </div>
        </main>

        {/* Dedicated Desktop Page Footer (Optional) */}
        {footer && (
          <footer className="sticky bottom-0 z-30 bg-card/95 backdrop-blur-md border-t border-border px-6 sm:px-10 py-3.5 shrink-0">
            <div className={`mx-auto w-full ${cleanWidth} flex items-center justify-end gap-3`}>
              {footer}
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}
